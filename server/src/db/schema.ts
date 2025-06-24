import { pgTable, varchar, foreignKey, uuid, unique, text, timestamp, boolean, integer, time, check, bigint, smallint, real, primaryKey, pgView, jsonb, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const diningAt = pgEnum("dining_at", ['dinein', 'takeaway', 'delivery'])
export const dishCategory = pgEnum("dish_category", ['starter', 'main course', 'dessert', 'drink'])
export const loginProvider = pgEnum("login_provider", ['magic_link', 'google'])
export const orderStatus = pgEnum("order_status", ['pending', 'preparing', 'finished', 'served', 'cancelled'])
export const paymentMode = pgEnum("payment_mode", ['cash', 'card', 'mobile_banking'])
export const paymentStatus = pgEnum("payment_status", ['pending', 'success', 'failed'])
export const staffRole = pgEnum("staff_role", ['admin', 'manager', 'staff'])


export const permissions = pgTable("permissions", {
	name: varchar({ length: 30 }).primaryKey().notNull(),
	description: varchar({ length: 50 }),
});

export const address = pgTable("address", {
	restaurantId: uuid("restaurant_id"),
	street: varchar({ length: 20 }).notNull(),
	area: varchar({ length: 20 }).notNull(),
	city: varchar({ length: 30 }).notNull(),
	state: varchar({ length: 30 }).notNull(),
	country: varchar({ length: 30 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.restaurantId],
			foreignColumns: [restaurant.id],
			name: "address_restaurant_id_fkey"
		}).onDelete("cascade"),
]);

export const staff = pgTable("staff", {
	id: uuid().primaryKey().notNull(),
	username: varchar({ length: 30 }).notNull(),
	email: varchar({ length: 30 }).notNull(),
	password: text(),
	provider: loginProvider().notNull(),
	profilePic: varchar("profile_pic", { length: 100 }),
	role: staffRole().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	alias: varchar({ length: 30 }),
	emailVerificationToken: text("email_verification_token"),
	isVerified: boolean("is_verified").default(false),
	providerId: varchar("provider_id", { length: 255 }),
}, (table) => [
	unique("staff_email_unique").on(table.email),
]);

