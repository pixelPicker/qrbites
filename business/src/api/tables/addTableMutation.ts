import { ErrorToast } from "@/components/custom/Toast";
import { TableState } from "@/store/tableStore";
import { useMutation } from "@tanstack/react-query";
import { UseNavigateResult } from "@tanstack/react-router";

export const addTableMutation = (
  navigate: UseNavigateResult<string>,
  appendTable: TableState["appendTable"]
) => {
  return useMutation({
    mutationKey: ["add-table"],
    mutationFn: async function ({
      data,
    }: {
      data: { name: string | null; capacity: number | string };
    }) {
      const res = await fetch("http://localhost:3000/tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Failed to add table. Please try again");
      }
      return await res.json();
    },
    onError(error) {
      ErrorToast(error);
    },
    onSuccess(data) {
      appendTable([data.table]);
      navigate({ to: "/admin/tables" });
    },
  });
};
