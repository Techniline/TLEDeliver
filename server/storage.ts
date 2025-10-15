import { db } from "./db";
import { deliveries, drivers, blockedSlots, type Delivery, type Driver, type BlockedSlot, type InsertDelivery, type InsertDriver, type InsertBlockedSlot } from "@shared/schema";
import { eq, desc, and, or } from "drizzle-orm";

export interface IStorage {
  // Delivery operations
  createDelivery(delivery: InsertDelivery): Promise<Delivery>;
  getAllDeliveries(): Promise<Delivery[]>;
  getDeliveryById(id: string): Promise<Delivery | undefined>;
  updateDeliveryStatus(id: string, status: string, rejectionReason?: string): Promise<Delivery>;
  assignDriver(id: string, driverName: string): Promise<Delivery>;
  
  // Driver operations
  getAllDrivers(): Promise<Driver[]>;
  createDriver(driver: InsertDriver): Promise<Driver>;
  
  // Blocked slot operations
  getBlockedSlots(): Promise<BlockedSlot[]>;
  createBlockedSlot(slot: InsertBlockedSlot): Promise<BlockedSlot>;
}

export class PostgresStorage implements IStorage {
  async createDelivery(delivery: InsertDelivery): Promise<Delivery> {
    const [created] = await db.insert(deliveries).values(delivery).returning();
    return created;
  }

  async getAllDeliveries(): Promise<Delivery[]> {
    return await db.select().from(deliveries).orderBy(desc(deliveries.createdAt));
  }

  async getDeliveryById(id: string): Promise<Delivery | undefined> {
    const [delivery] = await db.select().from(deliveries).where(eq(deliveries.id, id));
    return delivery;
  }

  async updateDeliveryStatus(id: string, status: string, rejectionReason?: string): Promise<Delivery> {
    const [updated] = await db
      .update(deliveries)
      .set({ 
        status, 
        rejectionReason: rejectionReason || null,
        updatedAt: new Date()
      })
      .where(eq(deliveries.id, id))
      .returning();
    return updated;
  }

  async assignDriver(id: string, driverName: string): Promise<Delivery> {
    const [updated] = await db
      .update(deliveries)
      .set({ driverName, updatedAt: new Date() })
      .where(eq(deliveries.id, id))
      .returning();
    return updated;
  }

  async getAllDrivers(): Promise<Driver[]> {
    return await db.select().from(drivers).where(eq(drivers.isActive, true));
  }

  async createDriver(driver: InsertDriver): Promise<Driver> {
    const [created] = await db.insert(drivers).values(driver).returning();
    return created;
  }

  async getBlockedSlots(): Promise<BlockedSlot[]> {
    return await db.select().from(blockedSlots);
  }

  async createBlockedSlot(slot: InsertBlockedSlot): Promise<BlockedSlot> {
    const [created] = await db.insert(blockedSlots).values(slot).returning();
    return created;
  }
}

export const storage = new PostgresStorage();
