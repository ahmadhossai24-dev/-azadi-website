import fs from 'fs';
import path from 'path';
import { db } from './db';
import { leaders, aboutPage, homePage, contactPage, users } from '@shared/schema';

export async function seedAboutPage() {
  try {
    const existing = await db.select().from(aboutPage);
    if (existing.length > 0) {
      return;
    }

    await db.insert(aboutPage).values({
      historyP1: 'আজাদী সমাজ কল্যাণ সংঘ ১০ জুন ১৯৮৮ সালে প্রতিষ্ঠিত হয়েছিল কয়েকজন সমাজসেবী তরুণের উদ্যোগে। আমাদের লক্ষ্য ছিল স্থানীয় সম্প্রদায়ের সুবিধাবঞ্চিত মানুষদের সাহায্য করা।',
      historyP1En: 'Azadi Social Welfare Organization was founded on 10 June 1988 by a group of social service-minded youth. Our goal was to help the underprivileged people of the local community.',
      historyP2: 'গত ৩৬ বছরে আমরা হাজারেরও বেশি মানুষের জীবনে ইতিবাচক পরিবর্তন এনেছি। শিক্ষা, স্বাস্থ্য, এবং সামাজিক উন্নয়নে আমাদের কার্যক্রম অব্যাহত রয়েছে।',
      historyP2En: 'Over the past 36 years, we have brought positive changes to the lives of more than a thousand people. Our programs in education, health, and social development continue.',
      historyP3: 'আমরা বিশ্বাস করি যে একসাথে কাজ করলে আমরা আরও ভালো একটি সমাজ গড়ে তুলতে পারি। আমাদের সাথে যুক্ত হন এবং পরিবর্তনের অংশীদার হন।',
      historyP3En: 'We believe that by working together we can build a better society. Join us and be part of the change.',
      studentsCount: '১০০০+',
      eventsCount: '৫০+',
      yearsCount: '৩৬+',
      officeHours: '২৪/৭',
      officeHoursEn: '24/7',
    });
  } catch (error) {
    console.warn('About page seed already exists or error:', error);
  }
}

export async function seedHomePage() {
  try {
    const existing = await db.select().from(homePage);
    if (existing.length > 0) {
      return;
    }

    await db.insert(homePage).values({
      heroTitle: 'সেবায় আমরা সর্বদা',
      heroTitleEn: 'Always in Service',
      heroDescription: 'শিক্ষা, শান্তি এবং ক্রীড়া কার্যক্রমের মাধ্যমে সমাজের সুবিধাবঞ্চিত মানুষদের জীবন পরিবর্তনে আমরা নিবেদিত।',
      heroDescriptionEn: 'We are dedicated to changing the lives of underprivileged people through education, peace, and sports programs',
      heroImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      foundedDate: '১০ জুন ১৯৮৮ থেকে সেবারত',
      foundedDateEn: 'Serving since 10 June 1988',
      servicesTitle: 'আমাদের সেবা কার্যক্রম',
      servicesTitleEn: 'Our Services',
      servicesDescription: 'আমরা বিভিন্ন সেবামূলক কার্যক্রমের মাধ্যমে সমাজের উন্নয়নে নিরলসভাবে কাজ করছি',
      servicesDescriptionEn: 'We work tirelessly for the development of society through various service programs',
      servicesImage: '',
      eventsTitle: 'সাম্প্রতিক কার্যক্রম',
      eventsTitleEn: 'Recent Events',
      eventsImage: '',
    });
  } catch (error) {
    console.warn('Home page seed already exists or error:', error);
  }
}

