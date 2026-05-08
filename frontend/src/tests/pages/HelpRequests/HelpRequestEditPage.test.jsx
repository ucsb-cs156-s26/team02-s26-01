import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import HelpRequestEditPage from "main/pages/HelpRequests/HelpRequestEditPage";

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
describe("HelpRequestEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).timeout();
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
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByText(/Welcome/);
      await screen.findByText("Edit HelpRequest");
      expect(
        screen.queryByTestId("HelpRequestForm-requesterEmail"),
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
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).reply(200, {
        id: 17,
        requesterEmail: "test@test.com",
        teamId: "testTeamId",
        tableOrBreakoutRoom: "table01",
        requestTime: "2022-02-02T00:00",
        explanation: "testExplanation",
        solved: true,
      });
      axiosMock.onPut("/api/helprequests").reply(200, {
        id: "17",
        requesterEmail: "new@test.com",
        teamId: "testTeamIdNew",
        tableOrBreakoutRoom: "table02",
        requestTime: "2023-02-02T00:00",
        explanation: "testExplanationNew",
        solved: false,
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText(/Welcome/);
      await screen.findByTestId("HelpRequestForm-requesterEmail");
      expect(
        screen.getByTestId("HelpRequestForm-requesterEmail"),
      ).toBeInTheDocument();
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-requesterEmail");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "HelpRequestForm-requesterEmail",
      );
      const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
      const tableOrBreakoutRoomField = screen.getByTestId(
        "HelpRequestForm-tableOrBreakoutRoom",
      );
      const requestTimeField = screen.getByTestId(
        "HelpRequestForm-requestTime",
      );
      const explanationField = screen.getByTestId(
        "HelpRequestForm-explanation",
      );
      const solvedField = screen.getByTestId("HelpRequestForm-solved");
      const submitButton = screen.getByTestId("HelpRequestForm-submit");

      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toHaveValue("test@test.com");
      expect(teamIdField).toHaveValue("testTeamId");
      expect(tableOrBreakoutRoomField).toHaveValue("table01");
      expect(requestTimeField).toHaveValue("2022-02-02T00:00");
      expect(explanationField).toHaveValue("testExplanation");
      expect(solvedField).toBeChecked();

      expect(submitButton).toBeInTheDocument();
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-requesterEmail");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "HelpRequestForm-requesterEmail",
      );
      const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
      const tableOrBreakoutRoomField = screen.getByTestId(
        "HelpRequestForm-tableOrBreakoutRoom",
      );
      const requestTimeField = screen.getByTestId(
        "HelpRequestForm-requestTime",
      );
      const explanationField = screen.getByTestId(
        "HelpRequestForm-explanation",
      );
      const solvedField = screen.getByTestId("HelpRequestForm-solved");
      const submitButton = screen.getByTestId("HelpRequestForm-submit");

      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toHaveValue("test@test.com");
      expect(teamIdField).toHaveValue("testTeamId");
      expect(tableOrBreakoutRoomField).toHaveValue("table01");
      expect(requestTimeField).toHaveValue("2022-02-02T00:00");
      expect(explanationField).toHaveValue("testExplanation");
      expect(solvedField).toBeChecked();

      expect(submitButton).toBeInTheDocument();

      fireEvent.change(requesterEmailField, {
        target: { value: "new@test.com" },
      });
      fireEvent.change(teamIdField, { target: { value: "testTeamIdNew" } });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "table02" },
      });
      fireEvent.change(requestTimeField, {
        target: { value: "2023-02-02T00:00" },
      });
      fireEvent.change(explanationField, {
        target: { value: "testExplanationNew" },
      });
      fireEvent.click(solvedField);

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "HelpRequest Updated - id: 17 requesterEmail: new@test.com",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "new@test.com",
          teamId: "testTeamIdNew",
          tableOrBreakoutRoom: "table02",
          requestTime: "2023-02-02T00:00",
          explanation: "testExplanationNew",
          solved: false,
        }),
      ); // posted object
    });
  });
});
