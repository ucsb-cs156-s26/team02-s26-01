import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { BrowserRouter as Router } from "react-router";
import { expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockedNavigate = vi.fn();

vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("MenuItemReviewForm tests", () => {
  const queryClient = new QueryClient();

  test("renders correctly", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );
    await screen.findByText(/Item Id/);
    await screen.findByText(/Create/);
    expect(screen.getByText(/Item Id/)).toBeInTheDocument();
  });

  test("renders correctly when passing in a MenuItemReview", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm
            initialContents={menuItemReviewFixtures.oneMenuItemReview}
          />
        </Router>
      </QueryClientProvider>,
    );
    await screen.findByTestId(/MenuItemReviewForm-id/);
    expect(screen.getByText("Id")).toBeInTheDocument();
    expect(screen.getByTestId(/MenuItemReviewForm-id/)).toHaveValue("1");
  });

  test("Correct Error messages on bad input", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );
    await screen.findByTestId("MenuItemReviewForm-stars");
    const starsField = screen.getByTestId("MenuItemReviewForm-stars");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");
    fireEvent.change(starsField, { target: { value: 0 } });
    fireEvent.click(submitButton);
    await screen.findByText(/Stars must be at least 1./);
    expect(screen.getByText(/Stars must be at least 1./)).toBeInTheDocument();
    fireEvent.change(starsField, { target: { value: 6 } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/Stars must be at most 5./)).toBeInTheDocument();
    });
  });

  test("Correct Error messages on missing input", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );
    await screen.findByTestId("MenuItemReviewForm-submit");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");
    fireEvent.click(submitButton);
    await screen.findByText(/Item Id is required./);
    expect(screen.getByText(/Reviewer Email is required./)).toBeInTheDocument();
    expect(screen.getByText(/Stars is required./)).toBeInTheDocument();
    expect(screen.getByText(/Comments is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed is required./)).toBeInTheDocument();
  });

  test("No Error messages on good input", async () => {
    const mockSubmitAction = vi.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm submitAction={mockSubmitAction} />
        </Router>
      </QueryClientProvider>,
    );
    await screen.findByTestId("MenuItemReviewForm-itemId");
    const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
    const reviewerEmailField = screen.getByTestId(
      "MenuItemReviewForm-reviewerEmail",
    );
    const starsField = screen.getByTestId("MenuItemReviewForm-stars");
    const dateReviewedField = screen.getByTestId(
      "MenuItemReviewForm-dateReviewed",
    );
    const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");
    fireEvent.change(itemIdField, { target: { value: "67" } });
    fireEvent.change(reviewerEmailField, {
      target: { value: "oscarvaleriano@ucsb.edu" },
    });
    fireEvent.change(starsField, { target: { value: 5 } });
    fireEvent.change(dateReviewedField, {
      target: { value: "2026-05-05T02:18" },
    });
    fireEvent.change(commentsField, { target: { value: "no comments" } });
    fireEvent.click(submitButton);
    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
    expect(screen.queryByText(/Item Id is required./)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Reviewer Email is required./),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Stars is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/Comments is required./)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );
    await screen.findByTestId("MenuItemReviewForm-cancel");
    const cancelButton = screen.getByTestId("MenuItemReviewForm-cancel");
    fireEvent.click(cancelButton);
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
