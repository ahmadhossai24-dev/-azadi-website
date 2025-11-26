import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import ServiceCard from '@/components/ServiceCard';
import EventCard from '@/components/EventCard';
import { useLanguage } from '@/lib/language';
import { Book, Heart, Trophy, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import heroImage from '@assets/generated_images/charitable_hands_with_nature_background.png';
import educationImage from '@assets/generated_images/education_program_image.png';
import peaceImage from '@assets/generated_images/peace_initiative_image.png';
import sportsImage from '@assets/generated_images/sports_program_image.png';
import event1Image from '@assets/generated_images/recent_event_example_1.png';
import event2Image from '@assets/generated_images/recent_event_example_2.png';
import event3Image from '@assets/generated_images/recent_event_example_3.png';
import calligraphy2 from '@assets/calligraphy-2_1764081884318.png';

export default function Home() {
  const { t, language } = useLanguage();
  
  const { data: homeData = {} } = useQuery<any>({
    queryKey: ['/api/home-page'],
  });

  const { data: eventsResponse = { data: [] } } = useQuery<any>({
    queryKey: ['/api/events'],
  });

  const events = eventsResponse.data || [];

  return (
    <div>
      <section className="relative min-h-[650px] md:min-h-[750px] lg:min-h-[850px] flex items-center" data-testid="section-hero">
        <div className="absolute inset-0 z-0">
          <img
            src={homeData?.heroImage || heroImage}
            alt="Community Service"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/60 to-black/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="mb-4 inline-block">
              <span className="text-primary-foreground bg-primary/30 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold">{language === 'bn' ? 'স্থাপিত ২৭ শে জৈষ্ঠ ১৩৯৫' : (homeData?.foundedDateEn || 'Serving since 10 June 1988')}</span>
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight" data-testid="text-hero-title">
              {language === 'bn' ? (homeData?.heroTitle || 'সেবায় আমরা সর্বদা') : (homeData?.heroTitleEn || 'Always in Service')}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-100 mb-10 leading-relaxed max-w-2xl" data-testid="text-hero-description">
              {language === 'bn' ? (homeData?.heroDescription || 'শিক্ষা, শান্তি এবং ক্রীড়া কার্যক্রমের মাধ্যমে সমাজের সুবিধাবঞ্চিত মানুষদের জীবন পরিবর্তনে আমরা নিবেদিত।') : (homeData?.heroDescriptionEn || 'We are dedicated to changing the lives of underprivileged people through education, peace, and sports programs')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/donate">
                <Button size="lg" className="text-base md:text-lg px-8 py-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all" data-testid="button-hero-donate">
                  {t('এখনই দান করুন', 'Donate Now')}
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="text-base md:text-lg px-8 py-6 rounded-lg font-semibold bg-white/15 backdrop-blur-md hover:bg-white/25 border-white/30 text-white hover:text-white transition-all" data-testid="button-hero-learn">
                  {t('আমাদের সম্পর্কে জানুন', 'Learn More')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-background" data-testid="section-services">
        {homeData?.servicesImage && (
          <div className="mb-12 -mx-4 sm:-mx-6 lg:-mx-8">
            <img src={homeData.servicesImage} alt="Services" className="w-full h-64 object-cover" data-testid="img-services-section" />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-services-title">
              {language === 'bn' ? (homeData?.servicesTitle || 'আমাদের সেবা কার্যক্রম') : (homeData?.servicesTitleEn || 'Our Services')}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-services-description">
              {language === 'bn' ? (homeData?.servicesDescription || 'আমরা বিভিন্ন সেবামূলক কার্যক্রমের মাধ্যমে সমাজের উন্নয়নে নিরলসভাবে কাজ করছি') : (homeData?.servicesDescriptionEn || 'We work tirelessly for the development of society through various service programs')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <ServiceCard
              icon={Book}
              title={t('শিক্ষা কার্যক্রম', 'Education Programs')}
              description={t(
                'দরিদ্র শিক্ষার্থীদের জন্য শিক্ষা উপকরণ এবং বৃত্তি প্রদান',
                'Providing educational materials and scholarships for underprivileged students'
              )}
              image={educationImage}
            />
            <ServiceCard
              icon={Heart}
              title={t('শান্তি উদ্যোগ', 'Peace Initiatives')}
              description={t(
                'সমাজে শান্তি ও সম্প্রীতি স্থাপনে বিভিন্ন কর্মসূচি',
                'Various programs to establish peace and harmony in society'
              )}
              image={peaceImage}
            />
            <ServiceCard
              icon={Trophy}
              title={t('ক্রীড়া কার্যক্রম', 'Sports Programs')}
              description={t(
                'যুবকদের ক্রীড়া প্রতিযোগিতা এবং প্রশিক্ষণ কর্মসূচি',
                'Sports competitions and training programs for youth'
              )}
              image={sportsImage}
            />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm" data-testid="section-mission">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img src={calligraphy2} alt="Islamic Calligraphy" className="w-full rounded-xl shadow-xl" />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold mb-8" data-testid="text-mission-title">
                {t('আমাদের লক্ষ্য ও উদ্দেশ্য', 'Our Mission & Vision')}
              </h2>
              <p className="text-base md:text-lg text-foreground/80 mb-6 leading-relaxed" data-testid="text-mission-description-1">
                {t(
                  'আজাদী সমাজ কল্যাণ সংঘ একটি অলাভজনক সংগঠন যা ১০ জুন ১৯৮৮ সাল থেকে বাংলাদেশের মিরবকস্টুলা, সিলেট এলাকায় সেবামূলক কাজ করে আসছে।',
                  'Azadi Social Welfare Organization is a non-profit organization that has been serving the Mirbokstula, Sylhet area of Bangladesh since 10 June 1988.'
                )}
              </p>
              <p className="text-base md:text-lg text-foreground/80 mb-8 leading-relaxed" data-testid="text-mission-description-2">
                {t(
                  'আমাদের মূল লক্ষ্য হল শিক্ষা, স্বাস্থ্য, শান্তি এবং ক্রীড়া কার্যক্রমের মাধ্যমে সমাজের সুবিধাবঞ্চিত মানুষদের জীবনমান উন্নয়ন করা এবং তাদের ক্ষমতায়ন করা।',
                  'Our main goal is to improve and empower the lives of underprivileged people through education, health, peace, and sports programs.'
                )}
              </p>
              <Link href="/about">
                <Button variant="default" size="lg" className="font-semibold" data-testid="button-mission-learn">
                  {t('আরও জানুন', 'Read More')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-background" data-testid="section-events">
        {homeData?.eventsImage && (
          <div className="mb-12 -mx-4 sm:-mx-6 lg:-mx-8">
            <img src={homeData.eventsImage} alt="Events" className="w-full h-64 object-cover" data-testid="img-events-section" />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-3" data-testid="text-events-title">
                {t('সাম্প্রতিক কার্যক্রম', 'Recent Events')}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground" data-testid="text-events-description">
                {t('আমাদের সাম্প্রতিক ইভেন্ট এবং সেবামূলক কার্যক্রম', 'Our recent events and programs')}
              </p>
            </div>
            <Link href="/events">
              <Button variant="outline" size="lg" className="font-semibold" data-testid="button-events-all">
                {t('সব দেখুন', 'View All')}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.length > 0 ? (
              events.slice(0, 3).map((event: any) => (
                <EventCard key={event.id} {...event} />
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-12">
                {t('কোনো ইভেন্ট নেই', 'No events available')}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
