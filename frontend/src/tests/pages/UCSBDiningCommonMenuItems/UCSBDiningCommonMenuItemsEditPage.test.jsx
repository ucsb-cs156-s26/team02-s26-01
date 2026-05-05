import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import UCSBDiningCommonMenuItemsEditPage from "main/pages/UCSBDiningCommonMenuItems/UCSBDiningCommonMenuItemsEditPage";

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
describe("UCSBDiningCommonMenuItemsEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/ucsbdiningcommonmenuitems", { params: { id: 17 } }).timeout();
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
            <UCSBDiningCommonMenuItemsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByText(/Welcome/);
      await screen.findByText("Edit UCSBDiningCommonMenuItem");
      expect(
        screen.queryByTestId("UCSBDiningCommonMenuItemForm-diningCommonsCode"),
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
      axiosMock.onGet("/api/ucsbdiningcommonmenuitems", { params: { id: 17 } }).reply(200, {
        id: 17,
        diningCommonsCode: "dining commons code 1",
        name: "name 1",
        station: "station 1",
      });
      axiosMock.onPut("/api/ucsbdiningcommonmenuitems").reply(200, {
        id: "17",
        diningCommonsCode: "dining commons code 1",
        name: "name 1",
        station: "station 1",
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
            <UCSBDiningCommonMenuItemsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText(/Welcome/);
      await screen.findByTestId("UCSBDiningCommonMenuItemForm-diningCommonsCode");
      expect(
        screen.getByTestId("UCSBDiningCommonMenuItemForm-diningCommonsCode"),
      ).toBeInTheDocument();
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonMenuItemsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBDiningCommonMenuItemForm-diningCommonsCode");

      const idField = screen.getByTestId("UCSBDiningCommonMenuItemForm-id");
      const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonMenuItemForm-diningCommonsCode");
      const nameField = screen.getByTestId("UCSBDiningCommonMenuItemForm-name");
      const stationField = screen.getByTestId("UCSBDiningCommonMenuItemForm-station");
      const submitButton = screen.getByTestId("UCSBDiningCommonMenuItemForm-submit");

      expect(idField).toHaveValue("17");
      expect(diningCommonsCodeField).toHaveValue("dining commons code 1");
      expect(nameField).toHaveValue("name 1");
      expect(stationField).toHaveValue("station 1");
      expect(submitButton).toBeInTheDocument();
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonMenuItemsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBDiningCommonMenuItemForm-diningCommonsCode");

      const idField = screen.getByTestId("UCSBDiningCommonMenuItemForm-id");
      const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonMenuItemForm-diningCommonsCode");
      const nameField = screen.getByTestId("UCSBDiningCommonMenuItemForm-name");
      const stationField = screen.getByTestId("UCSBDiningCommonMenuItemForm-station");
      const submitButton = screen.getByTestId("UCSBDiningCommonMenuItemForm-submit");

      expect(idField).toHaveValue("17");
      expect(diningCommonsCodeField).toHaveValue("dining commons code 1");
      expect(nameField).toHaveValue("name 1");
      expect(stationField).toHaveValue("station 1");

      expect(submitButton).toBeInTheDocument();

      fireEvent.change(diningCommonsCodeField, { target: { value: "dining commons code 1" } });
      fireEvent.change(nameField, { target: { value: "name 1" } });
      fireEvent.change(stationField, { target: { value: "station 1" } });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "UCSBDiningCommonMenuItem Updated - id: 17 diningCommonsCode: dining commons code 1 name: name 1 station: station 1",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/ucsbdiningcommonmenuitems" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          diningCommonsCode: "dining commons code 1",
          name: "name 1",
          station: "station 1",
        }),
      ); // posted object
    });
  });
});
