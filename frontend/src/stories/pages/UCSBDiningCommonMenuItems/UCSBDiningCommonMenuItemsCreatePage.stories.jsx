import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import UCSBDiningCommonMenuItemsCreatePage from "main/pages/UCSBDiningCommonMenuItems/UCSBDiningCommonMenuItemsCreatePage";

export default {
  title: "pages/UCSBDiningCommonMenuItems/UCSBDiningCommonMenuItemsCreatePage",
  component: UCSBDiningCommonMenuItemsCreatePage,
};

const Template = () => <UCSBDiningCommonMenuItemsCreatePage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.post("/api/ucsbdiningcommonmenuitems/post", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
