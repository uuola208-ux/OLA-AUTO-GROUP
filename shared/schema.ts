import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cars = pgTable("cars", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  price: integer("price").notNull(),
  images: text("images").array().notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCarSchema = createInsertSchema(cars).omit({ 
  id: true, 
  createdAt: true 
});

export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = typeof cars.$inferSelect;

export type CreateCarRequest = InsertCar;
export type UpdateCarRequest = Partial<InsertCar>;
export type CarResponse = Car;
export type CarsListResponse = Car[];