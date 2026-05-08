import { Routes, Route } from "react-router";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import ArticlesIndexPage from "main/pages/Articles/ArticlesIndexPage";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";

import UCSBDiningCommonMenuItemsIndexPage from "main/pages/UCSBDiningCommonMenuItems/UCSBDiningCommonMenuItemsIndexPage";
import UCSBDiningCommonMenuItemsCreatePage from "main/pages/UCSBDiningCommonMenuItems/UCSBDiningCommonMenuItemsCreatePage";
import UCSBDiningCommonMenuItemsEditPage from "main/pages/UCSBDiningCommonMenuItems/UCSBDiningCommonMenuItemsEditPage";

import UCSBOrganizationIndexPage from "main/pages/UCSBOrganization/UCSBOrganizationIndexPage";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";
import HelpRequestIndexPage from "main/pages/HelpRequests/HelpRequestIndexPage";
import HelpRequestCreatePage from "main/pages/HelpRequests/HelpRequestCreatePage";
import HelpRequestEditPage from "main/pages/HelpRequests/HelpRequestEditPage";

import RecommendationRequestIndexPage from "main/pages/RecommendationRequest/RecommendationRequestIndexPage";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

import PlaceholderIndexPage from "main/pages/Placeholder/PlaceholderIndexPage";
import PlaceholderCreatePage from "main/pages/Placeholder/PlaceholderCreatePage";
import PlaceholderEditPage from "main/pages/Placeholder/PlaceholderEditPage";

import MenuItemReviewIndexPage from "main/pages/MenuItemReview/MenuItemReviewIndexPage";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

import { hasRole, useCurrentUser } from "main/utils/useCurrentUser";

import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const currentUser = useCurrentUser();

  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route exact path="/profile" element={<ProfilePage />} />
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <Route exact path="/admin/users" element={<AdminUsersPage />} />
      )}
      {hasRole(currentUser, "ROLE_USER") && (
        <>
          <Route exact path="/articles" element={<ArticlesIndexPage />} />
        </>
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route
            exact
            path="/articles/edit/:id"
            element={<ArticlesEditPage />}
          />
          <Route
            exact
            path="/articles/create"
            element={<ArticlesCreatePage />}
          />
        </>
      )}
      {hasRole(currentUser, "ROLE_USER") && (
        <>
          <Route exact path="/ucsbdates" element={<UCSBDatesIndexPage />} />
        </>
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route
            exact
            path="/ucsbdates/edit/:id"
            element={<UCSBDatesEditPage />}
          />
          <Route
            exact
            path="/ucsbdates/create"
            element={<UCSBDatesCreatePage />}
          />
        </>
      )}
      {hasRole(currentUser, "ROLE_USER") && (
        <>
          <Route exact path="/restaurants" element={<RestaurantIndexPage />} />
        </>
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route
            exact
            path="/restaurants/edit/:id"
            element={<RestaurantEditPage />}
          />
          <Route
            exact
            path="/restaurants/create"
            element={<RestaurantCreatePage />}
          />
        </>
      )}
      {hasRole(currentUser, "ROLE_USER") && (
        <>
          <Route
            exact
            path="/ucsbdiningcommonmenuitems"
            element={<UCSBDiningCommonMenuItemsIndexPage />}
          />
        </>
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route
            exact
            path="/ucsbdiningcommonmenuitems/edit/:id"
            element={<UCSBDiningCommonMenuItemsEditPage />}
          />
          <Route
            exact
            path="/ucsbdiningcommonmenuitems/create"
            element={<UCSBDiningCommonMenuItemsCreatePage />}
          />
        </>
      )}
      {hasRole(currentUser, "ROLE_USER") && (
        <>
          <Route
            exact
            path="/ucsborganizations"
            element={<UCSBOrganizationIndexPage />}
          />
          <Route
            exact
            path="/helprequests"
            element={<HelpRequestIndexPage />}
          />
        </>
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route
            exact
            path="/ucsborganizations/edit/:orgCode"
            element={<UCSBOrganizationEditPage />}
          />
          <Route
            exact
            path="/ucsborganizations/create"
            element={<UCSBOrganizationCreatePage />}
          />
          <Route
            exact
            path="/helprequests/edit/:id"
            element={<HelpRequestEditPage />}
          />
          <Route
            exact
            path="/helprequests/create"
            element={<HelpRequestCreatePage />}
          />
        </>
      )}
      {hasRole(currentUser, "ROLE_USER") && (
        <>
          <Route
            exact
            path="/recommendationrequest"
            element={<RecommendationRequestIndexPage />}
          />
        </>
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route
            exact
            path="/recommendationrequest/edit/:id"
            element={<RecommendationRequestEditPage />}
          />
          <Route
            exact
            path="/recommendationrequest/create"
            element={<RecommendationRequestCreatePage />}
          />
        </>
      )}
      {hasRole(currentUser, "ROLE_USER") && (
        <>
          <Route exact path="/placeholder" element={<PlaceholderIndexPage />} />
        </>
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route
            exact
            path="/placeholder/edit/:id"
            element={<PlaceholderEditPage />}
          />
          <Route
            exact
            path="/placeholder/create"
            element={<PlaceholderCreatePage />}
          />
        </>
      )}
      {hasRole(currentUser, "ROLE_USER") && (
        <>
          <Route
            exact
            path="/menuitemreview"
            element={<MenuItemReviewIndexPage />}
          />
        </>
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route
            exact
            path="/menuitemreview/edit/:id"
            element={<MenuItemReviewEditPage />}
          />
          <Route
            exact
            path="/menuitemreview/create"
            element={<MenuItemReviewCreatePage />}
          />
        </>
      )}
    </Routes>
  );
}

export default App;
