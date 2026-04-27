import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  packages,
  packageDays,
  packageTemplates,
  packageTemplateDays,
  templateInclusions,
  templateExclusions,
  templateChecklist,
  templateRemarks,
  hotels,
  vehicles,
} from "@db/schema";

export const packageRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(packages).orderBy(desc(packages.createdAt));
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }: { input: { id: number } }) => {
      const db = getDb();
      const pkg = await db
        .select()
        .from(packages)
        .where(eq(packages.id, input.id))
        .then((rows: Array<typeof packages.$inferSelect>) => rows[0]);

      if (!pkg) return null;

      const [
        days,
        template,
        hotelList,
        vehicleList,
      ] = await Promise.all([
        db.select().from(packageDays).where(eq(packageDays.packageId, input.id)).orderBy(packageDays.dayNumber),
        db
          .select()
          .from(packageTemplates)
          .where(eq(packageTemplates.id, pkg.templateId))
          .then((rows: Array<typeof packageTemplates.$inferSelect>) => rows[0]),
        db.select().from(hotels),
        db.select().from(vehicles),
      ]);

      let templateDetails = null;
      if (template) {
        const [inclusions, exclusions, checklist, remarks, templateDays] = await Promise.all([
          db.select().from(templateInclusions).where(eq(templateInclusions.templateId, template.id)),
          db.select().from(templateExclusions).where(eq(templateExclusions.templateId, template.id)),
          db.select().from(templateChecklist).where(eq(templateChecklist.templateId, template.id)),
          db.select().from(templateRemarks).where(eq(templateRemarks.templateId, template.id)),
          db.select().from(packageTemplateDays).where(eq(packageTemplateDays.templateId, template.id)).orderBy(packageTemplateDays.dayNumber),
        ]);
        templateDetails = {
          ...template,
          inclusions,
          exclusions,
          checklist,
          remarks,
          days: templateDays,
        };
      }

      return {
        ...pkg,
        days,
        template: templateDetails,
        hotels: hotelList,
        vehicles: vehicleList,
      };
    }),

  create: publicQuery
    .input(
      z.object({
        templateId: z.number(),
        customerName: z.string().min(1),
        customerPhone: z.string().optional(),
        customerEmail: z.string().optional(),
        travelDate: z.string().optional(),
        numAdults: z.number().default(2),
        numChildren: z.number().default(0),
        hotelCategory: z.string().min(1),
        vehicleId: z.number().optional(),
      })
    )
    .mutation(async ({ input }: { input: { templateId: number; customerName: string; customerPhone?: string; customerEmail?: string; travelDate?: string; numAdults: number; numChildren: number; hotelCategory: string; vehicleId?: number } }) => {
      const db = getDb();

      // Get template days to copy
      const templateDays = await db
        .select()
        .from(packageTemplateDays)
        .where(eq(packageTemplateDays.templateId, input.templateId))
        .orderBy(packageTemplateDays.dayNumber);

      const result = await db.insert(packages).values({
        templateId: input.templateId,
        customerName: input.customerName,
        customerPhone: input.customerPhone || null,
        customerEmail: input.customerEmail || null,
        travelDate: input.travelDate || null,
        numAdults: input.numAdults,
        numChildren: input.numChildren,
        hotelCategory: input.hotelCategory,
        vehicleId: input.vehicleId || null,
        status: "draft",
      });

      const packageId = Number(result[0].insertId);

      if (templateDays.length > 0) {
        await db.insert(packageDays).values(
          templateDays.map((d: typeof packageTemplateDays.$inferSelect) => ({
            packageId,
            dayNumber: d.dayNumber,
            title: d.title,
            subtitle: d.subtitle,
            description: d.description,
            imageUrl: d.imageUrl,
            highlights: d.highlights,
          }))
        );
      }

      return { id: packageId };
    }),

  updatePricing: publicQuery
    .input(
      z.object({
        id: z.number(),
        hotelCost: z.string().optional(),
        vehicleCost: z.string().optional(),
        sightseeingCost: z.string().optional(),
        miscCost: z.string().optional(),
        totalCost: z.string().optional(),
        perPersonCost: z.string().optional(),
      })
    )
    .mutation(async ({ input }: { input: { id: number; hotelCost?: string; vehicleCost?: string; sightseeingCost?: string; miscCost?: string; totalCost?: string; perPersonCost?: string } }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db
        .update(packages)
        .set({
          ...data,
          status: "ready",
        })
        .where(eq(packages.id, id));
      return { success: true };
    }),

  updateDays: publicQuery
    .input(
      z.object({
        packageId: z.number(),
        days: z.array(
          z.object({
            id: z.number().optional(),
            dayNumber: z.number(),
            title: z.string(),
            subtitle: z.string().optional(),
            description: z.string(),
            imageUrl: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }: { input: { packageId: number; days: Array<{ id?: number; dayNumber: number; title: string; subtitle?: string; description: string; imageUrl?: string }> } }) => {
      const db = getDb();
      // Delete existing days and re-insert
      await db.delete(packageDays).where(eq(packageDays.packageId, input.packageId));
      if (input.days.length > 0) {
        await db.insert(packageDays).values(
          input.days.map((d) => ({
            packageId: input.packageId,
            dayNumber: d.dayNumber,
            title: d.title,
            subtitle: d.subtitle || null,
            description: d.description,
            imageUrl: d.imageUrl || null,
          }))
        );
      }
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }: { input: { id: number } }) => {
      const db = getDb();
      await db.delete(packageDays).where(eq(packageDays.packageId, input.id));
      await db.delete(packages).where(eq(packages.id, input.id));
      return { success: true };
    }),
});
