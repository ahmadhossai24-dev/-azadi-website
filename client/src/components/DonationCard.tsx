import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useLanguage } from '@/lib/language';

interface DonationPackage {
  id: string;
  amount: number;
  title: string;
  titleEn: string;
  features: string[];
  featuresEn: string[];
  isPopular?: boolean;
}

export default function DonationCard({ amount, title, titleEn, features, featuresEn, isPopular }: DonationPackage) {
  const { language, t } = useLanguage();

  return (
    <Card className={`relative ${isPopular ? 'border-primary shadow-lg' : ''} hover-elevate transition-all`} data-testid={`card-donation-${amount}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-accent text-accent-foreground" data-testid="badge-popular">
            {t('জনপ্রিয়', 'Popular')}
          </Badge>
        </div>
      )}
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl mb-2" data-testid={`text-donation-title-${amount}`}>
          {language === 'bn' ? title : titleEn}
        </CardTitle>
        <div className="text-4xl font-bold text-primary" data-testid={`text-donation-amount-${amount}`}>
          ৳{amount.toLocaleString('bn-BD')}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 mb-6">
          {(language === 'bn' ? features : featuresEn).map((feature, index) => (
            <li key={index} className="flex items-start gap-2" data-testid={`text-donation-feature-${amount}-${index}`}>
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button className="w-full" variant={isPopular ? 'default' : 'outline'} data-testid={`button-donate-${amount}`}>
          {t('দান করুন', 'Donate Now')}
        </Button>
      </CardContent>
    </Card>
  );
}
