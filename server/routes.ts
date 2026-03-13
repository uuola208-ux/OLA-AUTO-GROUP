import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { requireAuth } from "./auth";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

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

  app.post(api.cars.create.path, requireAuth, async (req, res) => {
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

  app.put(api.cars.update.path, requireAuth, async (req, res) => {
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

  app.delete(api.cars.delete.path, requireAuth, async (req, res) => {
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
      // Seed default admin user
      const existingAdmin = await storage.getUserByUsername("admin");
      if (!existingAdmin) {
        const hashedPassword = await hashPassword("adminpass");
        await storage.createUser({
          username: "admin",
          password: hashedPassword
        });
        console.log("Database seeded with default admin user (admin / adminpass)");
      }

      const existingCars = await storage.getCars();
      if (existingCars.length <= 3) {
        const extraCars = [
          {
            title: "2023 Ferrari F8 Tributo",
            price: 285000,
            images: ["https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800"],
            details: "Rosso Corsa exterior with Carbon Fibre racing seats. 3.9L V8 Twin-Turbo."
          },
          {
            title: "2024 Lamborghini Huracán Sterrato",
            price: 275000,
            images: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800"],
            details: "All-terrain super sports car. Limited edition #1 of 1499."
          },
          {
            title: "2023 Bentley Continental GT Mulliner",
            price: 215000,
            images: ["https://images.unsplash.com/photo-1621135802920-133df287f89c?w=800"],
            details: "The pinnacle of luxury grand touring. W12 engine with exquisite Mulliner craftsmanship."
          },
          {
            title: "2024 Aston Martin DBS Volante",
            price: 310000,
            images: ["https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=800"],
            details: "Beautifully engineered convertible with a 5.2L V12 bi-turbo engine."
          },
          {
            title: "2023 Rolls-Royce Ghost",
            price: 340000,
            images: ["https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?w=800"],
            details: "Effortless power and serenity. Finished in Arctic White with Grace White interior."
          },
          {
            title: "2024 McLaren 750S Spider",
            price: 325000,
            images: ["https://images.unsplash.com/photo-1626290119309-470a577d63ce?w=800"],
            details: "Lighter, more powerful, and even more engaging. Performance focused supercar."
          }
        ];

        for (const car of extraCars) {
          // Avoid duplicates by checking title
          if (!existingCars.find(c => c.title === car.title)) {
            await storage.createCar(car);
          }
        }
        console.log("Database seeded with additional inventory");
      }
    } catch (err) {
      console.error("Failed to seed database:", err);
    }
  }

  await seedDatabase();

  return httpServer;
}