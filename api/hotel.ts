import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { hotels, vehicles } from "@db/schema";

export const hotelRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(hotels).orderBy(desc(hotels.createdAt));
  }),

  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        location: z.string().min(1),
        category: z.string().min(1),
        imageUrl: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }: { input: { name: string; location: string; category: string; imageUrl?: string; description?: string } }) => {
      const db = getDb();
      const result = await db.insert(hotels).values({
        name: input.name,
        location: input.location,
        category: input.category,
        imageUrl: input.imageUrl || null,
        description: input.description || null,
      });
      return { id: Number(result[0].insertId) };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }: { input: { id: number } }) => {
      const db = getDb();
      await db.delete(hotels).where(eq(hotels.id, input.id));
      return { success: true };
    }),
});

export const vehicleRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
  }),

  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        type: z.string().min(1),
        capacity: z.number().optional(),
        pricePerDay: z.string().optional(),
      })
    )
    .mutation(async ({ input }: { input: { name: string; type: string; capacity?: number; pricePerDay?: string } }) => {
      const db = getDb();
      const result = await db.insert(vehicles).values({
        name: input.name,
        type: input.type,
        capacity: input.capacity || null,
        pricePerDay: input.pricePerDay || null,
      });
      return { id: Number(result[0].insertId) };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }: { input: { id: number } }) => {
      const db = getDb();
      await db.delete(vehicles).where(eq(vehicles.id, input.id));
      return { success: true };
    }),
});
