import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonMenuItemsTable from "main/components/UCSBDiningCommonMenuItems/UCSBDiningCommonMenuItemsTable";
import { Button } from "react-bootstrap";
import { useCurrentUser, hasRole } from "main/utils/useCurrentUser";

export default function UCSBDiningCommonMenuItemsIndexPage() {
  const currentUser = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/ucsbdiningcommonmenuitems/create"
          style={{ float: "right" }}
        >
          Create UCSBDiningCommonMenuItem
        </Button>
      );
    }
  };

  const {
    data: menuItems,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/ucsbdiningcommonmenuitems/all"],
    { method: "GET", url: "/api/ucsbdiningcommonmenuitems/all" },
    [],
  );

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>UCSBDiningCommonMenuItems</h1>
        <UCSBDiningCommonMenuItemsTable
          diningCommonMenuItems={menuItems}
          currentUser={currentUser}
        />
      </div>
    </BasicLayout>
  );
}
