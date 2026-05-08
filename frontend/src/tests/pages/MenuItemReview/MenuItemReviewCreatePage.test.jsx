import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

describe("MenuItemReviewCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    vi.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();

  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Item Id")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /menuitemreview", async () => {
    const queryClient = new QueryClient();
    const menuItemReview = {
      id: 1,
      itemId: 67,
      reviewerEmail: "oscarvaleriano@ucsb.edu",
      stars: 5,
      dateReviewed: "2026-05-05T02:18",
      comments: "no comments",
    };

    axiosMock.onPost("/api/menuitemreview/post").reply(202, menuItemReview);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Item Id")).toBeInTheDocument();
    });

    const itemIdInput = screen.getByLabelText("Item Id");
    const reviewerEmailInput = screen.getByLabelText("Reviewer Email");
    const starsInput = screen.getByLabelText("Stars");
    const dateReviewedInput = screen.getByLabelText(
      "Date Reviewed (iso format)",
    );
    const commentsInput = screen.getByLabelText("Comments");
    const createButton = screen.getByText("Create");

    fireEvent.change(itemIdInput, { target: { value: 67 } });
    fireEvent.change(reviewerEmailInput, {
      target: { value: "oscarvaleriano@ucsb.edu" },
    });
    fireEvent.change(starsInput, { target: { value: 5 } });
    fireEvent.change(dateReviewedInput, {
      target: { value: "2026-05-05T02:18" },
    });
    fireEvent.change(commentsInput, { target: { value: "no comments" } });
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      itemId: "67",
      reviewerEmail: "oscarvaleriano@ucsb.edu",
      stars: "5",
      dateReviewed: "2026-05-05T02:18",
      comments: "no comments",
    });

    expect(mockToast).toBeCalledWith(
      "New Menu Item Review Created - id: 1 itemId: 67",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });
  });
});
