import express, { type Express } from 'express';
import { storage } from './storage';
import { stripeService } from './stripeService';
import { insertDonationSchema, insertEventSchema, insertMessageSchema, insertLeaderSchema, insertServiceSchema, insertMemberSchema, insertEventRegistrationSchema, insertGallerySchema, insertPaymentMethodSchema, insertAboutPageSchema, insertHomePageSchema, insertContactPageSchema, insertSocialMediaSchema, insertVolunteerSchema } from '@shared/schema';

export async function registerRoutes(app: Express) {
  // Get user subscription
  app.get('/api/subscription', async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user?.id);
      if (!user?.stripeSubscriptionId) {
        return res.json({ subscription: null });
      }

      const subscription = await storage.getSubscription(user.stripeSubscriptionId);
      res.json({ subscription });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create checkout session
  app.post('/api/checkout', async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user?.id);
      const { priceId } = req.body;

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripeService.createCustomer(user.email || '', user.id);
        await storage.updateUserStripeInfo(user.id, { stripeCustomerId: customer.id });
        customerId = customer.id;
      }

      const session = await stripeService.createCheckoutSession(
        customerId,
        priceId,
        `${req.protocol}://${req.get('host')}/checkout/success`,
        `${req.protocol}://${req.get('host')}/checkout/cancel`
      );

      res.json({ url: session.url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // List products
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.listProducts();
      res.json({ data: products });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // List prices
  app.get('/api/prices', async (req, res) => {
    try {
      const prices = await storage.listPrices();
      res.json({ data: prices });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get prices for a specific product
  app.get('/api/products/:productId/prices', async (req, res) => {
    try {
      const { productId } = req.params;
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const prices = await storage.getPricesForProduct(productId);
      res.json({ data: prices });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Donations
  app.get('/api/donations', async (req, res) => {
    try {
      const donations = await storage.getDonations();
      res.json({ data: donations });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/donations', async (req, res) => {
    try {
      const validation = insertDonationSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
      }

      const donation = await storage.createDonation(validation.data);
      res.json(donation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Events
  app.get('/api/events', async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json({ data: events });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/events', async (req, res) => {
    try {
      const validation = insertEventSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
      }

      const event = await storage.createEvent(validation.data);
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Messages
  app.get('/api/messages', async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json({ data: messages });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/messages', async (req, res) => {
    try {
      const validation = insertMessageSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
      }

      const message = await storage.createMessage(validation.data);
      res.json(message);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/messages/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const message = await storage.updateMessage(id, req.body);
      res.json(message);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update donation status
  app.patch('/api/donations/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const donation = await storage.updateDonation(id, { status });
      res.json(donation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get approved donations
  app.get('/api/donations/approved', async (req, res) => {
    try {
      const donations = await storage.getDonations();
      const approved = Array.isArray(donations) ? donations.filter(d => d.status === 'approved') : [];
      res.json(approved);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Leaders
  app.get('/api/leaders', async (req, res) => {
    try {
      const leaders = await storage.getLeaders();
      res.json({ data: leaders });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/leaders', async (req, res) => {
    try {
      const validation = insertLeaderSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
      }

      const leader = await storage.createLeader(validation.data);
      res.json(leader);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/leaders/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const leader = await storage.updateLeader(id, req.body);
      res.json(leader);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/leaders/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteLeader(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Events DELETE and UPDATE
  app.delete('/api/events/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteEvent(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/events/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const validation = insertEventSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
      }
      const event = await storage.updateEvent(id, validation.data);
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Services
  app.get('/api/services', async (req, res) => {
    try {
      const servicesData = await storage.getServices();
      res.json({ data: servicesData });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/services', async (req, res) => {
    try {
      const validation = insertServiceSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
      }

      const service = await storage.createService(validation.data);
      res.json(service);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/services/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const service = await storage.updateService(id, req.body);
      res.json(service);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/services/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteService(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Members Registration & Login
  app.post('/api/members/register', async (req, res) => {
    try {
      const validation = insertMemberSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
      }

      const existing = await storage.getMember(validation.data.username);
      if (existing) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const member = await storage.createMember(validation.data);
      res.json({ success: true, memberId: member.id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/members/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
      }

      const member = await storage.getMember(username);
      if (!member || member.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      res.json({ success: true, member: { id: member.id, username: member.username, email: member.email, fullName: member.fullName } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/members/:id', async (req, res) => {
    try {
      const member = await storage.getMemberById(req.params.id);
      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }
      res.json(member);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Event Registrations
  app.get('/api/event-registrations', async (req, res) => {
    try {
      const eventId = req.query.eventId as string | undefined;
      const registrations = await storage.getEventRegistrations(eventId);
      res.json({ data: registrations });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/event-registrations', async (req, res) => {
    try {
      const validation = insertEventRegistrationSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
      }

      const registration = await storage.createEventRegistration(validation.data);
      res.json(registration);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/event-registrations/:id', async (req, res) => {
    try {
      await storage.deleteEventRegistration(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Gallery
  app.get('/api/gallery', async (req, res) => {
    try {
      const items = await storage.getGallery();
      res.json({ data: items });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/gallery', async (req, res) => {
    try {
      const validation = insertGallerySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
      }

      const item = await storage.createGalleryItem(validation.data);
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/gallery/:id', async (req, res) => {
    try {
      const validation = insertGallerySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
      }
      const item = await storage.updateGalleryItem(req.params.id, validation.data);
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/gallery/:id', async (req, res) => {
    try {
      await storage.deleteGalleryItem(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Payment Methods
  app.get('/api/payment-methods', async (req, res) => {
    try {
      const methods = await storage.getPaymentMethods();
      res.json({ data: methods });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/payment-methods/admin/all', async (req, res) => {
    try {
      const methods = await storage.getAllPaymentMethods();
      res.json({ data: methods });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/payment-methods', async (req, res) => {
    try {
      const validation = insertPaymentMethodSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
      }

      const method = await storage.createPaymentMethod(validation.data);
      res.json(method);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/payment-methods/:id', async (req, res) => {
    try {
      const method = await storage.updatePaymentMethod(req.params.id, req.body);
      res.json(method);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/payment-methods/:id', async (req, res) => {
    try {
      await storage.deletePaymentMethod(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // About Page
  app.get('/api/about-page', async (req, res) => {
    try {
      const aboutData = await storage.getAboutPage();
      res.json({ data: aboutData });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/about-page', async (req, res) => {
    try {
      const validation = insertAboutPageSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
      }

      const existing = await storage.getAboutPage();
      if (existing) {
        const updated = await storage.updateAboutPage(existing.id, validation.data);
        return res.json(updated);
      }

      const created = await storage.createAboutPage(validation.data);
      res.json(created);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/about-page/:id', async (req, res) => {
    try {
      const updated = await storage.updateAboutPage(req.params.id, req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Home Page
  app.get('/api/home-page', async (req, res) => {
    try {
      const homeData = await storage.getHomePage();
      res.json({ data: homeData });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/home-page', async (req, res) => {
    try {
      const validation = insertHomePageSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
      }

      const existing = await storage.getHomePage();
      if (existing) {
        const updated = await storage.updateHomePage(existing.id, validation.data);
        return res.json(updated);
      }

      const created = await storage.createHomePage(validation.data);
      res.json(created);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/home-page/:id', async (req, res) => {
    try {
      const updated = await storage.updateHomePage(req.params.id, req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Contact Page
  app.get('/api/contact-page', async (req, res) => {
    try {
      const contactData = await storage.getContactPage();
      res.json({ data: contactData });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/contact-page', async (req, res) => {
    try {
      const validation = insertContactPageSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
      }

      const existing = await storage.getContactPage();
      if (existing) {
        const updated = await storage.updateContactPage(existing.id, validation.data);
        return res.json(updated);
      }

      const created = await storage.createContactPage(validation.data);
      res.json(created);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/contact-page/:id', async (req, res) => {
    try {
      const updated = await storage.updateContactPage(req.params.id, req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Social Media
  app.get('/api/social-media', async (req, res) => {
    try {
      const socialData = await storage.getSocialMedia();
      res.json({ data: socialData });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/social-media', async (req, res) => {
    try {
      const validation = insertSocialMediaSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
      }

      const existing = await storage.getSocialMedia();
      if (existing) {
        const updated = await storage.updateSocialMedia(existing.id, validation.data);
        return res.json(updated);
      }

      const created = await storage.createSocialMedia(validation.data);
      res.json(created);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/social-media/:id', async (req, res) => {
    try {
      const updated = await storage.updateSocialMedia(req.params.id, req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Volunteers
  app.post('/api/volunteers', async (req, res) => {
    try {
      const validation = insertVolunteerSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
      }

      const volunteer = await storage.createVolunteer(validation.data);
      res.json(volunteer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/volunteers', async (req, res) => {
    try {
      const volunteers = await storage.getVolunteers();
      res.json({ data: volunteers });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin Password Change
  app.post('/api/admin/change-password', async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current and new password are required' });
      }

      const adminUser = await storage.getAdminUser();
      if (!adminUser) {
        return res.status(400).json({ error: 'Admin user not found' });
      }

      if (adminUser.password !== currentPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      const updated = await storage.updateAdminPassword(newPassword);
      res.json({ success: true, message: 'Password changed successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
