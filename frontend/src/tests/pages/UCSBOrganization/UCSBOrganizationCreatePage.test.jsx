import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { expect } from "vitest";

describe("UCSBOrganizationCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const getQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

  test("Renders expected content", async () => {
    setupUserOnly();

    render(
      <QueryClientProvider client={getQueryClient()}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("Create New UCSBOrganization");

    expect(screen.getByText("Create New UCSBOrganization")).toBeInTheDocument();
    expect(screen.getByText("Org Code")).toBeInTheDocument();
    expect(screen.getByText("Org Translation Short")).toBeInTheDocument();
    expect(screen.getByText(/^Org Translation$/)).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  test("on submit, makes request to backend", async () => {
    setupAdminUser();

    axiosMock.onPost("/api/UCSBOrganization/post").reply(200, {
      orgCode: "DSClub",
      orgTranslationShort: "DSC",
      orgTranslation: "Data Science Club",
      inactive: "false",
    });

    render(
      <QueryClientProvider client={getQueryClient()}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage storybook={true} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("Create New UCSBOrganization");

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

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      orgCode: "DSClub",
      orgTranslationShort: "DSC",
      orgTranslation: "Data Science Club",
      inactive: "false",
    });
  });
});