export async function seedLeaders() {
  try {
    // Check if leaders already exist
    const existingLeaders = await db.select().from(leaders);
    if (existingLeaders.length > 0) {
      console.log(`Leaders already seeded (${existingLeaders.length} found). Skipping seed.`);
      return;
    }

    console.log('Seeding default leaders...');

    // Read images and convert to base64
    const imageDir = path.join(import.meta.dirname, '..', 'attached_assets', 'generated_images');
    
    const getImageAsBase64 = (filename: string): string => {
      try {
        const filepath = path.join(imageDir, filename);
        const data = fs.readFileSync(filepath);
        return `data:image/png;base64,${data.toString('base64')}`;
      } catch (error) {
        console.warn(`Could not read image ${filename}:`, error);
        return '';
      }
    };

    const image1 = getImageAsBase64('leadership_team_member_portrait_1.png');
    const image2 = getImageAsBase64('leadership_team_member_portrait_2.png');
    const image3 = getImageAsBase64('leadership_team_member_portrait_3.png');

    const defaultLeaders = [
      {
        name: 'টুটুল আহমদ',
        nameEn: 'Tutul Ahmad',
        position: 'সভাপতি',
        positionEn: 'President',
        quote: 'সমাজসেবায় আমাদের প্রতিশ্রুতি আজীবন অটুট থাকবে',
        quoteEn: 'Our commitment to social service will remain steadfast',
        image: image1,
      },
      {
        name: 'জুনেল আহমদ',
        nameEn: 'Junel Ahmad',
        position: 'সাধারণ সম্পাদক',
        positionEn: 'General Secretary',
        quote: 'একসাথে আমরা অসম্ভবকে সম্ভব করতে পারি',
        quoteEn: 'Together we can make the impossible possible',
        image: image2,
      },
      {
        name: 'কাউসার আহমেদ পাপ্পু',
        nameEn: 'Kausar Ahmed Pappu',
        position: 'সহ-সাধারণ সম্পাদক',
        positionEn: 'Joint General Secretary',
        quote: 'প্রতিটি সেবা একটি মূল্যবান অবদান',
        quoteEn: 'Every service is a valuable contribution',
        image: image3,
      },
      {
        name: 'তারেক আহমদ',
        nameEn: 'Tarek Ahmad',
        position: 'সাংগঠনিক সম্পাদক',
        positionEn: 'Organizational Secretary',
        quote: 'সংগঠিত প্রচেষ্টাই সাফল্যের চাবিকাঠি',
        quoteEn: 'Organized effort is the key to success',
        image: image1,
      },
      {
        name: 'এস এস নুরুল হুদা চৌঃ',
        nameEn: 'S.S. Nurul Huda Chowdhury',
        position: 'সহ-সভাপতি',
        positionEn: 'Vice President',
        quote: 'নেতৃত্ব মানে দায়িত্ব এবং নিষ্ঠা',
        quoteEn: 'Leadership means responsibility and dedication',
        image: image2,
      },
      {
        name: 'নাজিব সালাম',
        nameEn: 'Nazib Salam',
        position: 'সমাজ কল্যাণ সম্পাদক',
        positionEn: 'Social Welfare Secretary',
        quote: 'সমাজের উন্নয়নই আমাদের লক্ষ্য',
        quoteEn: 'Development of society is our goal',
        image: image3,
      },
      {
        name: 'আব্দুল মালিক (বিপ্লব)',
        nameEn: 'Abdul Malik (Biplobi)',
        position: 'অর্থ সম্পাদক',
        positionEn: 'Finance Secretary',
        quote: 'স্বচ্ছতা এবং জবাবদিহিতা আমাদের নীতি',
        quoteEn: 'Transparency and accountability are our principles',
        image: image1,
      },
      {
        name: 'সামিন আহমদ লিমন',
        nameEn: 'Samin Ahmad Limon',
        position: 'সহ-সমাজ কল্যাণ সম্পাদক',
        positionEn: 'Joint Social Welfare Secretary',
        quote: 'প্রতিটি মানুষই আমাদের মনোযোগের যোগ্য',
        quoteEn: 'Every person deserves our attention',
        image: image2,
      },
      {
        name: 'আব্দুল হাদী (রুম্মান)',
        nameEn: 'Abdul Hadi (Rumman)',
        position: 'সহ-অর্থ সম্পাদক',
        positionEn: 'Joint Finance Secretary',
        quote: 'সঠিক ব্যবস্থাপনা সফলতার ভিত্তি',
        quoteEn: 'Proper management is the foundation of success',
        image: image3,
      },
    ];

    await db.insert(leaders).values(defaultLeaders);
    console.log(`✓ Seeded ${defaultLeaders.length} default leaders`);
  } catch (error) {
    console.error('Error seeding leaders:', error);
  }
}

export async function seedContactPage() {
  try {
    const existing = await db.select().from(contactPage);
    if (existing.length > 0) {
      return;
    }

    await db.insert(contactPage).values({
      sundayThursdayBn: 'রবিবার - বৃহস্পতিবার\n৯:০০ AM - ৫:০০ PM',
      sundayThursdayEn: 'Sunday - Thursday\n9:00 AM - 5:00 PM',
      fridayBn: 'শুক্রবার\nবন্ধ',
      fridayEn: 'Friday\nClosed',
      saturdayBn: 'শনিবার\n১০:০০ AM - ২:০০ PM',
      saturdayEn: 'Saturday\n10:00 AM - 2:00 PM',
    });
  } catch (error) {
    console.warn('Contact page seed already exists or error:', error);
  }
}

export async function seedAdminUser() {
  try {
    const existing = await db.select().from(users);
    if (existing.length > 0) {
      console.log(`Admin user already exists (${existing.length} found). Skipping seed.`);
      return;
    }

    await db.insert(users).values({
      username: 'azadi',
      password: 'Azadi passwor 123456',
    });
    console.log('✓ Admin user seeded successfully');
  } catch (error) {
    console.warn('Admin user seed already exists or error:', error);
  }
}

export async function seedAll() {
  await seedAboutPage();
  await seedHomePage();
  await seedContactPage();
  await seedLeaders();
  await seedAdminUser();
}
