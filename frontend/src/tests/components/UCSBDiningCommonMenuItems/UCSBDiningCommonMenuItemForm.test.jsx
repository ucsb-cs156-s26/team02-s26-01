import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonMenuItemForm from "main/components/UCSBDiningCommonMenuItems/UCSBDiningCommonMenuItemForm";
import { ucsbDiningCommonMenuItemsFixtures } from "fixtures/ucsbDiningCommonMenuItemsFixtures";
import { BrowserRouter as Router } from "react-router";
import { expect } from "vitest";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("UCSBDiningCommonMenuItemForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <UCSBDiningCommonMenuItemForm />
      </Router>,
    );
    await screen.findByText(/Dining Commons Code/);
    await screen.findByText(/Create/);
    expect(screen.getByText(/Dining Commons Code/)).toBeInTheDocument();
  });

  test("renders correctly when passing in a UCSBDiningCommonMenuItem", async () => {
    render(
      <Router>
        <UCSBDiningCommonMenuItemForm
          initialContents={ucsbDiningCommonMenuItemsFixtures.oneMenuItem}
        />
      </Router>,
    );
    await screen.findByTestId(/UCSBDiningCommonMenuItemForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/UCSBDiningCommonMenuItemForm-id/)).toHaveValue(
      "1",
    );
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <UCSBDiningCommonMenuItemForm />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningCommonMenuItemForm-submit");
    const submitButton = screen.getByTestId(
      "UCSBDiningCommonMenuItemForm-submit",
    );

    fireEvent.click(submitButton);

    await screen.findByText(/Dining Commons Code is required./);
    expect(screen.getByText(/Name is required./)).toBeInTheDocument();
    expect(screen.getByText(/Station is required./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <UCSBDiningCommonMenuItemForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningCommonMenuItemForm-diningCommonsCode");

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
      target: { value: "Dining Commons Code 1" },
    });
    fireEvent.change(nameField, { target: { value: "Name 1" } });
    fireEvent.change(stationField, { target: { value: "Staion 1" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/Dining Commons Code is required./),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Name is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/Station is required./)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBDiningCommonMenuItemForm />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningCommonMenuItemForm-cancel");
    const cancelButton = screen.getByTestId(
      "UCSBDiningCommonMenuItemForm-cancel",
    );

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
