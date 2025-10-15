import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const deliveries = pgTable("deliveries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  doNumber: text("do_number").notNull().unique(),
  branch: text("branch").notNull(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  hasPackages: boolean("has_packages").notNull().default(false),
  paymentDone: boolean("payment_done").notNull().default(true),
  paymentComment: text("payment_comment"),
  cargoTag: text("cargo_tag").notNull(),
  boxQuantity: integer("box_quantity").notNull(),
  timeSlot: text("time_slot").notNull(),
  status: text("status").notNull().default("Pending"),
  driverName: text("driver_name"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const drivers = pgTable("drivers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  phone: text("phone"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const blockedSlots = pgTable("blocked_slots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  timeSlot: text("time_slot").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDeliverySchema = createInsertSchema(deliveries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  driverName: true,
  rejectionReason: true,
});

export const insertDriverSchema = createInsertSchema(drivers).omit({
  id: true,
  createdAt: true,
});

export const insertBlockedSlotSchema = createInsertSchema(blockedSlots).omit({
  id: true,
  createdAt: true,
});

export type InsertDelivery = z.infer<typeof insertDeliverySchema>;
export type Delivery = typeof deliveries.$inferSelect;

export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Driver = typeof drivers.$inferSelect;

export type InsertBlockedSlot = z.infer<typeof insertBlockedSlotSchema>;
export type BlockedSlot = typeof blockedSlots.$inferSelect;
