import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDeliverySchema, insertDriverSchema, insertBlockedSlotSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Delivery routes
  app.post("/api/deliveries", async (req, res) => {
    try {
      const validatedData = insertDeliverySchema.parse(req.body);
      const delivery = await storage.createDelivery(validatedData);
      res.json(delivery);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid delivery data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create delivery" });
      }
    }
  });

  app.get("/api/deliveries", async (req, res) => {
    try {
      const deliveries = await storage.getAllDeliveries();
      res.json(deliveries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch deliveries" });
    }
  });

  app.get("/api/deliveries/:id", async (req, res) => {
    try {
      const delivery = await storage.getDeliveryById(req.params.id);
      if (!delivery) {
        return res.status(404).json({ error: "Delivery not found" });
      }
      res.json(delivery);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch delivery" });
    }
  });

  app.patch("/api/deliveries/:id/status", async (req, res) => {
    try {
      const { status, rejectionReason } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const delivery = await storage.updateDeliveryStatus(req.params.id, status, rejectionReason);
      res.json(delivery);
    } catch (error) {
      res.status(500).json({ error: "Failed to update delivery status" });
    }
  });

  app.patch("/api/deliveries/:id/driver", async (req, res) => {
    try {
      const { driverName } = req.body;
      if (!driverName) {
        return res.status(400).json({ error: "Driver name is required" });
      }
      const delivery = await storage.assignDriver(req.params.id, driverName);
      res.json(delivery);
    } catch (error) {
      res.status(500).json({ error: "Failed to assign driver" });
    }
  });

  // Driver routes
  app.get("/api/drivers", async (req, res) => {
    try {
      const drivers = await storage.getAllDrivers();
      res.json(drivers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch drivers" });
    }
  });

  app.post("/api/drivers", async (req, res) => {
    try {
      const validatedData = insertDriverSchema.parse(req.body);
      const driver = await storage.createDriver(validatedData);
      res.json(driver);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid driver data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create driver" });
      }
    }
  });

  // Blocked slots routes
  app.get("/api/blocked-slots", async (req, res) => {
    try {
      const slots = await storage.getBlockedSlots();
      res.json(slots);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blocked slots" });
    }
  });

  app.post("/api/blocked-slots", async (req, res) => {
    try {
      const validatedData = insertBlockedSlotSchema.parse(req.body);
      const slot = await storage.createBlockedSlot(validatedData);
      res.json(slot);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid slot data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create blocked slot" });
      }
    }
  });

  // Dashboard summary stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const allDeliveries = await storage.getAllDeliveries();
      const blockedSlots = await storage.getBlockedSlots();
      
      const today = new Date().toISOString().split('T')[0];
      const todaysDeliveries = allDeliveries.filter(d => 
        d.createdAt.toISOString().split('T')[0] === today && 
        (d.status === 'Approved' || d.status === 'Delivered')
      ).length;
      
      const pendingApprovals = allDeliveries.filter(d => d.status === 'Pending').length;
      const rejections = allDeliveries.filter(d => d.status === 'Rejected').length;

      res.json({
        todaysDeliveries,
        pendingApprovals,
        blockedSlots: blockedSlots.length,
        rejections,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
