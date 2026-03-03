import { db } from "./db";
import {
  cars,
  type CreateCarRequest,
  type UpdateCarRequest,
  type CarResponse
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getCars(): Promise<CarResponse[]>;
  getCar(id: number): Promise<CarResponse | undefined>;
  createCar(car: CreateCarRequest): Promise<CarResponse>;
  updateCar(id: number, updates: UpdateCarRequest): Promise<CarResponse>;
  deleteCar(id: number): Promise<void>;
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
    const [newCar] = await db.insert(cars).values(car).returning();
    return newCar;
  }

  async updateCar(id: number, updates: UpdateCarRequest): Promise<CarResponse> {
    const [updated] = await db.update(cars)
      .set(updates)
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
}

export const storage = new DatabaseStorage();