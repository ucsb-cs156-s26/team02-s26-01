import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
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

describe("UCSBOrganizationForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );

    await screen.findByText(/Org Code/);
    await screen.findByText(/Create/);
    expect(screen.getByText(/Org Code/)).toBeInTheDocument();
    expect(screen.getByText(/^Org Translation Short/)).toBeInTheDocument();
    expect(screen.getByText(/^Org Translation$/)).toBeInTheDocument();
    expect(screen.getByText(/Inactive/)).toBeInTheDocument();
  });

  test("renders correctly when passing in a UCSBOrganization", async () => {
    render(
      <Router>
        <UCSBOrganizationForm
          initialContents={ucsbOrganizationFixtures.oneOrganization[0]}
        />
      </Router>,
    );

    await screen.findByTestId("UCSBOrganizationForm-orgCode");
    expect(screen.getByText(/Org Code/)).toBeInTheDocument();
    expect(screen.getByTestId("UCSBOrganizationForm-orgCode")).toHaveValue(
      "DSClub",
    );
    expect(screen.getByTestId("UCSBOrganizationForm-orgCode")).toBeDisabled();
  });

  test("Correct Error messages on missing input", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );

    await screen.findByTestId("UCSBOrganizationForm-submit");
    const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Org Code is required./);
    expect(
      screen.getByText(/Org Translation Short is required./),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Org Translation is required./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Inactive is required./)).toBeInTheDocument();
  });

  test("No Error messages on good input", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <UCSBOrganizationForm submitAction={mockSubmitAction} />
      </Router>,
    );

    await screen.findByTestId("UCSBOrganizationForm-orgCode");

    const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
    const orgTranslationShortField = screen.getByTestId(
      "UCSBOrganizationForm-orgTranslationShort",
    );
    const orgTranslationField = screen.getByTestId(
      "UCSBOrganizationForm-orgTranslation",
    );
    const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
    const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

    fireEvent.change(orgCodeField, {
      target: { value: "DSClub" },
    });
    fireEvent.change(orgTranslationShortField, {
      target: { value: "DSC" },
    });
    fireEvent.change(orgTranslationField, {
      target: { value: "Data Science Club" },
    });
    fireEvent.change(inactiveField, {
      target: { value: "false" },
    });

    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/Org Code is required./)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Org Translation Short is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Org Translation is required./),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Inactive is required./)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );

    await screen.findByTestId("UCSBOrganizationForm-cancel");
    const cancelButton = screen.getByTestId("UCSBOrganizationForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
