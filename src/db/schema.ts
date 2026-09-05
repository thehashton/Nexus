import { sql } from "drizzle-orm";
import { authenticatedRole, crudPolicy } from "drizzle-orm/neon";
import {
  boolean,
  date,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const neonAuth = pgSchema("neon_auth");

export const userInNeonAuth = neonAuth.table("user", {
  id: uuid().primaryKey().notNull(),
  name: text().notNull(),
  email: text().notNull(),
});

const ownedByUser = {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .default(sql`(auth.user_id())::uuid`)
    .references(() => userInNeonAuth.id),
};

export const todos = pgTable(
  "todos",
  {
    ...ownedByUser,
    title: text().notNull(),
    description: text(),
    completed: boolean().notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    dueDate: date("due_date"),
    tags: text().array().notNull().default(sql`'{}'`),
  },
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: sql`auth.user_id() = ${table.userId}::text`,
      modify: sql`auth.user_id() = ${table.userId}::text`,
    }),
  ],
);

export const goals = pgTable(
  "goals",
  {
    ...ownedByUser,
    title: text().notNull(),
    date: date().notNull(),
    completed: boolean().notNull().default(false),
    notes: text(),
  },
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: sql`auth.user_id() = ${table.userId}::text`,
      modify: sql`auth.user_id() = ${table.userId}::text`,
    }),
  ],
);

export const jobApplications = pgTable(
  "job_applications",
  {
    ...ownedByUser,
    company: text().notNull(),
    role: text().notNull(),
    stage: text().notNull(),
    notes: text(),
    appliedDate: date("applied_date").notNull(),
    lastUpdated: timestamp("last_updated", {
      withTimezone: true,
      mode: "string",
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: sql`auth.user_id() = ${table.userId}::text`,
      modify: sql`auth.user_id() = ${table.userId}::text`,
    }),
  ],
);
