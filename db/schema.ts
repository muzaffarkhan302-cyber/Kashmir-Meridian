import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  int,
  decimal,
  json,
  bigint,
} from "drizzle-orm/mysql-core";

export const hotels = mysqlTable("hotels", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // 2-star, 3-star, 3-star-premium, 4-star-premium
  imageUrl: varchar("image_url", { length: 500 }),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const vehicles = mysqlTable("vehicles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  capacity: int("capacity"),
  pricePerDay: decimal("price_per_day", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const packageTemplates = mysqlTable("package_templates", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  durationDays: int("duration_days").notNull(),
  durationNights: int("duration_nights").notNull(),
  coverImage: varchar("cover_image", { length: 500 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const packageTemplateDays = mysqlTable("package_template_days", {
  id: serial("id").primaryKey(),
  templateId: bigint("template_id", { mode: "number", unsigned: true }).notNull(),
  dayNumber: int("day_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  description: text("description").notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  highlights: json("highlights"), // array of highlighted text segments
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const templateInclusions = mysqlTable("template_inclusions", {
  id: serial("id").primaryKey(),
  templateId: bigint("template_id", { mode: "number", unsigned: true }).notNull(),
  item: varchar("item", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const templateExclusions = mysqlTable("template_exclusions", {
  id: serial("id").primaryKey(),
  templateId: bigint("template_id", { mode: "number", unsigned: true }).notNull(),
  item: varchar("item", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const templateChecklist = mysqlTable("template_checklist", {
  id: serial("id").primaryKey(),
  templateId: bigint("template_id", { mode: "number", unsigned: true }).notNull(),
  item: varchar("item", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const templateRemarks = mysqlTable("template_remarks", {
  id: serial("id").primaryKey(),
  templateId: bigint("template_id", { mode: "number", unsigned: true }).notNull(),
  remark: text("remark").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Generated packages for customers - with editable pricing
export const packages = mysqlTable("packages", {
  id: serial("id").primaryKey(),
  templateId: bigint("template_id", { mode: "number", unsigned: true }).notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }),
  customerEmail: varchar("customer_email", { length: 255 }),
  travelDate: varchar("travel_date", { length: 50 }),
  numAdults: int("num_adults").default(2),
  numChildren: int("num_children").default(0),
  hotelCategory: varchar("hotel_category", { length: 50 }).notNull(),
  vehicleId: bigint("vehicle_id", { mode: "number", unsigned: true }),
  // Editable pricing fields
  hotelCost: decimal("hotel_cost", { precision: 12, scale: 2 }),
  vehicleCost: decimal("vehicle_cost", { precision: 12, scale: 2 }),
  sightseeingCost: decimal("sightseeing_cost", { precision: 12, scale: 2 }),
  miscCost: decimal("misc_cost", { precision: 12, scale: 2 }),
  totalCost: decimal("total_cost", { precision: 12, scale: 2 }),
  perPersonCost: decimal("per_person_cost", { precision: 12, scale: 2 }),
  status: varchar("status", { length: 50 }).default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const packageDays = mysqlTable("package_days", {
  id: serial("id").primaryKey(),
  packageId: bigint("package_id", { mode: "number", unsigned: true }).notNull(),
  dayNumber: int("day_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  description: text("description").notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  highlights: json("highlights"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
