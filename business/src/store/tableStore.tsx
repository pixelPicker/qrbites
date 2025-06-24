import { create } from "zustand";

export type Table = {
  id: string;
  serialNo: number;
  name: string | null;
  qrcode: string;
  backupCode: string;
  isOccupied: boolean | null;
  capacity: number | null;
};

export type TableState = {
  tables: Table[];
  appendTable: (tables: Table[]) => void;
  setTable: (tables: Table[]) => void;
  clearTable: () => void;
  deleteTable: (id: string) => void;
  updateTable: (id: string, updates: Partial<Table>) => void;
};

export const useTableStore = create<TableState>()((set) => ({
  tables: [] as Table[],
  clearTable: () => set({ tables: [] }),
  appendTable: (tables) =>
    set((state) => ({
      tables: state.tables ? [...state.tables, ...tables] : tables,
    })),
  deleteTable: (id) =>
    set((state) => ({
      tables: state.tables.filter((value) => value.id !== id),
    })),
  setTable: (tables) => set({ tables: tables }),
  updateTable: (id, updates) =>
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === id ? { ...table, ...updates } : table
      ),
    })),
}));
