import { useLanguage } from '@/lib/language';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import leaderImage1 from '@assets/generated_images/leadership_team_member_portrait_1.png';
import leaderImage2 from '@assets/generated_images/leadership_team_member_portrait_2.png';
import leaderImage3 from '@assets/generated_images/leadership_team_member_portrait_3.png';
import { Users, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Leader } from '@shared/schema';

export default function Leadership() {
  const { language, t } = useLanguage();

  const { data: leadersResponse = [], isLoading } = useQuery<any>({
    queryKey: ['/api/leaders'],
  });

  const leadersFromDB = Array.isArray(leadersResponse) ? leadersResponse : (leadersResponse?.data ? Array.from(leadersResponse.data) : []);

  const defaultLeaders: any[] = [
    {
      name: 'টুটুল আহমদ',
      position: 'সভাপতি',
      positionEn: 'President',
      quote: 'সমাজসেবায় আমাদের প্রতিশ্রুতি আজীবন অটুট থাকবে',
      quoteEn: 'Our commitment to social service will remain steadfast',
      image: leaderImage1,
      role: 'president',
    },
    {
      name: 'জুনেল আহমদ',
      position: 'সাধারণ সম্পাদক',
      positionEn: 'General Secretary',
      quote: 'একসাথে আমরা অসম্ভবকে সম্ভব করতে পারি',
      quoteEn: 'Together we can make the impossible possible',
      image: leaderImage2,
      role: 'secretary',
    },
    {
      name: 'কাউসার আহমেদ পাপ্পু',
      position: 'সহ-সাধারণ সম্পাদক',
      positionEn: 'Joint General Secretary',
      quote: 'প্রতিটি সেবা একটি মূল্যবান অবদান',
      quoteEn: 'Every service is a valuable contribution',
      image: leaderImage3,
      role: 'secretary',
    },
    {
      name: 'তারেক আহমদ',
      position: 'সাংগঠনিক সম্পাদক',
      positionEn: 'Organizational Secretary',
      quote: 'সংগঠিত প্রচেষ্টাই সাফল্যের চাবিকাঠি',
      quoteEn: 'Organized effort is the key to success',
      image: leaderImage1,
      role: 'secretary',
    },
    {
      name: 'এস এস নুরুল হুদা চৌঃ',
      position: 'সহ-সভাপতি',
      positionEn: 'Vice President',
      quote: 'নেতৃত্ব মানে দায়িত্ব এবং নিষ্ঠা',
      quoteEn: 'Leadership means responsibility and dedication',
      image: leaderImage2,
      role: 'vice-president',
    },
    {
      name: 'নাজিব সালাম',
      position: 'সমাজ কল্যাণ সম্পাদক',
      positionEn: 'Social Welfare Secretary',
      quote: 'সমাজের উন্নয়নই আমাদের লক্ষ্য',
      quoteEn: 'Development of society is our goal',
      image: leaderImage3,
      role: 'secretary',
    },
    {
      name: 'আব্দুল মালিক (বিপ্লব)',
      position: 'অর্থ সম্পাদক',
      positionEn: 'Finance Secretary',
      quote: 'স্বচ্ছতা এবং জবাবদিহিতা আমাদের নীতি',
      quoteEn: 'Transparency and accountability are our principles',
      image: leaderImage1,
      role: 'treasurer',
    },
    {
      name: 'সামিন আহমদ লিমন',
      position: 'সহ-সমাজ কল্যাণ সম্পাদক',
      positionEn: 'Joint Social Welfare Secretary',
      quote: 'প্রতিটি মানুষই আমাদের মনোযোগের যোগ্য',
      quoteEn: 'Every person deserves our attention',
      image: leaderImage2,
      role: 'secretary',
    },
    {
      name: 'আব্দুল হাদী (রুম্মান)',
      position: 'সহ-অর্থ সম্পাদক',
      positionEn: 'Joint Finance Secretary',
      quote: 'সঠিক ব্যবস্থাপনা সফলতার ভিত্তি',
      quoteEn: 'Proper management is the foundation of success',
      image: leaderImage3,
      role: 'treasurer',
    },
  ];

  const leaders = leadersFromDB && leadersFromDB.length > 0 ? leadersFromDB : defaultLeaders;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'president': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'vice-president': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'secretary': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'treasurer': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="text-leadership-title">
              {t('নেতৃবৃন্দ', 'Our Leadership')}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-leadership-description">
            {t(
              'আজাদী সমাজ কল্যাণ সংঘের নেতৃত্ব দল যারা সমাজসেবায় নিবেদিত এবং মানুষের কল্যাণে কর্মরত',
              'The dedicated leadership team of Azadi Social Welfare Organization working for social welfare'
            )}
          </p>
        </div>

        {/* Leaders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {leaders.map((leader, index) => (
            <Card 
              key={index} 
              className="overflow-hidden hover-elevate transition-all duration-300 group" 
              data-testid={`card-leader-${index}`}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 aspect-[3/4]">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Role Badge */}
                <Badge 
                  className={`absolute top-3 right-3 text-xs font-semibold ${getRoleColor(leader.role)}`}
                  data-testid={`badge-role-${index}`}
                >
                  {language === 'bn' ? leader.position : leader.positionEn}
                </Badge>
              </div>

              {/* Content */}
              <CardContent className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <h3 className="text-xl font-bold mb-1 line-clamp-2" data-testid={`text-leader-name-${index}`}>
                    {leader.name}
                  </h3>
                  <p className="text-sm font-semibold text-primary" data-testid={`text-leader-position-${index}`}>
                    {language === 'bn' ? leader.position : leader.positionEn}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full"></div>

                {/* Quote */}
                <div className="pt-2">
                  <div className="flex items-start gap-2">
                    <Heart className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-3" data-testid={`text-leader-quote-${index}`}>
                      "{language === 'bn' ? leader.quote : leader.quoteEn}"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Leadership Message Section */}
        <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-xl border border-primary/10 p-8 md:p-12">
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-message-title">
                {t('নেতৃত্বের মহান বার্তা', 'Leadership Message')}
              </h2>
              <p className="text-sm text-muted-foreground">{t('আমাদের ভিশন এবং মিশন', 'Our Vision and Mission')}</p>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-message-content">
              {t(
                'আজাদী সমাজ কল্যাণ সংঘের পক্ষ থেকে আমরা সকলকে হৃদয় উষ্ণ স্বাগতম জানাই। আমরা বিশ্বাস করি যে সমাজের প্রতিটি স্তরের মানুষের কল্যাণ আমাদের দায়িত্ব। আমাদের নেতৃত্ব দল সর্বদা সমাজসেবায় নিয়োজিত থাকে এবং সুবিধাবঞ্চিত মানুষদের জীবনমান উন্নয়নে অঙ্গীকারবদ্ধ। আপনিও এই মহৎ উদ্দেশ্যে আমাদের সাথে যুক্ত হয়ে অবদান রাখতে পারেন।',
                'On behalf of Azadi Social Welfare Organization, we warmly welcome everyone. We believe that the welfare of every strata of society is our responsibility. Our leadership team is always engaged in social service and committed to improving the lives of underprivileged people. You too can contribute to this noble cause by joining us.'
              )}
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-8 pt-6 border-t border-primary/10">
              <Badge className="bg-primary/10 text-primary">{t('সততা', 'Integrity')}</Badge>
              <Badge className="bg-primary/10 text-primary">{t('স্বচ্ছতা', 'Transparency')}</Badge>
              <Badge className="bg-primary/10 text-primary">{t('দায়বদ্ধতা', 'Accountability')}</Badge>
              <Badge className="bg-primary/10 text-primary">{t('কার্যকারিতা', 'Effectiveness')}</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
