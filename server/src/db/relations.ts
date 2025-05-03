import { relations } from "drizzle-orm/relations";
import { restaurant, address, restaurantTable, orders, users, payment, feedback, dish, restaurantStaff, staff, staffPermissions, permissions, orderItems } from "./schema.js";

export const addressRelations = relations(address, ({one}) => ({
	restaurant: one(restaurant, {
		fields: [address.restaurantId],
		references: [restaurant.id]
	}),
}));

export const restaurantRelations = relations(restaurant, ({many}) => ({
	addresses: many(address),
	restaurantTables: many(restaurantTable),
	orders: many(orders),
	dishes: many(dish),
	restaurantStaffs: many(restaurantStaff),
}));

export const restaurantTableRelations = relations(restaurantTable, ({one, many}) => ({
	restaurant: one(restaurant, {
		fields: [restaurantTable.restaurantId],
		references: [restaurant.id]
	}),
	orders: many(orders),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	restaurant: one(restaurant, {
		fields: [orders.restaurantId],
		references: [restaurant.id]
	}),
	restaurantTable: one(restaurantTable, {
		fields: [orders.tableId],
		references: [restaurantTable.id]
	}),
	user: one(users, {
		fields: [orders.userId],
		references: [users.id]
	}),
	payments: many(payment),
	feedbacks: many(feedback),
	orderItems: many(orderItems),
}));

export const usersRelations = relations(users, ({many}) => ({
	orders: many(orders),
}));

export const paymentRelations = relations(payment, ({one}) => ({
	order: one(orders, {
		fields: [payment.orderId],
		references: [orders.id]
	}),
}));

export const feedbackRelations = relations(feedback, ({one}) => ({
	order: one(orders, {
		fields: [feedback.orderId],
		references: [orders.id]
	}),
}));

export const dishRelations = relations(dish, ({one, many}) => ({
	restaurant: one(restaurant, {
		fields: [dish.restaurantId],
		references: [restaurant.id]
	}),
	orderItems: many(orderItems),
}));

export const restaurantStaffRelations = relations(restaurantStaff, ({one}) => ({
	restaurant: one(restaurant, {
		fields: [restaurantStaff.restaurantId],
		references: [restaurant.id]
	}),
	staff: one(staff, {
		fields: [restaurantStaff.staffId],
		references: [staff.id]
	}),
}));

export const staffRelations = relations(staff, ({many}) => ({
	restaurantStaffs: many(restaurantStaff),
	staffPermissions: many(staffPermissions),
}));

export const staffPermissionsRelations = relations(staffPermissions, ({one}) => ({
	staff: one(staff, {
		fields: [staffPermissions.staffId],
		references: [staff.id]
	}),
	permission: one(permissions, {
		fields: [staffPermissions.permission],
		references: [permissions.name]
	}),
}));

export const permissionsRelations = relations(permissions, ({many}) => ({
	staffPermissions: many(staffPermissions),
}));

export const orderItemsRelations = relations(orderItems, ({one}) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
	dish: one(dish, {
		fields: [orderItems.dishId],
		references: [dish.id]
	}),
}));