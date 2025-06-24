import { RiDeleteBin6Line } from "react-icons/ri";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import SpinningCircles from "react-loading-icons/dist/esm/components/spinning-circles";
import { Table, useTableStore } from "@/store/tableStore";
import { useRestaurantStoreContext } from "@/store/restaurantContext";
import { getTablesQuery } from "@/api/tables/getTableQuery";
import { deleteTableMutation } from "@/api/tables/deleteTableMutation";
import { FaPlus } from "react-icons/fa6";

export const Route = createFileRoute("/admin/tables")({
  component: RouteComponent,
});

function RouteComponent() {
  const { restaurant } = useRestaurantStoreContext((s) => s);
  const { setTable } = useTableStore((s) => s);
  const { data, error, isLoading, refetch } = getTablesQuery(
    restaurant?.slug ?? ""
  );

  useEffect(() => {
    if (data?.tables) setTable(data.tables);
  }, [data, setTable]);

  if (isLoading) {
    return (
      <div className="grid font-Aeonik-Regular place-items-center h-full">
        <SpinningCircles stroke="#4b5563" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid place-items-center gap-3 h-full">
        <img src="/images/error2.jpg" className="w-2/3 aspect-auto" />
        <p>An error occurred. Please try again.</p>
        <button
          onClick={() => refetch()}
          className="bg-dark-what hover:bg-dark-what-hover !px-3 !py-1"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="!py-3 font-Aeonik-Regular !px-6 flex flex-col h-full">
      <TableManager />
    </div>
  );
}

function TableManager() {
  const { tables } = useTableStore((s) => s);
  const [searchQuery, setSearchQuery] = useState("");

  console.log(tables);

  return (
    <>
      <section className="flex justify-between items-center w-full !py-3">
        <input
          type="text"
          placeholder="Search tables..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="font-Aeonik-Regular flex-1 border-[2px] border-hmm-black/50 bg-woo-white/50 !px-3 !py-2 rounded-lg max-w-[300px] outline-none focus-within:border-hmm-black/70"
        />
        <div>
          <Link
            to="/admin/create-table"
            className="flex items-center bg-the-green hover:bg-the-green-hover active:bg-the-green-active !px-4 !py-2 cursor-pointer rounded-full"
          >
            <FaPlus />
            &nbsp; Add New
          </Link>
        </div>
      </section>
      <section className="flex-1 @container overflow-auto h-full">
        {tables.length <= 0 ? (
          <div className="text-center text-gray-500 pt-10">No tables found</div>
        ) : (
          <div className="grid grid-cols-1 @min-lg:grid-cols-2 @min-3xl:grid-cols-3 gap-4">
            {tables.map((table) => (
              <TableCard key={table.id} table={table} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function TableCard({ table }: { table: Table }) {
  const { deleteTable } = useTableStore();
  const deleteMutation = deleteTableMutation(deleteTable);

  const handleDelete = () => {
    deleteMutation.mutate({ tableId: table.id });
  };

  return (
    <div className="border rounded-xl relative shadow-sm bg-white hover:shadow-md transition-all duration-200">
      <img
        src={table.qrcode}
        alt={table.name ?? "Table"}
        className="w-full h-40 object-contain rounded-t-lg"
      />
      <div className="!p-3 flex justify-between items-start w-full">
        <div>
          <h3 className="font-medium text-lg">
            {table.name} ({table.backupCode})
          </h3>
          <span className="text-gray-500 text-xs">
            Guests: {table.capacity ?? "N/A"}
          </span>
        </div>
        <div>
          <RiDeleteBin6Line className="text-non-veg-red active:text-non-veg-red-active hover:text-non-veg-red-hover transition-all duration-300 text-2xl hover:scale-105 active:scale-90 cursor-pointer" onClick={handleDelete}/>
        </div>
      </div>
    </div>
  );
}
