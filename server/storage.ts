import { db } from "./db";
import {
  cars,
  users,
  type CreateCarRequest,
  type UpdateCarRequest,
  type CarResponse,
  type User,
  type InsertUser
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Cars
  getCars(): Promise<CarResponse[]>;
  getCar(id: number): Promise<CarResponse | undefined>;
  createCar(car: CreateCarRequest): Promise<CarResponse>;
  updateCar(id: number, updates: UpdateCarRequest): Promise<CarResponse>;
  deleteCar(id: number): Promise<void>;

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getCars(): Promise<CarResponse[]> {
    return await db.select().from(cars).orderBy(desc(cars.createdAt));
  }

  async getCar(id: number): Promise<CarResponse | undefined> {
    const [car] = await db.select().from(cars).where(eq(cars.id, id));
    return car;
  }

  async createCar(car: CreateCarRequest): Promise<CarResponse> {
    const [newCar] = await db.insert(cars).values(car as any).returning();
    return newCar;
  }

  async updateCar(id: number, updates: UpdateCarRequest): Promise<CarResponse> {
    const [updated] = await db.update(cars)
      .set(updates as any)
      .where(eq(cars.id, id))
      .returning();
    if (!updated) {
      throw new Error("Car not found");
    }
    return updated;
  }

  async deleteCar(id: number): Promise<void> {
    await db.delete(cars).where(eq(cars.id, id));
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
}

export const storage = new DatabaseStorage();