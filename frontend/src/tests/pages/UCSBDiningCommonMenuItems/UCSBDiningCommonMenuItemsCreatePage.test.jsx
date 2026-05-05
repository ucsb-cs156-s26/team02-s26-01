import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonMenuItemsCreatePage from "main/pages/UCSBDiningCommonMenuItems/UCSBDiningCommonMenuItemsCreatePage";
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

describe("UCSBDiningCommonMenuItemsCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
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
          <UCSBDiningCommonMenuItemsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("UCSBDiningCommonMenuItemForm-diningCommonsCode"),
      ).toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();
    const ucsbDiningCommonMenuItem = {
      id: 17,
      diningCommonsCode: "dining commons code 1",
      name: "name 1",
      station: "station 1",
    };

    axiosMock
      .onPost("/api/ucsbdiningcommonsmenuitems/post")
      .reply(202, ucsbDiningCommonMenuItem);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonMenuItemsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("UCSBDiningCommonMenuItemForm-diningCommonsCode"),
      ).toBeInTheDocument();
    });

    const diningCommonsCodeField = screen.getByTestId(
      "UCSBDiningCommonMenuItemForm-diningCommonsCode",
    );
    const nameField = screen.getByTestId("UCSBDiningCommonMenuItemForm-name");
    const stationField = screen.getByTestId(
      "UCSBDiningCommonMenuItemForm-station",
    );
    const submitButton = screen.getByTestId(
      "UCSBDiningCommonMenuItemForm-submit",
    );

    fireEvent.change(diningCommonsCodeField, {
      target: { value: "dining commons code 1" },
    });
    fireEvent.change(nameField, { target: { value: "name 1" } });
    fireEvent.change(stationField, { target: { value: "station 1" } });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      diningCommonsCode: "dining commons code 1",
      name: "name 1",
      station: "station 1",
    });

    expect(mockToast).toBeCalledWith(
      "New ucsbDiningCommonMenuItem Created - id: 17 diningCommonsCode: dining commons code 1 name: name 1 station: station 1",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/ucsbdiningcommonmenuitems" });
  });
});
