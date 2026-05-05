import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router";
import UCSBDiningCommonMenuItemForm from "main/components/UCSBDiningCommonMenuItems/UCSBDiningCommonMenuItemForm";
import { Navigate } from "react-router";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonMenuItemsEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: ucsbDiningCommonMenuItem,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/ucsbdiningcommonmenuitems?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/ucsbdiningcommonmenuitems`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (ucsbDiningCommonMenuItem) => ({
    url: "/api/ucsbdiningcommonmenuitems",
    method: "PUT",
    params: {
      id: ucsbDiningCommonMenuItem.id,
    },
    data: {
      diningCommonsCode: ucsbDiningCommonMenuItem.diningCommonsCode,
      name: ucsbDiningCommonMenuItem.name,
      station: ucsbDiningCommonMenuItem.station,
    },
  });

  const onSuccess = (ucsbDiningCommonMenuItem) => {
    toast(`UCSBDiningCommonMenuItem Updated - id: ${ucsbDiningCommonMenuItem.id} diningCommonsCode: ${ucsbDiningCommonMenuItem.diningCommonsCode} name: ${ucsbDiningCommonMenuItem.name} station: ${ucsbDiningCommonMenuItem.station}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/ucsbdiningcommonmenuitems?id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsbdiningcommonmenuitems" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit UCSBDiningCommonMenuItem</h1>
        {ucsbDiningCommonMenuItem && (
          <UCSBDiningCommonMenuItemForm
            initialContents={ucsbDiningCommonMenuItem}
            submitAction={onSubmit}
            buttonLabel="Update"
          />
        )}
      </div>
    </BasicLayout>
  );
}
