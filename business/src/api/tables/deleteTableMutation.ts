import { ErrorToast } from "@/components/custom/Toast";
import { Table, TableState } from "@/store/tableStore";
import { useMutation } from "@tanstack/react-query";

export const deleteTableMutation = (deleteTable: TableState["deleteTable"]) => {
  // return ╙
  return useMutation({
    mutationKey: ["delete-table"],
    mutationFn: async function ({ tableId }: { tableId: Table["id"] }) {
      const res = await fetch(`http://localhost:3000/tables/${tableId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to delele table. Please try again");
      }
      return await res.json();
    },
    onError: (e) => {
      ErrorToast(e);
    },
    onSuccess: (data) => {
      deleteTable(data.tableId);
    },
  });
};
