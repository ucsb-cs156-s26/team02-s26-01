import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";

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
    useParams: vi.fn(() => ({
      id: 1,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;

describe("MenuItemReviewEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/menuitemreview", { params: { id: 1 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Menu Item Review");
      expect(
        screen.queryByTestId("MenuItemReviewForm-id"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/menuitemreview", { params: { id: 1 } }).reply(200, {
        id: 1,
        itemId: 67,
        reviewerEmail: "oscarvaleriano@ucsb.edu",
        stars: 5,
        dateReviewed: "2026-05-05T02:18:52",
        comments: "no comments",
      });
      axiosMock.onPut("/api/menuitemreview").reply(200, {
        id: 1,
        itemId: 67,
        reviewerEmail: "oscarvaleriano@ucsb.edu",
        stars: 5,
        dateReviewed: "2026-05-05T02:18:52",
        comments: "updated comments",
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-id");

      const idField = screen.getByTestId("MenuItemReviewForm-id");
      const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
      const reviewerEmailField = screen.getByTestId(
        "MenuItemReviewForm-reviewerEmail",
      );
      const starsField = screen.getByTestId("MenuItemReviewForm-stars");
      const dateReviewedField = screen.getByTestId(
        "MenuItemReviewForm-dateReviewed",
      );
      const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      expect(idField).toHaveValue("1");
      expect(itemIdField).toHaveValue("67");
      expect(reviewerEmailField).toHaveValue("oscarvaleriano@ucsb.edu");
      expect(starsField).toHaveValue(5);
      expect(dateReviewedField).toHaveValue("2026-05-05T02:18");
      expect(commentsField).toHaveValue("no comments");
      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(itemIdField, { target: { value: "67" } });
      fireEvent.change(reviewerEmailField, {
        target: { value: "oscarvaleriano@ucsb.edu" },
      });
      fireEvent.change(starsField, {
        target: { value: "5", valueAsNumber: 5 },
      });
      fireEvent.change(dateReviewedField, {
        target: { value: "2026-05-05T02:18" },
      });
      fireEvent.change(commentsField, {
        target: { value: "updated comments" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Menu Item Review Updated - id: 1 itemId: 67",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });
      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 1 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          itemId: "67",
          reviewerEmail: "oscarvaleriano@ucsb.edu",
          stars: "5",
          dateReviewed: "2026-05-05T02:18",
          comments: "updated comments",
        }),
      );
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-id");

      const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
      const reviewerEmailField = screen.getByTestId(
        "MenuItemReviewForm-reviewerEmail",
      );
      const starsField = screen.getByTestId("MenuItemReviewForm-stars");
      const dateReviewedField = screen.getByTestId(
        "MenuItemReviewForm-dateReviewed",
      );
      const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      fireEvent.change(itemIdField, { target: { value: "67" } });
      fireEvent.change(reviewerEmailField, {
        target: { value: "oscarvaleriano@ucsb.edu" },
      });
      fireEvent.change(starsField, {
        target: { value: "5", valueAsNumber: 5 },
      });
      fireEvent.change(dateReviewedField, {
        target: { value: "2026-05-05T02:18" },
      });
      fireEvent.change(commentsField, {
        target: { value: "updated comments" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Menu Item Review Updated - id: 1 itemId: 67",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });
    });
  });

  describe("when the backend returns a review without a dateReviewed", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/menuitemreview", { params: { id: 1 } }).reply(200, {
        id: 1,
        itemId: 67,
        reviewerEmail: "oscarvaleriano@ucsb.edu",
        stars: 5,
        comments: "no comments",
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("renders the form with an empty dateReviewed field", async () => {
      const restoreConsole = mockConsole();
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-id");

      expect(screen.getByTestId("MenuItemReviewForm-dateReviewed")).toHaveValue(
        "",
      );
      restoreConsole();
    });
  });
});
