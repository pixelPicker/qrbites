import QrCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import { catchDrizzzzzleError, catchError } from "../../util/catchError.js";
import { db } from "../../config/db.js";
import {
  restaurant,
  restaurantStaff,
  restaurantTable,
  staffWithPermissions,
} from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { createClientTable } from "../../util/createClient.js";
import { z } from "zod";
import { hasDrizzzzzleError } from "../../util/checkError.js";
import { s3 } from "../../config/s3.js";
import {
  getImageUrl,
  uploadMulterImageToS3,
  uploadQrToS3,
} from "../../lib/s3/upload.js";
import { deleteS3Image } from "../../lib/s3/delete.js";

function generateRandomCode(length = 7): string {
  const chars = "abcdefghijklmnopqrstuvwxyz1234567890";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

const addTableSchema = z.object({
  name: z
    .string()
    .max(30, { message: "Table name must be less than 30 characters" }),
  isOccupied: z.preprocess(
    (val) => val === "true" || val === true,
    z.optional(z.boolean())
  ),
  capacity: z.preprocess(
    (val) => Number(val),
    z
      .number()
      .min(0, { message: "Capacity cannot be less than 1" })
      .max(100, { message: "Capacity cannot be more than 100" })
  ),
});

export const getAllTables = async (req: Request, res: Response) => {
  const decoded = res.locals.decoded;
  const slug = req.params.slug;

  const [fetchTablesError, fetchedTables] = await catchDrizzzzzleError(
    db
      .select()
      .from(restaurantTable)
      .innerJoin(restaurant, eq(restaurant.id, restaurantTable.restaurantId))
      .where(eq(restaurant.slug, slug))
  );

  if (fetchTablesError || !fetchedTables) {
    res
      .status(500)
      .send(
        fetchTablesError?.message ?? "Failed to fetch data. Please try again"
      );
    return;
  }
  if (fetchedTables.length === 0) {
    res.status(200).json({ tables: [] });
    return;
  }
  const tables = fetchedTables.map((table) =>
    createClientTable(table.restaurant_table)
  );

  res.status(200).json({ tables: tables });
  return;
};

export const getSingleTable = async (req: Request, res: Response) => {
  const decoded = res.locals.decoded;
  const tableId = req.params.tableId;

  if (!tableId) {
    res.status(400).send("Table ID not found in request");
  }

  const [fetchTableError, fetchedTable] = await catchDrizzzzzleError(
    db.select().from(restaurantTable).where(eq(restaurantTable.id, tableId))
  );

  if (fetchTableError || !fetchedTable) {
    res
      .status(500)
      .send(
        fetchTableError?.message ?? "Failed to fetch data. Please try again"
      );
    return;
  }
  if (fetchedTable.length === 0) {
    res.status(200).json({ tables: [] });
    return;
  }
  const table = createClientTable(fetchedTable[0]);
  res.status(200).json({ table });
  return;
};

export const addTable = async (req: Request, res: Response) => {
  const decoded = res.locals.decoded;

  const result = addTableSchema.safeParse(req.body);
  if (!result.success) {
    const formattedError = result.error.errors.join(". ");
    res.status(400).send(formattedError);
    return;
  }

  const [fetchRestaurantError, fetchedRestaurant] = await catchDrizzzzzleError(
    db
      .select()
      .from(staffWithPermissions)
      .innerJoin(
        restaurantStaff,
        eq(restaurantStaff.staffId, staffWithPermissions.id)
      )
      .innerJoin(restaurant, eq(restaurant.id, restaurantStaff.restaurantId))
      .where(eq(staffWithPermissions.id, decoded.id))
  );

  const requestAbondoned = hasDrizzzzzleError(
    fetchRestaurantError,
    fetchedRestaurant,
    res,
    null,
    null
  );

  if (!requestAbondoned) {
    return;
  }

  const fetchedStaffPermissions = requestAbondoned[0].staff_with_permissions
    .permissions as Permissions;

  if (!fetchedStaffPermissions.add_table) {
    res
      .status(403)
      .send("Action Denied. User doesn't have permission for this");
    return;
  }

  const tableId = uuidv4();

  const [qrCreationError, qrfile] = await catchError(
    QrCode.toBuffer(
      `http://localhost:3000/menu?slug=${requestAbondoned[0].restaurant.slug}&table=${tableId}`,
      {
        errorCorrectionLevel: "H",
        type: "png",
      }
    )
  );

  if (qrCreationError || !qrfile) {
    res.status(500).send("Failed to add Table. Error while generating QR code");
    return;
  }

  const qrFileName = `${tableId}-${requestAbondoned[0].restaurant.slug}.png`;
  const uploadQrError = await uploadQrToS3(
    qrfile,
    qrFileName,
    "qrbites-table-qr"
  );

  if (uploadQrError) {
    res.status(500).send("Failed to add Table. Error while generating QR code");
    return;
  }

  const [insertTableError, insertedTable] = await catchDrizzzzzleError(
    db
      .insert(restaurantTable)
      .values({
        id: tableId,
        backupCode: generateRandomCode(7),
        name: result.data.name,
        qrcode: getImageUrl(qrFileName, "qrbites-table-qr"),
        restaurantId: requestAbondoned[0].restaurant.id,
        capacity: result.data.capacity,
        isOccupied: result.data.isOccupied,
      })
      .returning()
  );

  const insertRequestAbondoned = hasDrizzzzzleError(
    insertTableError,
    insertedTable,
    res,
    null,
    null
  );

  if (!insertRequestAbondoned) {
    await deleteS3Image(qrFileName, "qrbites-table-qr");
    return;
  }

  const newTable = createClientTable(insertRequestAbondoned[0]);
  res.status(201).json({ table: newTable });
  return;
};

export const deleteTable = async (req: Request, res: Response) => {
  const decoded = res.locals.decoded;

  const tableId = req.params.id;

  const [fetchRestaurantError, fetchedRestaurant] = await catchDrizzzzzleError(
    db
      .select()
      .from(staffWithPermissions)
      .innerJoin(
        restaurantStaff,
        eq(restaurantStaff.staffId, staffWithPermissions.id)
      )
      .innerJoin(restaurant, eq(restaurant.id, restaurantStaff.restaurantId))
      .where(eq(staffWithPermissions.id, decoded.id))
  );

  const requestAbondoned = hasDrizzzzzleError(
    fetchRestaurantError,
    fetchedRestaurant,
    res,
    null,
    null
  );

  if (!requestAbondoned) {
    return;
  }

  const fetchedStaffPermissions = requestAbondoned[0].staff_with_permissions
    .permissions as Permissions;

  if (!fetchedStaffPermissions.delete_table) {
    res
      .status(403)
      .send("Action Denied. User doesn't have permission for this");
    return;
  }

  const [fetchTableError, fetchedTable] = await catchDrizzzzzleError(
    db.select().from(restaurantTable).where(eq(restaurantTable.id, tableId))
  );

  const fetchRequestAbonded = hasDrizzzzzleError(
    fetchTableError,
    fetchedTable,
    res,
    null,
    null
  );

  if (!fetchRequestAbonded) {
    return;
  }

  const deleteS3FileError = await deleteS3Image(
    fetchRequestAbonded[0].qrcode,
    "qrbites-table-qr"
  );

  if (deleteS3FileError) {
    res.status(500).send("Failed to delete table. Please try again ");
    return;
  }

  const [deleteTableError, deletedTable] = await catchDrizzzzzleError(
    db
      .delete(restaurantTable)
      .where(eq(restaurantTable.id, tableId))
      .returning()
  );

  if (deleteTableError || !deletedTable) {
    res.status(500).send("Failed to delete table. Please try again later");
    return;
  }

  res.status(200).json({ tableId });
  return;
};
