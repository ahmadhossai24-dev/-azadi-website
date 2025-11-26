import { useLanguage } from '@/lib/language';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Target, Users, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function About() {
  const { t, language } = useLanguage();

  const { data: aboutData = {} } = useQuery<any>({
    queryKey: ['/api/about-page'],
  });

  const values = [
    {
      icon: Heart,
      title: t('সেবা', 'Service'),
      description: t('মানুষের সেবায় আমরা নিবেদিত', 'Dedicated to serving humanity'),
    },
    {
      icon: Target,
      title: t('লক্ষ্য', 'Goal'),
      description: t('সমাজের উন্নয়ন আমাদের লক্ষ্য', 'Social development is our goal'),
    },
    {
      icon: Users,
      title: t('একতা', 'Unity'),
      description: t('একসাথে আমরা শক্তিশালী', 'Together we are stronger'),
    },
    {
      icon: Award,
      title: t('সততা', 'Integrity'),
      description: t('স্বচ্ছতা ও জবাবদিহিতা', 'Transparency and accountability'),
    },
  ];

  const historyP1 = language === 'bn' ? (aboutData?.historyP1 || 'আজাদী সমাজ কল্যাণ সংঘ ১০ জুন ১৯৮৮ সালে প্রতিষ্ঠিত হয়েছিল কয়েকজন সমাজসেবী তরুণের উদ্যোগে। আমাদের লক্ষ্য ছিল স্থানীয় সম্প্রদায়ের সুবিধাবঞ্চিত মানুষদের সাহায্য করা।') : (aboutData?.historyP1En || 'Azadi Social Welfare Organization was founded on 10 June 1988 by a group of social service-minded youth. Our goal was to help the underprivileged people of the local community.');
  const historyP2 = language === 'bn' ? (aboutData?.historyP2 || 'গত ৩৬ বছরে আমরা হাজারেরও বেশি মানুষের জীবনে ইতিবাচক পরিবর্তন এনেছি। শিক্ষা, স্বাস্থ্য, এবং সামাজিক উন্নয়নে আমাদের কার্যক্রম অব্যাহত রয়েছে।') : (aboutData?.historyP2En || 'Over the past 36 years, we have brought positive changes to the lives of more than a thousand people. Our programs in education, health, and social development continue.');
  const historyP3 = language === 'bn' ? (aboutData?.historyP3 || 'আমরা বিশ্বাস করি যে একসাথে কাজ করলে আমরা আরও ভালো একটি সমাজ গড়ে তুলতে পারি। আমাদের সাথে যুক্ত হন এবং পরিবর্তনের অংশীদার হন।') : (aboutData?.historyP3En || 'We believe that by working together we can build a better society. Join us and be part of the change.');

  return (
    <div className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="text-about-title">
            {t('আমাদের সম্পর্কে', 'About Us')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-about-subtitle">
            {t('সেবায় প্রতিশ্রুতিবদ্ধ একটি সামাজিক প্রতিষ্ঠান যা সমাজের উন্নয়নে নিবেদিত', 'An organization dedicated to social service and community development')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          <div>
            {aboutData?.image && (
              <img
                src={aboutData.image}
                alt="Community Service"
                className="w-full rounded-xl shadow-xl"
                data-testid="img-about-hero"
              />
            )}
            {!aboutData?.image && (
              <div className="w-full h-96 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-muted-foreground" data-testid="placeholder-about-hero">
                {t('কোনো ছবি যোগ করা হয়নি', 'No image added yet')}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8" data-testid="text-history-title">
              {t('আমাদের ইতিহাস', 'Our History')}
            </h2>
            <p className="text-base md:text-lg text-foreground/80 mb-6 leading-relaxed" data-testid="text-history-p1">
              {historyP1}
            </p>
            <p className="text-base md:text-lg text-foreground/80 mb-6 leading-relaxed" data-testid="text-history-p2">
              {historyP2}
            </p>
            <p className="text-base md:text-lg text-foreground/80 leading-relaxed" data-testid="text-history-p3">
              {historyP3}
            </p>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16" data-testid="text-values-title">
            {t('আমাদের মূল্যবোধ', 'Our Values')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover-elevate transition-all border-0 shadow-md" data-testid={`card-value-${index}`}>
                <CardContent className="pt-8">
                  <div className="inline-flex p-4 bg-primary/15 rounded-full mb-6">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold mb-3" data-testid={`text-value-title-${index}`}>{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed" data-testid={`text-value-description-${index}`}>{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-10 md:p-16 text-center border border-primary/10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-impact-title">
            {t('আমাদের প্রভাব', 'Our Impact')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mt-12">
            <div>
              <div className="text-4xl font-bold text-primary mb-2" data-testid="text-students-count">{aboutData?.studentsCount || '১০০০+'}</div>
              <p className="text-muted-foreground" data-testid="text-students-label">
                {t('শিক্ষার্থী সহায়তা', 'Students Supported')}
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2" data-testid="text-events-count">{aboutData?.eventsCount || '৫০+'}</div>
              <p className="text-muted-foreground" data-testid="text-events-label">
                {t('কার্যক্রম সম্পন্ন', 'Events Completed')}
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2" data-testid="text-years-count">{aboutData?.yearsCount || '৩৬+'}</div>
              <p className="text-muted-foreground" data-testid="text-years-label">
                {t('বছরের সেবা', 'Years of Service')}
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2" data-testid="text-office-hours">
                {language === 'bn' ? (aboutData?.officeHours || '২৪/৭') : (aboutData?.officeHoursEn || '24/7')}
              </div>
              <p className="text-muted-foreground" data-testid="text-office-hours-label">
                {t('কার্যালয়ের সময়', 'Office Hours')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
