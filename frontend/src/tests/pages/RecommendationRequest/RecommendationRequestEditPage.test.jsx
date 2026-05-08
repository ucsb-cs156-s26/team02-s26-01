import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";
import { beforeEach, afterEach } from "vitest";

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
      id: 17,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("RecommendationRequestEditPage tests", () => {
  const renderPage = () => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestEditPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/recommendationRequest", { params: { id: 17 } })
        .timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      renderPage();

      await screen.findByText("Edit RecommendationRequest");
      expect(
        screen.queryByTestId("RecommendationRequestForm-requesterEmail"),
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
      axiosMock
        .onGet("/api/recommendationRequest", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          requesterEmail: "alex.johnson@ucsb.edu",
          professorEmail: "dr.smith@ucsb.edu",
          explanation: "Request for recommendation letter",
          dateRequested: "2023-05-15T10:30",
          dateNeeded: "2023-08-20T15:00",
          done: false,
        });
      axiosMock.onPut("/api/recommendationRequest").reply(200, {
        id: "17",
        requesterEmail: "alex.johnson@ucsb.edu",
        professorEmail: "dr.smith@ucsb.edu",
        explanation: "Updated recommendation letter request",
        dateRequested: "2023-06-12T12:00",
        dateNeeded: "2023-09-01T17:00",
        done: true,
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    test("renders without crashing", async () => {
      renderPage();

      await screen.findByTestId("RecommendationRequestForm-requesterEmail");
      expect(
        screen.getByTestId("RecommendationRequestForm-requesterEmail"),
      ).toBeInTheDocument();
    });

    test("Is populated with the data provided", async () => {
      renderPage();

      await screen.findByTestId("RecommendationRequestForm-requesterEmail");

      const idField = screen.getByTestId("RecommendationRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "RecommendationRequestForm-requesterEmail",
      );
      const professorEmailField = screen.getByTestId(
        "RecommendationRequestForm-professorEmail",
      );
      const explanationField = screen.getByLabelText("Explanation");
      const dateRequestedField = screen.getByLabelText(
        "Date Requested (in UTC)",
      );
      const dateNeededField = screen.getByLabelText("Date Needed (in UTC)");
      const doneField = screen.getByLabelText("done");
      const submitButton = screen.getByText("Update");

      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toHaveValue("alex.johnson@ucsb.edu");
      expect(professorEmailField).toHaveValue("dr.smith@ucsb.edu");
      expect(explanationField).toHaveValue("Request for recommendation letter");
      expect(dateRequestedField).toHaveValue("2023-05-15T10:30");
      expect(dateNeededField).toHaveValue("2023-08-20T15:00");
      expect(doneField).not.toBeChecked();
      expect(submitButton).toBeInTheDocument();
    });

    test("Changes when you click Update", async () => {
      renderPage();

      await screen.findByTestId("RecommendationRequestForm-requesterEmail");

      const requesterEmailField = screen.getByTestId(
        "RecommendationRequestForm-requesterEmail",
      );
      const professorEmailField = screen.getByTestId(
        "RecommendationRequestForm-professorEmail",
      );
      const explanationField = screen.getByLabelText("Explanation");
      const dateRequestedField = screen.getByLabelText(
        "Date Requested (in UTC)",
      );
      const dateNeededField = screen.getByLabelText("Date Needed (in UTC)");
      const doneField = screen.getByLabelText("done");
      const submitButton = screen.getByText("Update");

      expect(requesterEmailField).toHaveValue("alex.johnson@ucsb.edu");
      expect(professorEmailField).toHaveValue("dr.smith@ucsb.edu");
      expect(explanationField).toHaveValue("Request for recommendation letter");
      expect(dateRequestedField).toHaveValue("2023-05-15T10:30");
      expect(dateNeededField).toHaveValue("2023-08-20T15:00");

      fireEvent.change(requesterEmailField, {
        target: { value: "alex.johnson@ucsb.edu" },
      });
      fireEvent.change(professorEmailField, {
        target: { value: "dr.smith@ucsb.edu" },
      });
      fireEvent.change(explanationField, {
        target: { value: "Updated recommendation letter request" },
      });
      fireEvent.change(dateRequestedField, {
        target: { value: "2023-06-12T12:00" },
      });
      fireEvent.change(dateNeededField, {
        target: { value: "2023-09-01T17:00" },
      });
      fireEvent.click(doneField);

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "RecommendationRequest Updated - id: 17 requesterEmail: alex.johnson@ucsb.edu",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequest" });

      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "alex.johnson@ucsb.edu",
          professorEmail: "dr.smith@ucsb.edu",
          explanation: "Updated recommendation letter request",
          dateRequested: "2023-06-12T12:00",
          dateNeeded: "2023-09-01T17:00",
          done: true,
        }),
      );
    });
  });
});
