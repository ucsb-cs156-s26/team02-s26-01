import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
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

describe("RecommendationRequestCreatePage tests", () => {
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

  test("renders without crashing", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("RecommendationRequestForm-requesterEmail"),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText("Create New RecommendationRequest"),
    ).toBeInTheDocument();
  });

  test("on submit, makes request to backend, and redirects to /recommendationrequest", async () => {
    const queryClient = new QueryClient();
    const recommendationRequest = {
      id: 1,
      requesterEmail: "alex.johnson@ucsb.edu",
      professorEmail: "dr.smith@ucsb.edu",
      explanation: "Request for recommendation letter for graduate program",
      dateRequested: "2023-05-15T10:30",
      dateNeeded: "2023-08-20T15:00",
      done: true,
    };

    axiosMock
      .onPost("/api/recommendationRequest/post")
      .reply(202, recommendationRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("RecommendationRequestForm-requesterEmail"),
      ).toBeInTheDocument();
    });

    const requesterEmailInput = screen.getByTestId(
      "RecommendationRequestForm-requesterEmail",
    );
    const professorEmailInput = screen.getByTestId(
      "RecommendationRequestForm-professorEmail",
    );
    const explanationInput = screen.getByLabelText("Explanation");
    const dateRequestedInput = screen.getByLabelText("Date Requested (in UTC)");
    const dateNeededInput = screen.getByLabelText("Date Needed (in UTC)");
    const doneInput = screen.getByLabelText("done");
    const createButton = screen.getByText("Create");

    fireEvent.change(requesterEmailInput, {
      target: { value: "alex.johnson@ucsb.edu" },
    });
    fireEvent.change(professorEmailInput, {
      target: { value: "dr.smith@ucsb.edu" },
    });
    fireEvent.change(explanationInput, {
      target: {
        value: "Request for recommendation letter for graduate program",
      },
    });
    fireEvent.change(dateRequestedInput, {
      target: { value: "2023-05-15T10:30" },
    });
    fireEvent.change(dateNeededInput, {
      target: { value: "2023-08-20T15:00" },
    });
    fireEvent.click(doneInput);
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "alex.johnson@ucsb.edu",
      professorEmail: "dr.smith@ucsb.edu",
      explanation: "Request for recommendation letter for graduate program",
      dateRequested: "2023-05-15T10:30",
      dateNeeded: "2023-08-20T15:00",
      done: true,
    });

    expect(mockToast).toBeCalledWith(
      "New RecommendationRequest Created - id: 1 requesterEmail: alex.johnson@ucsb.edu",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequest" });
  });

  test("on submit with invalid data, shows errors and does not send to backend", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    fireEvent.click(await screen.findByText("Create"));

    await screen.findByText(/Requester Email is required/);
    expect(screen.getByText(/Professor Email is required/)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Requested is required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Needed is required/)).toBeInTheDocument();
    expect(axiosMock.history.post.length).toBe(0);
    expect(mockNavigate).not.toBeCalled();
  });
});
