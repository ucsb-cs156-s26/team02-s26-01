import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonMenuItemForm from "main/components/UCSBDiningCommonMenuItems/UCSBDiningCommonMenuItemForm";
import { Navigate } from "react-router";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonMenuItemsCreatePage({
  storybook = false,
}) {
  const objectToAxiosParams = (ucsbDiningCommonMenuItem) => ({
    url: "/api/ucsbdiningcommonsmenuitems/post",
    method: "POST",
    params: {
      diningCommonsCode: ucsbDiningCommonMenuItem.diningCommonsCode,
      name: ucsbDiningCommonMenuItem.name,
      station: ucsbDiningCommonMenuItem.station,
    },
  });

  const onSuccess = (ucsbDiningCommonMenuItem) => {
    toast(
      `New ucsbDiningCommonMenuItem Created - id: ${ucsbDiningCommonMenuItem.id} diningCommonsCode: ${ucsbDiningCommonMenuItem.diningCommonsCode} name: ${ucsbDiningCommonMenuItem.name} station: ${ucsbDiningCommonMenuItem.station}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/ucsbdiningcommonsmenuitems/all"],
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
        <h1>Create New UCSBDiningCommonMenuItem</h1>

        <UCSBDiningCommonMenuItemForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
