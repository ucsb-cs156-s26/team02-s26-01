import React from "react";
import UCSBDiningCommonMenuItemsTable from "main/components/UCSBDiningCommonMenuItems/UCSBDiningCommonMenuItemsTable";
import { ucsbDiningCommonMenuItemsFixtures } from "fixtures/ucsbDiningCommonMenuItemsFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/UCSBDiningCommonMenuItems/UCSBDiningCommonMenuItemsTable",
  component: UCSBDiningCommonMenuItemsTable,
};

const Template = (args) => {
  return <UCSBDiningCommonMenuItemsTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  diningCommonMenuItems: [],
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  diningCommonMenuItems: ucsbDiningCommonMenuItemsFixtures.threeMenuItems,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  diningCommonMenuItems: ucsbDiningCommonMenuItemsFixtures.threeMenuItems,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/ucsbdiningcommonsmenuitems", () => {
      return HttpResponse.json(
        { message: "UCSBDiningCommonMenuItem deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};
