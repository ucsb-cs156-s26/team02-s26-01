import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("RecommendationRequestForm tests", () => {
  const expectedLabels = [
    "Requester Email",
    "Professor Email",
    "Explanation",
    "Date Requested (in UTC)",
    "Date Needed (in UTC)",
    "Done",
  ];
  const testId = "RecommendationRequestForm";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders correctly with no initialContents", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedLabels.forEach((labelText) => {
      expect(screen.getByText(labelText)).toBeInTheDocument();
    });

    expect(screen.queryByTestId(`${testId}-id`)).not.toBeInTheDocument();
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <Router>
        <RecommendationRequestForm
          initialContents={
            recommendationRequestFixtures.oneRecommendationRequest
          }
        />
      </Router>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedLabels.forEach((labelText) => {
      expect(screen.getByText(labelText)).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-id`)).toHaveValue("1");
    expect(screen.getByText("Id")).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-requesterEmail`)).toHaveValue(
      "alex.johnson@ucsb.edu",
    );
    expect(screen.getByTestId(`${testId}-professorEmail`)).toHaveValue(
      "dr.smith@ucsb.edu",
    );
    expect(screen.getByLabelText("Explanation")).toHaveValue(
      "Request for recommendation letter for graduate program",
    );
    expect(screen.getByLabelText("Date Requested (in UTC)")).toHaveValue(
      "2023-05-15T10:30",
    );
    expect(screen.getByLabelText("Date Needed (in UTC)")).toHaveValue(
      "2023-08-20T15:00",
    );
    expect(screen.getByLabelText("done")).not.toBeChecked();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );

    const cancelButton = await screen.findByTestId(`${testId}-cancel`);
    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );

    const submitButton = await screen.findByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Requester Email is required/);
    expect(screen.getByText(/Professor Email is required/)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Requested is required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Needed is required/)).toBeInTheDocument();

    fireEvent.change(screen.getByTestId(`${testId}-requesterEmail`), {
      target: { value: "a".repeat(256) },
    });
    fireEvent.change(screen.getByTestId(`${testId}-professorEmail`), {
      target: { value: "b".repeat(256) },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText(/Max length 255 characters/)).toHaveLength(2);
    });
  });

  test("that submitAction is called with the correct data", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <RecommendationRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );

    fireEvent.change(screen.getByTestId(`${testId}-requesterEmail`), {
      target: { value: "student@ucsb.edu" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-professorEmail`), {
      target: { value: "professor@ucsb.edu" },
    });
    fireEvent.change(screen.getByLabelText("Explanation"), {
      target: { value: "Recommendation for a summer research program." },
    });
    fireEvent.change(screen.getByLabelText("Date Requested (in UTC)"), {
      target: { value: "2026-05-06T13:30" },
    });
    fireEvent.change(screen.getByLabelText("Date Needed (in UTC)"), {
      target: { value: "2026-06-15T17:45" },
    });
    fireEvent.click(screen.getByLabelText("done"));

    fireEvent.click(screen.getByText(/Create/));

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalledTimes(1));
    expect(mockSubmitAction).toHaveBeenCalledWith(
      {
        requesterEmail: "student@ucsb.edu",
        professorEmail: "professor@ucsb.edu",
        explanation: "Recommendation for a summer research program.",
        dateRequested: "2026-05-06T13:30",
        dateNeeded: "2026-06-15T17:45",
        done: true,
      },
      expect.anything(),
    );
  });
});
