import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const donations = pgTable("donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  amount: integer("amount").notNull(),
  message: text("message"),
  transactionId: text("transaction_id"),
  purpose: text("purpose"),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
  transactionId: true,
  status: true,
}).extend({
  amount: z.number().min(100, "Minimum donation is ৳100"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
  purpose: z.string().optional(),
});

export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleEn: text("title_en").notNull(),
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  locationEn: text("location_en").notNull(),
  image: text("image").notNull(),
  additionalImages: text("additional_images").default('[]'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
}).extend({
  date: z.string().or(z.date()).transform(val => 
    typeof val === 'string' ? new Date(val) : val
  ),
  additionalImages: z.string().optional().transform(val => val || '[]'),
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  read: true,
}).extend({
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export const leaders = pgTable("leaders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  position: text("position").notNull(),
  positionEn: text("position_en").notNull(),
  quote: text("quote").notNull(),
  quoteEn: text("quote_en").notNull(),
  image: text("image").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLeaderSchema = createInsertSchema(leaders).omit({
  id: true,
  createdAt: true,
});

export type InsertLeader = z.infer<typeof insertLeaderSchema>;
export type Leader = typeof leaders.$inferSelect;

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleEn: text("title_en").notNull(),
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  image: text("image").notNull(),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
});

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export const members = pgTable("members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  division: text("division"),
  district: text("district"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
  createdAt: true,
}).extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().optional(),
  division: z.string().optional(),
  district: z.string().optional(),
});

export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;

export const eventRegistrations = pgTable("event_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull(),
  memberId: varchar("member_id"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("registered"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations).omit({
  id: true,
  createdAt: true,
  status: true,
}).extend({
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
});

export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;
export type EventRegistration = typeof eventRegistrations.$inferSelect;

export const gallery = pgTable("gallery", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleEn: text("title_en").notNull(),
  description: text("description"),
  descriptionEn: text("description_en"),
  image: text("image").notNull(),
  additionalImages: text("additional_images").default('[]'),
  type: varchar("type", { length: 20 }).notNull().default("photo"),
  videoUrl: text("video_url"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGallerySchema = createInsertSchema(gallery).omit({
  id: true,
  createdAt: true,
}).extend({
  additionalImages: z.string().optional().transform(val => val || '[]'),
});

export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type Gallery = typeof gallery.$inferSelect;

export const paymentMethods = pgTable("payment_methods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  phone: text("phone").notNull(),
  description: text("description"),
  descriptionEn: text("description_en"),
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({
  id: true,
  createdAt: true,
});

export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;

export const aboutPage = pgTable("about_page", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  historyP1: text("history_p1").notNull(),
  historyP1En: text("history_p1_en").notNull(),
  historyP2: text("history_p2").notNull(),
  historyP2En: text("history_p2_en").notNull(),
  historyP3: text("history_p3").notNull(),
  historyP3En: text("history_p3_en").notNull(),
  image: text("image"),
  studentsCount: text("students_count").notNull().default("১০০০+"),
  eventsCount: text("events_count").notNull().default("৫০+"),
  yearsCount: text("years_count").notNull().default("৩৬+"),
  officeHours: text("office_hours").notNull().default("২৪/৭"),
  officeHoursEn: text("office_hours_en").notNull().default("24/7"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAboutPageSchema = createInsertSchema(aboutPage).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAboutPage = z.infer<typeof insertAboutPageSchema>;
export type AboutPage = typeof aboutPage.$inferSelect;

export const homePage = pgTable("home_page", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  heroTitle: text("hero_title").notNull(),
  heroTitleEn: text("hero_title_en").notNull(),
  heroDescription: text("hero_description").notNull(),
  heroDescriptionEn: text("hero_description_en").notNull(),
  heroImage: text("hero_image"),
  foundedDate: text("founded_date").notNull().default("১০ জুন ১৯৮৮"),
  foundedDateEn: text("founded_date_en").notNull().default("10 June 1988"),
  servicesTitle: text("services_title").notNull(),
  servicesTitleEn: text("services_title_en").notNull(),
  servicesDescription: text("services_description").notNull(),
  servicesDescriptionEn: text("services_description_en").notNull(),
  servicesImage: text("services_image"),
  eventsTitle: text("events_title").notNull(),
  eventsTitleEn: text("events_title_en").notNull(),
  eventsImage: text("events_image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertHomePageSchema = createInsertSchema(homePage).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertHomePage = z.infer<typeof insertHomePageSchema>;
export type HomePage = typeof homePage.$inferSelect;

export const contactPage = pgTable("contact_page", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sundayThursdayBn: text("sunday_thursday_bn").notNull().default("রবিবার - বৃহস্পতিবার\n৯:০০ AM - ৫:০০ PM"),
  sundayThursdayEn: text("sunday_thursday_en").notNull().default("Sunday - Thursday\n9:00 AM - 5:00 PM"),
  fridayBn: text("friday_bn").notNull().default("শুক্রবার\nবন্ধ"),
  fridayEn: text("friday_en").notNull().default("Friday\nClosed"),
  saturdayBn: text("saturday_bn").notNull().default("শনিবার\n১০:০০ AM - ২:০০ PM"),
  saturdayEn: text("saturday_en").notNull().default("Saturday\n10:00 AM - 2:00 PM"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertContactPageSchema = createInsertSchema(contactPage).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertContactPage = z.infer<typeof insertContactPageSchema>;
export type ContactPage = typeof contactPage.$inferSelect;

export const socialMedia = pgTable("social_media", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  facebook: text("facebook"),
  instagram: text("instagram"),
  youtube: text("youtube"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSocialMediaSchema = createInsertSchema(socialMedia).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSocialMedia = z.infer<typeof insertSocialMediaSchema>;
export type SocialMedia = typeof socialMedia.$inferSelect;

export const volunteers = pgTable("volunteers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVolunteerSchema = createInsertSchema(volunteers).omit({
  id: true,
  createdAt: true,
});

export type InsertVolunteer = z.infer<typeof insertVolunteerSchema>;
export type Volunteer = typeof volunteers.$inferSelect;
