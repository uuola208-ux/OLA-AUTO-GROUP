import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cars = sqliteTable("cars", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  price: integer("price").notNull(),
  images: text("images", { mode: 'json' }).$type<string[]>().notNull(),
  details: text("details"),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;