import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  packageTemplates,
  packageTemplateDays,
  templateInclusions,
  templateExclusions,
  templateChecklist,
  templateRemarks,
} from "@db/schema";

export const templateRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(packageTemplates).orderBy(desc(packageTemplates.createdAt));
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }: { input: { id: number } }) => {
      const db = getDb();
      const template = await db
        .select()
        .from(packageTemplates)
        .where(eq(packageTemplates.id, input.id))
        .then((rows: Array<typeof packageTemplates.$inferSelect>) => rows[0]);

      if (!template) return null;

      const [days, inclusions, exclusions, checklist, remarks] = await Promise.all([
        db.select().from(packageTemplateDays).where(eq(packageTemplateDays.templateId, input.id)),
        db.select().from(templateInclusions).where(eq(templateInclusions.templateId, input.id)),
        db.select().from(templateExclusions).where(eq(templateExclusions.templateId, input.id)),
        db.select().from(templateChecklist).where(eq(templateChecklist.templateId, input.id)),
        db.select().from(templateRemarks).where(eq(templateRemarks.templateId, input.id)),
      ]);

      return { ...template, days, inclusions, exclusions, checklist, remarks };
    }),

  create: publicQuery
    .input(
      z.object({
        code: z.string().min(1),
        name: z.string().min(1),
        subtitle: z.string().optional(),
        durationDays: z.number().min(1),
        durationNights: z.number().min(0),
        coverImage: z.string().optional(),
        days: z.array(
          z.object({
            dayNumber: z.number(),
            title: z.string(),
            subtitle: z.string().optional(),
            description: z.string(),
            imageUrl: z.string().optional(),
            highlights: z.array(z.string()).optional(),
          })
        ),
        inclusions: z.array(z.string()).optional(),
        exclusions: z.array(z.string()).optional(),
        checklist: z.array(z.string()).optional(),
        remarks: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }: { input: { code: string; name: string; subtitle?: string; durationDays: number; durationNights: number; coverImage?: string; days: Array<{ dayNumber: number; title: string; subtitle?: string; description: string; imageUrl?: string; highlights?: string[] }>; inclusions?: string[]; exclusions?: string[]; checklist?: string[]; remarks?: string[] } }) => {
      const db = getDb();
      const result = await db.insert(packageTemplates).values({
        code: input.code,
        name: input.name,
        subtitle: input.subtitle || null,
        durationDays: input.durationDays,
        durationNights: input.durationNights,
        coverImage: input.coverImage || null,
      });

      const templateId = Number(result[0].insertId);

      if (input.days.length > 0) {
        await db.insert(packageTemplateDays).values(
          input.days.map((d) => ({
            templateId,
            dayNumber: d.dayNumber,
            title: d.title,
            subtitle: d.subtitle || null,
            description: d.description,
            imageUrl: d.imageUrl || null,
            highlights: d.highlights ? JSON.stringify(d.highlights) : null,
          }))
        );
      }

      if (input.inclusions?.length) {
        await db.insert(templateInclusions).values(
          input.inclusions.map((item: string) => ({ templateId, item }))
        );
      }
      if (input.exclusions?.length) {
        await db.insert(templateExclusions).values(
          input.exclusions.map((item: string) => ({ templateId, item }))
        );
      }
      if (input.checklist?.length) {
        await db.insert(templateChecklist).values(
          input.checklist.map((item: string) => ({ templateId, item }))
        );
      }
      if (input.remarks?.length) {
        await db.insert(templateRemarks).values(
          input.remarks.map((remark: string) => ({ templateId, remark }))
        );
      }

      return { id: templateId };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }: { input: { id: number } }) => {
      const db = getDb();
      await db.delete(packageTemplateDays).where(eq(packageTemplateDays.templateId, input.id));
      await db.delete(templateInclusions).where(eq(templateInclusions.templateId, input.id));
      await db.delete(templateExclusions).where(eq(templateExclusions.templateId, input.id));
      await db.delete(templateChecklist).where(eq(templateChecklist.templateId, input.id));
      await db.delete(templateRemarks).where(eq(templateRemarks.templateId, input.id));
      await db.delete(packageTemplates).where(eq(packageTemplates.id, input.id));
      return { success: true };
    }),
});
