import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/UCSBOrganizationUtils";
import { toast } from "react-toastify";

vi.mock("react-toastify", async () => {
  const originalModule = await vi.importActual("react-toastify");
  return {
    ...originalModule,
    toast: vi.fn(),
  };
});

describe("UCSBOrganizationUtils", () => {
  test("cellToAxiosParamsDelete returns correct axios params", () => {
    const cell = {
      row: {
        original: {
          orgCode: "DSClub",
        },
      },
    };

    expect(cellToAxiosParamsDelete(cell)).toEqual({
      url: "/api/UCSBOrganization",
      method: "DELETE",
      params: {
        code: "DSClub",
      },
    });
  });

  test("onDeleteSuccess logs and toasts message", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    onDeleteSuccess("UCSBOrganization deleted");

    expect(consoleSpy).toHaveBeenCalledWith("UCSBOrganization deleted");
    expect(toast).toHaveBeenCalledWith("UCSBOrganization deleted");

    consoleSpy.mockRestore();
  });
});
