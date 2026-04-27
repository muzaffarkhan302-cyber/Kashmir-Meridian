import { relations } from "drizzle-orm";
import {
  vehicles,
  packageTemplates,
  packageTemplateDays,
  templateInclusions,
  templateExclusions,
  templateChecklist,
  templateRemarks,
  packages,
  packageDays,
} from "./schema";

export const packageTemplatesRelations = relations(packageTemplates, ({ many }) => ({
  days: many(packageTemplateDays),
  inclusions: many(templateInclusions),
  exclusions: many(templateExclusions),
  checklist: many(templateChecklist),
  remarks: many(templateRemarks),
  generatedPackages: many(packages),
}));

export const packageTemplateDaysRelations = relations(packageTemplateDays, ({ one }) => ({
  template: one(packageTemplates, {
    fields: [packageTemplateDays.templateId],
    references: [packageTemplates.id],
  }),
}));

export const templateInclusionsRelations = relations(templateInclusions, ({ one }) => ({
  template: one(packageTemplates, {
    fields: [templateInclusions.templateId],
    references: [packageTemplates.id],
  }),
}));

export const templateExclusionsRelations = relations(templateExclusions, ({ one }) => ({
  template: one(packageTemplates, {
    fields: [templateExclusions.templateId],
    references: [packageTemplates.id],
  }),
}));

export const templateChecklistRelations = relations(templateChecklist, ({ one }) => ({
  template: one(packageTemplates, {
    fields: [templateChecklist.templateId],
    references: [packageTemplates.id],
  }),
}));

export const templateRemarksRelations = relations(templateRemarks, ({ one }) => ({
  template: one(packageTemplates, {
    fields: [templateRemarks.templateId],
    references: [packageTemplates.id],
  }),
}));

export const packagesRelations = relations(packages, ({ one, many }) => ({
  template: one(packageTemplates, {
    fields: [packages.templateId],
    references: [packageTemplates.id],
  }),
  vehicle: one(vehicles, {
    fields: [packages.vehicleId],
    references: [vehicles.id],
  }),
  days: many(packageDays),
}));

export const packageDaysRelations = relations(packageDays, ({ one }) => ({
  package: one(packages, {
    fields: [packageDays.packageId],
    references: [packages.id],
  }),
}));
