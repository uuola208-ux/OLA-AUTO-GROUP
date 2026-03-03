import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.cars.list.path, async (req, res) => {
    try {
        const cars = await storage.getCars();
        res.json(cars);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.cars.get.path, async (req, res) => {
    try {
        const car = await storage.getCar(Number(req.params.id));
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }
        res.json(car);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.cars.create.path, async (req, res) => {
    try {
      // Coerce price if it comes in as string
      const bodySchema = api.cars.create.input.extend({
        price: z.coerce.number(),
      });
      const input = bodySchema.parse(req.body);
      const car = await storage.createCar(input);
      res.status(201).json(car);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.cars.update.path, async (req, res) => {
    try {
      const bodySchema = api.cars.update.input.extend({
        price: z.coerce.number().optional(),
      });
      const input = bodySchema.parse(req.body);
      const car = await storage.updateCar(Number(req.params.id), input);
      res.status(200).json(car);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(404).json({ message: "Car not found" });
    }
  });

  app.delete(api.cars.delete.path, async (req, res) => {
    try {
      await storage.deleteCar(Number(req.params.id));
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Seed data function
  async function seedDatabase() {
    try {
        const existingCars = await storage.getCars();
        if (existingCars.length === 0) {
            await storage.createCar({
                title: "2024 Mercedes-Benz G-Class G63 AMG",
                price: 185000,
                images: ["https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800"],
                details: "Stunning G63 AMG finished in Obsidian Black. Full service history."
            });
            await storage.createCar({
                title: "2023 Porsche 911 GT3 RS",
                price: 245000,
                images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800"],
                details: "Track-focused GT3 RS with Weissach package."
            });
            await storage.createCar({
                title: "2022 Range Rover Autobiography",
                price: 125000,
                images: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0b6e?w=800"],
                details: "Ultimate luxury SUV. Fully loaded specification."
            });
            console.log("Database seeded successfully");
        }
    } catch (err) {
        console.error("Failed to seed database:", err);
    }
  }
  
  await seedDatabase();

  return httpServer;
}