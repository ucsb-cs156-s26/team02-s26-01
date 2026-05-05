import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbDiningCommonMenuItemsFixtures } from "fixtures/ucsbDiningCommonMenuItemsFixtures";
import { http, HttpResponse } from "msw";

import UCSBDiningCommonMenuItemsEditPage from "main/pages/UCSBDiningCommonMenuItems/UCSBDiningCommonMenuItemsEditPage";

export default {
  title: "pages/UCSBDiningCommonMenuItems/UCSBDiningCommonMenuItemsEditPage",
  component: UCSBDiningCommonMenuItemsEditPage,
};

const Template = () => <UCSBDiningCommonMenuItemsEditPage storybook={true} />;

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
    http.get("/api/ucsbdiningcommonmenuitems", () => {
      return HttpResponse.json(
        ucsbDiningCommonMenuItemsFixtures.threeMenuItems[0],
        {
          status: 200,
        },
      );
    }),
    http.put("/api/ucsbdiningcommonmenuitems", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
