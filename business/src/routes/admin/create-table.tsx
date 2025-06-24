import { addTableMutation } from "@/api/tables/addTableMutation";
import { InputLabel } from "@/components/custom/InputLabel";
import SpacingDiv from "@/components/custom/SpacingDiv";
import { useTableStore } from "@/store/tableStore";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/create-table")({
  component: RouteComponent,
});

const inputClass =
  "w-full !px-4 !py-2 rounded-lg bg-woo-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-dark-what shadow-inner transition-all duration-200";

function RouteComponent() {
  const navigate = useNavigate();
  const { appendTable } = useTableStore((s) => s);
  const mutation = addTableMutation(navigate, appendTable);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const name = formData.get("name") as string | null;
    const capacity = formData.get("capacity") as string | number;
    mutation.mutate({ data: {name, capacity} });
  };

  return (
    <div className="grid place-items-center font-Aeonik-Regular overflow-y-scroll h-full">
      <div className="max-w-[450px] min-w-[350px] !py-16">
        <h3 className="font-medium text-center text-3xl">Add a New Table</h3>
        <SpacingDiv measure="h-8" />
        <form method="POST" onSubmit={handleFormSubmit}>
          <InputLabel for="name" hasAsterisk={false} text="Name" />
          <SpacingDiv measure="h-1" />
          <input
            className={inputClass}
            name="name"
            id="name"
            maxLength={30}
            type="text"
            placeholder="Enter table name (eg. Table1)"
          />

          <SpacingDiv measure="h-4" />

          <InputLabel for="capacity" hasAsterisk={true} text="Capacity" />
          <SpacingDiv measure="h-1" />
          <input
            className={inputClass}
            name="capacity"
            id="capacity"
            required
            min={1}
            type="number"
            placeholder="Table Capacity (eg. 6 or 9)"
          />

          <SpacingDiv measure="h-4" />
          <button
            type="submit"
            className="w-full !py-3 rounded-lg bg-dark-what hover:bg-dark-what-hover text-woo-white text-lg transition-all duration-300 active:bg-dark-what-active shadow-inner"
          >
            Create Table
          </button>
        </form>
      </div>
    </div>
  );
}
