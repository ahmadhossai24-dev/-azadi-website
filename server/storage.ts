import { users, donations, events, messages, leaders, services, members, eventRegistrations, gallery, paymentMethods, aboutPage, homePage, contactPage, socialMedia, volunteers } from '@shared/schema';
import { eq, sql } from 'drizzle-orm';
import { db } from './db';
import type { InsertLeader, InsertService, InsertMember, InsertEventRegistration, InsertGallery, InsertPaymentMethod, InsertAboutPage, InsertHomePage, InsertContactPage, InsertSocialMedia, InsertVolunteer } from '@shared/schema';

export class Storage {
  async getProduct(productId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.products WHERE id = ${productId}`
    );
    return result.rows[0] || null;
  }

  async listProducts(active = true, limit = 20, offset = 0) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.products WHERE active = ${active} LIMIT ${limit} OFFSET ${offset}`
    );
    return result.rows;
  }

  async listProductsWithPrices(active = true, limit = 20, offset = 0) {
    const result = await db.execute(
      sql`
        WITH paginated_products AS (
          SELECT id, name, description, metadata, active
          FROM stripe.products
          WHERE active = ${active}
          ORDER BY id
          LIMIT ${limit} OFFSET ${offset}
        )
        SELECT 
          p.id as product_id,
          p.name as product_name,
          p.description as product_description,
          p.active as product_active,
          p.metadata as product_metadata,
          pr.id as price_id,
          pr.unit_amount,
          pr.currency,
          pr.recurring,
          pr.active as price_active,
          pr.metadata as price_metadata
        FROM paginated_products p
        LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
        ORDER BY p.id, pr.unit_amount
      `
    );
    return result.rows;
  }

  async getPrice(priceId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.prices WHERE id = ${priceId}`
    );
    return result.rows[0] || null;
  }

  async listPrices(active = true, limit = 20, offset = 0) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.prices WHERE active = ${active} LIMIT ${limit} OFFSET ${offset}`
    );
    return result.rows;
  }

  async getPricesForProduct(productId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.prices WHERE product = ${productId} AND active = true`
    );
    return result.rows;
  }

  async getSubscription(subscriptionId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.subscriptions WHERE id = ${subscriptionId}`
    );
    return result.rows[0] || null;
  }

  async getUser(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeInfo: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  }) {
    const [user] = await db.update(users).set(stripeInfo).where(eq(users.id, userId)).returning();
    return user;
  }

  async getDonations() {
    return await db.select().from(donations);
  }

  async createDonation(data: any) {
    const [donation] = await db.insert(donations).values(data).returning();
    return donation;
  }

  async updateDonation(id: string, data: any) {
    const [donation] = await db.update(donations).set(data).where(eq(donations.id, id)).returning();
    return donation;
  }

  async getEvents() {
    return await db.select().from(events);
  }

  async createEvent(data: any) {
    const [event] = await db.insert(events).values(data).returning();
    return event;
  }

  async getMessages() {
    return await db.select().from(messages);
  }

  async createMessage(data: any) {
    const [message] = await db.insert(messages).values(data).returning();
    return message;
  }

  async updateMessage(id: string, data: any) {
    const [message] = await db.update(messages).set(data).where(eq(messages.id, id)).returning();
    return message;
  }

  async getLeaders() {
    return await db.select().from(leaders);
  }

  async createLeader(data: InsertLeader) {
    const [leader] = await db.insert(leaders).values(data).returning();
    return leader;
  }

  async updateLeader(id: string, data: any) {
    const [leader] = await db.update(leaders).set(data).where(eq(leaders.id, id)).returning();
    return leader;
  }

  async deleteLeader(id: string) {
    await db.delete(leaders).where(eq(leaders.id, id));
    return { success: true };
  }

  async getServices() {
    return await db.select().from(services);
  }

  async createService(data: InsertService) {
    const [service] = await db.insert(services).values(data).returning();
    return service;
  }

  async updateService(id: string, data: any) {
    const [service] = await db.update(services).set(data).where(eq(services.id, id)).returning();
    return service;
  }

  async deleteService(id: string) {
    await db.delete(services).where(eq(services.id, id));
    return { success: true };
  }

  async deleteEvent(id: string) {
    await db.delete(events).where(eq(events.id, id));
    return { success: true };
  }

  async updateEvent(id: string, data: any) {
    const [event] = await db.update(events).set(data).where(eq(events.id, id)).returning();
    return event;
  }

  // Members
  async getMember(username: string) {
    const result = await db.select().from(members).where(eq(members.username, username));
    return result[0];
  }

  async getMemberById(id: string) {
    const result = await db.select().from(members).where(eq(members.id, id));
    return result[0];
  }

  async createMember(data: InsertMember) {
    const [member] = await db.insert(members).values(data).returning();
    return member;
  }

  async getMembers() {
    return await db.select().from(members);
  }

  // Event Registrations
  async getEventRegistrations(eventId?: string) {
    if (eventId) {
      return await db.select().from(eventRegistrations).where(eq(eventRegistrations.eventId, eventId));
    }
    return await db.select().from(eventRegistrations);
  }

  async createEventRegistration(data: InsertEventRegistration) {
    const [registration] = await db.insert(eventRegistrations).values(data).returning();
    return registration;
  }

  async deleteEventRegistration(id: string) {
    await db.delete(eventRegistrations).where(eq(eventRegistrations.id, id));
    return { success: true };
  }

  // Gallery
  async getGallery() {
    return await db.select().from(gallery).orderBy(gallery.order);
  }

  async createGalleryItem(data: InsertGallery) {
    const [item] = await db.insert(gallery).values(data).returning();
    return item;
  }

  async updateGalleryItem(id: string, data: any) {
    const [item] = await db.update(gallery).set(data).where(eq(gallery.id, id)).returning();
    return item;
  }

  async deleteGalleryItem(id: string) {
    await db.delete(gallery).where(eq(gallery.id, id));
    return { success: true };
  }

  // Payment Methods
  async getPaymentMethods() {
    return await db.select().from(paymentMethods).where(eq(paymentMethods.active, true)).orderBy(paymentMethods.order);
  }

  async getAllPaymentMethods() {
    return await db.select().from(paymentMethods).orderBy(paymentMethods.order);
  }

  async createPaymentMethod(data: InsertPaymentMethod) {
    const [method] = await db.insert(paymentMethods).values(data).returning();
    return method;
  }

  async updatePaymentMethod(id: string, data: any) {
    const [method] = await db.update(paymentMethods).set(data).where(eq(paymentMethods.id, id)).returning();
    return method;
  }

  async deletePaymentMethod(id: string) {
    await db.delete(paymentMethods).where(eq(paymentMethods.id, id));
    return { success: true };
  }

  // About Page
  async getAboutPage() {
    const result = await db.select().from(aboutPage);
    return result[0] || null;
  }

  async createAboutPage(data: InsertAboutPage) {
    const [item] = await db.insert(aboutPage).values(data).returning();
    return item;
  }

  async updateAboutPage(id: string, data: any) {
    const [item] = await db.update(aboutPage).set(data).where(eq(aboutPage.id, id)).returning();
    return item;
  }

  // Home Page
  async getHomePage() {
    const result = await db.select().from(homePage);
    return result[0] || null;
  }

  async createHomePage(data: InsertHomePage) {
    const [item] = await db.insert(homePage).values(data).returning();
    return item;
  }

  async updateHomePage(id: string, data: any) {
    const [item] = await db.update(homePage).set(data).where(eq(homePage.id, id)).returning();
    return item;
  }

  // Contact Page
  async getContactPage() {
    const result = await db.select().from(contactPage);
    return result[0] || null;
  }

  async createContactPage(data: InsertContactPage) {
    const [item] = await db.insert(contactPage).values(data).returning();
    return item;
  }

  async updateContactPage(id: string, data: any) {
    const [item] = await db.update(contactPage).set(data).where(eq(contactPage.id, id)).returning();
    return item;
  }

  // Social Media
  async getSocialMedia() {
    const result = await db.select().from(socialMedia);
    return result[0] || null;
  }

  async createSocialMedia(data: InsertSocialMedia) {
    const [item] = await db.insert(socialMedia).values(data).returning();
    return item;
  }

  async updateSocialMedia(id: string, data: any) {
    const [item] = await db.update(socialMedia).set(data).where(eq(socialMedia.id, id)).returning();
    return item;
  }

  // Volunteers
  async createVolunteer(data: InsertVolunteer) {
    const [item] = await db.insert(volunteers).values(data).returning();
    return item;
  }

  async getVolunteers() {
    return await db.select().from(volunteers).orderBy(volunteers.createdAt);
  }

  // Admin Password
  async updateAdminPassword(newPassword: string) {
    const [item] = await db.update(users).set({ password: newPassword }).where(eq(users.username, 'azadi')).returning();
    return item;
  }

  async getAdminUser() {
    const result = await db.select().from(users).where(eq(users.username, 'azadi'));
    return result[0] || null;
  }
}

export const storage = new Storage();