export const restaurant = pgTable("restaurant", {
	id: uuid().primaryKey().notNull(),
	serialNo: integer("serial_no").generatedByDefaultAsIdentity({ name: "restaurant_serial_no_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 50 }).notNull(),
	email: varchar({ length: 50 }).notNull(),
	phoneNumber: varchar("phone_number", { length: 15 }),
	logoUrl: text("logo_url"),
	slug: varchar({ length: 50 }).notNull(),
	openingTime: time("opening_time"),
	closingTime: time("closing_time"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	unique("restaurant_serial_no_key").on(table.serialNo),
	unique("restaurant_email_key").on(table.email),
	unique("restaurant_slug_key").on(table.slug),
]);

export const restaurantTable = pgTable("restaurant_table", {
	id: uuid().primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	serialNo: bigint("serial_no", { mode: "number" }).generatedByDefaultAsIdentity({ name: "restaurant_table_serial_no_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	restaurantId: uuid("restaurant_id").notNull(),
	qrcode: text().notNull(),
	backupCode: varchar("backup_code", { length: 10 }).notNull(),
	isOccupied: boolean("is_occupied").default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	name: varchar({ length: 30 }).notNull(),
	capacity: smallint(),
}, (table) => [
	foreignKey({
			columns: [table.restaurantId],
			foreignColumns: [restaurant.id],
			name: "restaurant_table_restaurant_id_fkey"
		}).onDelete("cascade"),
	unique("restaurant_table_serial_no_key").on(table.serialNo),
	check("capacity_positive", sql`capacity > 0`),
]);

export const orders = pgTable("orders", {
	id: uuid().primaryKey().notNull(),
	restaurantId: uuid("restaurant_id"),
	tableId: uuid("table_id"),
	userId: uuid("user_id"),
	status: orderStatus().default('pending'),
	total: real().notNull(),
	note: varchar({ length: 255 }),
	tipPercentage: real("tip_percentage").default(0),
	dining: diningAt().notNull(),
	contact: varchar({ length: 13 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.restaurantId],
			foreignColumns: [restaurant.id],
			name: "orders_restaurant_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.tableId],
			foreignColumns: [restaurantTable.id],
			name: "orders_table_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "orders_user_id_fkey"
		}).onDelete("set null"),
	check("orders_tip_percentage_check", sql`(tip_percentage >= (0)::double precision) AND (tip_percentage <= (100)::double precision)`),
	check("orders_total_check", sql`total > (0)::double precision`),
]);

export const payment = pgTable("payment", {
	id: uuid().primaryKey().notNull(),
	orderId: uuid("order_id"),
	amount: real().notNull(),
	mode: paymentMode().notNull(),
	status: paymentStatus().default('pending'),
	paidAt: timestamp("paid_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "payment_order_id_fkey"
		}).onDelete("cascade"),
	check("payment_amount_check", sql`amount >= (0)::double precision`),
]);

export const feedback = pgTable("feedback", {
	id: uuid().primaryKey().notNull(),
	orderId: uuid("order_id"),
	comment: varchar({ length: 255 }).notNull(),
	rating: integer(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "feedback_order_id_fkey"
		}),
	check("feedback_rating_check", sql`(rating >= 0) AND (rating <= 5)`),
]);

export const users = pgTable("users", {
	id: uuid().primaryKey().notNull(),
	username: varchar({ length: 30 }).notNull(),
	email: varchar({ length: 30 }).notNull(),
	password: text(),
	provider: loginProvider().notNull(),
	profilePic: text("profile_pic"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	emailVerificationToken: text("email_verification_token"),
	isVerified: boolean("is_verified").default(false),
	providerId: varchar("provider_id", { length: 255 }),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const dish = pgTable("dish", {
	id: uuid().primaryKey().notNull(),
	restaurantId: uuid("restaurant_id").notNull(),
	name: varchar({ length: 30 }).notNull(),
	description: varchar({ length: 100 }).notNull(),
	price: real().notNull(),
	category: dishCategory().notNull(),
	tags: varchar({ length: 25 }).array(),
	imageUrl: text("image_url").notNull(),
	isAvailable: boolean("is_available").default(true),
	discountPercentage: real("discount_percentage").default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	preparationTime: smallint("preparation_time"),
	isVeg: boolean("is_veg").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.restaurantId],
			foreignColumns: [restaurant.id],
			name: "dish_restaurant_id_fkey"
		}),
	check("dish_discount_percentage_check", sql`(discount_percentage >= (0)::double precision) AND (discount_percentage <= (100)::double precision)`),
	check("dish_price_check", sql`price >= (1)::double precision`),
	check("dish_tags_check", sql`array_length(tags, 1) <= 5`),
	check("dish_preparation_time_check", sql`preparation_time >= 0`),
]);

export const restaurantStaff = pgTable("restaurant_staff", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "restaurant_staff_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	restaurantId: uuid("restaurant_id").notNull(),
	staffId: uuid("staff_id").notNull(),
	staffRole: staffRole("staff_role").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.restaurantId],
			foreignColumns: [restaurant.id],
			name: "restaurant_staff_restaurant_id_fkey"
		}),
	foreignKey({
			columns: [table.staffId],
			foreignColumns: [staff.id],
			name: "restaurant_staff_staff_id_fkey"
		}),
]);

export const staffPermissions = pgTable("staff_permissions", {
	staffId: uuid("staff_id").notNull(),
	permission: varchar({ length: 20 }).notNull(),
	isGranted: boolean("is_granted").default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.staffId],
			foreignColumns: [staff.id],
			name: "staff_permissions_staff_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.permission],
			foreignColumns: [permissions.name],
			name: "staff_permissions_permission_fkey"
		}),
	primaryKey({ columns: [table.staffId, table.permission], name: "staff_permissions_pkey"}),
]);

export const orderItems = pgTable("order_items", {
	orderId: uuid("order_id").notNull(),
	dishId: uuid("dish_id").notNull(),
	quanity: integer().notNull(),
	price: real().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "order_items_order_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.dishId],
			foreignColumns: [dish.id],
			name: "order_items_dish_id_fkey"
		}).onDelete("set null"),
	primaryKey({ columns: [table.orderId, table.dishId], name: "order_items_pkey"}),
	check("order_items_quanity_check", sql`quanity >= 0`),
	check("order_items_price_check", sql`price >= (0)::double precision`),
]);
export const staffWithPermissions = pgView("staff_with_permissions", {	id: uuid(),
	username: varchar({ length: 30 }),
	email: varchar({ length: 30 }),
	password: text(),
	provider: loginProvider(),
	profilePic: varchar("profile_pic", { length: 100 }),
	role: staffRole(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	alias: varchar({ length: 30 }),
	emailVerificationToken: text("email_verification_token"),
	isVerified: boolean("is_verified"),
	providerId: varchar("provider_id", { length: 255 }),
	permissions: jsonb(),
}).as(sql`SELECT s.id, s.username, s.email, s.password, s.provider, s.profile_pic, s.role, s.created_at, s.updated_at, s.alias, s.email_verification_token, s.is_verified, s.provider_id, jsonb_object_agg(sp.permission, sp.is_granted) AS permissions FROM staff s LEFT JOIN staff_permissions sp ON s.id = sp.staff_id GROUP BY s.id, s.username, s.role, s.created_at, s.updated_at`);