import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import RecommendationRequestTable from "main/components/RecommendationRequest/RecommendationRequestTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { toast } from "react-toastify";
import { onDeleteSuccess } from "main/utils/recommendationRequestUtils";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock("react-toastify", async () => {
  const originalModule = await vi.importActual("react-toastify");
  return {
    ...originalModule,
    toast: vi.fn(),
  };
});

describe("RecommendationRequestTable tests", () => {
  const expectedHeaders = [
    "id",
    "Requester Email",
    "Professor Email",
    "Explanation",
    "Date Requested",
    "Date Needed",
    "Done",
  ];
  const expectedFields = [
    "id",
    "requesterEmail",
    "professorEmail",
    "explanation",
    "dateRequested",
    "dateNeeded",
    "done",
  ];
  const testId = "RecommendationRequestTable";

  const renderWithProviders = (ui) => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders empty table correctly", () => {
    const currentUser = currentUserFixtures.adminUser;

    renderWithProviders(
      <RecommendationRequestTable
        recommendationRequests={[]}
        currentUser={currentUser}
      />,
    );

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      expect(
        screen.queryByTestId(`${testId}-cell-row-0-col-${field}`),
      ).not.toBeInTheDocument();
    });
  });

  test("has the expected column headers, content and buttons for admin user", () => {
    const currentUser = currentUserFixtures.adminUser;

    renderWithProviders(
      <RecommendationRequestTable
        recommendationRequests={
          recommendationRequestFixtures.threeRecommendationRequests
        }
        currentUser={currentUser}
      />,
    );

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-${field}`),
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "2",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`),
    ).toHaveTextContent("maria.garcia@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-professorEmail`),
    ).toHaveTextContent("prof.brown@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-explanation`),
    ).toHaveTextContent("Letter of recommendation for internship opportunity");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-dateRequested`),
    ).toHaveTextContent("2023-06-10T14:20:00");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-dateNeeded`),
    ).toHaveTextContent("2023-09-15T12:00:00");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-done`),
    ).toHaveTextContent("true");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "5",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-requesterEmail`),
    ).toHaveTextContent("liam.wilson@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-done`),
    ).toHaveTextContent("false");

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("has the expected column headers and content for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    renderWithProviders(
      <RecommendationRequestTable
        recommendationRequests={
          recommendationRequestFixtures.threeRecommendationRequests
        }
        currentUser={currentUser}
      />,
    );

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-${field}`),
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "2",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`),
    ).toHaveTextContent("maria.garcia@ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "5",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-professorEmail`),
    ).toHaveTextContent("dr.davis@ucsb.edu");

    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`),
    ).not.toBeInTheDocument();
  });

  test("Edit button navigates to the edit page", async () => {
    const currentUser = currentUserFixtures.adminUser;

    renderWithProviders(
      <RecommendationRequestTable
        recommendationRequests={
          recommendationRequestFixtures.threeRecommendationRequests
        }
        currentUser={currentUser}
      />,
    );

    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-id`),
    ).toHaveTextContent("2");

    fireEvent.click(screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`));

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith(
        "/recommendationrequest/edit/2",
      ),
    );
  });

  test("Delete button calls delete callback", async () => {
    const currentUser = currentUserFixtures.adminUser;

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/recommendationRequest")
      .reply(200, { message: "RecommendationRequest deleted" });

    renderWithProviders(
      <RecommendationRequestTable
        recommendationRequests={
          recommendationRequestFixtures.threeRecommendationRequests
        }
        currentUser={currentUser}
      />,
    );

    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-id`),
    ).toHaveTextContent("2");

    fireEvent.click(
      screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`),
    );

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].url).toBe("/api/recommendationRequest");
    expect(axiosMock.history.delete[0].params).toEqual({ id: 2 });

    axiosMock.restore();
  });

  test("onDeleteSuccess calls toast with the message", () => {
    onDeleteSuccess("RecommendationRequest deleted");

    expect(toast).toHaveBeenCalledWith("RecommendationRequest deleted");
  });
});
