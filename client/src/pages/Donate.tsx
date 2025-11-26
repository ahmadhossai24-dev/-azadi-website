import { useLanguage } from '@/lib/language';
import DonationCard from '@/components/DonationCard';
import { DonationReceipt } from '@/components/DonationReceipt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Heart, CreditCard, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import arabicCalligraphyImage from '@assets/generated_images/arabic_calligraphy_islamic_charity_hadith.png';
import type { Donation } from '@shared/schema';

export default function Donate() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    name: string;
    amount: number;
    purpose: string;
    transactionId: string;
    paymentMethod: string;
    email: string;
    phone: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    purpose: 'শিক্ষা কার্যক্রম',
    message: '',
    paymentMethod: 'bkash',
    transactionId: '',
  });

  const purposes = [
    { value: 'শিক্ষা কার্যক্রম', label: t('শিক্ষা কার্যক্রম', 'Education Program') },
    { value: 'শান্তি উদ্যোগ', label: t('শান্তি উদ্যোগ', 'Peace Initiative') },
    { value: 'ক্রীড়া কার্যক্রম', label: t('ক্রীড়া কার্যক্রম', 'Sports Program') },
    { value: 'স্বাস্থ্য সেবা', label: t('স্বাস্থ্য সেবা', 'Health Service') },
    { value: 'সাধারণ সহায়তা', label: t('সাধারণ সহায়তা', 'General Support') },
  ];

  const { data: approvedDonations = [] } = useQuery({
    queryKey: ['/api/donations/approved'],
    queryFn: async () => {
      const res = await fetch('/api/donations/approved');
      return res.json();
    },
  });

  const donationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/donations', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        amount: parseInt(formData.amount),
        purpose: formData.purpose,
        message: formData.message,
        transactionId: formData.transactionId,
      });
      return res.json();
    },
    onSuccess: () => {
      setReceiptData({
        name: formData.name,
        amount: parseInt(formData.amount),
        purpose: formData.purpose,
        transactionId: formData.transactionId,
        paymentMethod: formData.paymentMethod,
        email: formData.email,
        phone: formData.phone,
      });
      setShowReceipt(true);
      toast({
        title: t('সফল!', 'Success!'),
        description: t(
          'আপনার দান জমা হয়েছে। আপনার রশিদ নিচে প্রদর্শিত হচ্ছে।',
          'Your donation has been submitted. Your receipt is shown below.'
        ),
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        amount: '',
        purpose: 'শিক্ষা কার্যক্রম',
        message: '',
        paymentMethod: 'bkash',
        transactionId: '',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/donations/approved'] });
    },
    onError: () => {
      toast({
        title: t('ত্রুটি', 'Error'),
        description: t('দান জমা করতে ব্যর্থ', 'Failed to submit donation'),
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.transactionId) {
      toast({
        title: t('ত্রুটি', 'Error'),
        description: t('অনুগ্রহ করে ট্রানজেকশন আইডি প্রদান করুন', 'Please provide transaction ID'),
        variant: 'destructive',
      });
      return;
    }
    donationMutation.mutate();
  };

  const donationPackages = [
    {
      id: '1',
      amount: 500,
      title: 'ছোট সহায়তা',
      titleEn: 'Small Support',
      features: [
        'একজন শিক্ষার্থীর জন্য বই',
        'একটি পরিবারের জন্য খাদ্য সামগ্রী',
        'সার্টিফিকেট প্রদান',
      ],
      featuresEn: [
        'Books for one student',
        'Food items for one family',
        'Certificate provided',
      ],
    },
    {
      id: '2',
      amount: 1000,
      title: 'মাঝারি সহায়তা',
      titleEn: 'Medium Support',
      features: [
        'তিনজন শিক্ষার্থীর জন্য শিক্ষা উপকরণ',
        'দুটি পরিবারের জন্য খাদ্য সামগ্রী',
        'বিশেষ স্বীকৃতি সার্টিফিকেট',
        'ওয়েবসাইটে নাম প্রদর্শন',
      ],
      featuresEn: [
        'Educational materials for three students',
        'Food items for two families',
        'Special recognition certificate',
        'Name displayed on website',
      ],
      isPopular: true,
    },
    {
      id: '3',
      amount: 5000,
      title: 'বড় সহায়তা',
      titleEn: 'Large Support',
      features: [
        'দশজন শিক্ষার্থীর জন্য সম্পূর্ণ শিক্ষা উপকরণ',
        'পাঁচটি পরিবারের জন্য মাসিক খাদ্য সামগ্রী',
        'বিশেষ সম্মাননা সার্টিফিকেট',
        'ওয়েবসাইটে বিশেষভাবে স্বীকৃতি',
        'ইভেন্টে বিশেষ আমন্ত্রণ',
      ],
      featuresEn: [
        'Complete educational materials for ten students',
        'Monthly food items for five families',
        'Special honor certificate',
        'Special recognition on website',
        'Special invitation to events',
      ],
    },
  ];

  return (
    <>
      {showReceipt && receiptData && (
        <DonationReceipt
          {...receiptData}
          onClose={() => setShowReceipt(false)}
        />
      )}
      <div className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="text-donate-title">
            {t('দান করুন', 'Make a Donation')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-donate-description">
            {t(
              'আপনার সহায়তা আমাদের সমাজসেবা কার্যক্রম চালিয়ে যেতে সাহায্য করবে। প্রতিটি টাকা সরাসরি সমাজের উন্নয়নে ব্যবহৃত হয়।',
              'Your support will help us continue our social welfare programs. Every donation goes directly to community development.'
            )}
          </p>
        </div>

        <div className="mb-20">
          <img
            src={arabicCalligraphyImage}
            alt="Arabic Calligraphy - Islamic Charity"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
          />
        </div>

        <div className="mb-20">
          <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 rounded-3xl p-8 md:p-12 lg:p-16 border border-primary/30 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50"></div>
            <div className="relative z-10 text-center space-y-8">
              <div className="space-y-4">
                <p className="text-4xl md:text-5xl font-bold text-primary" dir="rtl" data-testid="text-quranic-arabic">
                  والذين ينفقون أموالهم بالليل والنهار سرا وعلانية
                </p>
                <p className="text-2xl md:text-3xl font-bold text-primary mb-2" data-testid="text-quranic-bengali">
                  যারা দিন রাত, গোপনে এবং প্রকাশ্যে তাদের সম্পদ ব্যয় করে
                </p>
                <p className="text-xl md:text-2xl font-semibold text-accent mb-4" data-testid="text-quranic-english">
                  Those who spend their wealth by night and by day, in secret and in public
                </p>
                <p className="text-base md:text-lg text-muted-foreground italic mb-4">(সূরা আল-ইমরান ৩:১৩৪ / Al-Imran 3:134)</p>
              </div>

              <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {t(
                  'ইসলামে দান হল একটি মহান আমল যা আমাদের আত্মা পরিশুদ্ধি করে এবং সমাজে ভালোবাসা ছড়িয়ে দেয়। আপনার সহায়তা অসহায়দের জীবনে আলো নিয়ে আসবে।',
                  'In Islam, charity is a noble act that purifies our souls and spreads love in society. Your support will bring light to the lives of those in need.'
                )}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-4">
                <div className="bg-white dark:bg-slate-900/50 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-primary/20">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-2">লক্ষ</div>
                  <p className="text-sm text-muted-foreground">{t('লক্ষ্য অর্জনের জন্য একসাথে কাজ করি', 'Work together to achieve our goals')}</p>
                </div>
                <div className="bg-white dark:bg-slate-900/50 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-accent/20">
                  <div className="text-2xl md:text-3xl font-bold text-accent mb-2">সেবা</div>
                  <p className="text-sm text-muted-foreground">{t('সবার জন্য নিরলস সেবা প্রদান করি', 'We provide tireless service for all')}</p>
                </div>
                <div className="bg-white dark:bg-slate-900/50 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-primary/20">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-2">ভালোবাসা</div>
                  <p className="text-sm text-muted-foreground">{t('মানবিক ভালোবাসায় বিশ্বাস করি', 'We believe in humanitarian love')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-20">
          <div className="w-full max-w-2xl">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-3xl blur-2xl opacity-30"></div>
              <Card className="border-0 shadow-2xl relative backdrop-blur-xl bg-gradient-to-br from-blue-900/95 via-blue-800/95 to-blue-900/95 border border-blue-700/50">
                <CardHeader className="bg-gradient-to-r from-blue-950 to-blue-900 border-b border-blue-700/30 rounded-t-3xl">
                  <CardTitle className="text-2xl md:text-3xl text-white text-center" data-testid="text-donation-form-title">
                    {t('অনলাইন দান', 'Online Donation')}
                  </CardTitle>
                  <p className="text-center text-blue-100 text-sm mt-2 font-medium">{t('আপনার দান দিয়ে সমাজ সেবা করুন', 'Contribute to society with your donation')}</p>
                </CardHeader>
                <CardContent className="pt-8 pb-8 px-6 md:px-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm font-semibold text-blue-100">{t('নাম', 'Name')}</Label>
                    <Input
                      id="name"
                      placeholder={t('আপনার নাম', 'Your name')}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      data-testid="input-donor-name"
                      className="bg-blue-800/50 border-blue-600/50 text-white placeholder:text-blue-300/60 focus:border-blue-400 focus:ring-blue-400/20 h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-semibold text-blue-100">{t('ইমেইল', 'Email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('ইমেইল', 'Email')}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      data-testid="input-donor-email"
                      className="bg-blue-800/50 border-blue-600/50 text-white placeholder:text-blue-300/60 focus:border-blue-400 focus:ring-blue-400/20 h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-sm font-semibold text-blue-100">{t('ফোন', 'Phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t('01xxxxxxxxx', '01xxxxxxxxx')}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      data-testid="input-donor-phone"
                      className="bg-blue-800/50 border-blue-600/50 text-white placeholder:text-blue-300/60 focus:border-blue-400 focus:ring-blue-400/20 h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="amount" className="text-sm font-semibold text-blue-100">{t('পরিমাণ (৳)', 'Amount (৳)')}</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="100"
                      step="100"
                      placeholder="100"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                      data-testid="input-donor-amount"
                      className="bg-blue-800/50 border-blue-600/50 text-white placeholder:text-blue-300/60 focus:border-blue-400 focus:ring-blue-400/20 h-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="purpose" className="text-sm font-semibold text-blue-100">{t('উদ্দেশ্য', 'Purpose')}</Label>
                  <Select value={formData.purpose} onValueChange={(value) => setFormData({ ...formData, purpose: value })}>
                    <SelectTrigger data-testid="select-donation-purpose" className="bg-blue-800/50 border-blue-600/50 text-white h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-blue-800 border-blue-600">
                      {purposes.map((p) => (
                        <SelectItem key={p.value} value={p.value} className="text-white">{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-900/50 border border-blue-600/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-200 flex-shrink-0" />
                    <h4 className="font-bold text-sm text-blue-100">{t('পেমেন্ট পদ্ধতি', 'Payment Method')}</h4>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center gap-3 p-2.5 border border-blue-600/30 rounded-lg cursor-pointer hover:bg-blue-800/50 transition-colors bg-blue-800/30">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bkash"
                        checked={formData.paymentMethod === 'bkash'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="accent-blue-300"
                      />
                      <span className="font-medium text-blue-100 text-xs md:text-sm">bKash: 01711975488</span>
                    </label>
                    <label className="flex items-center gap-3 p-2.5 border border-blue-600/30 rounded-lg cursor-pointer hover:bg-blue-800/50 transition-colors bg-blue-800/30">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="nagad"
                        checked={formData.paymentMethod === 'nagad'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="accent-blue-300"
                      />
                      <span className="font-medium text-blue-100 text-xs md:text-sm">Nagad: 01711975488</span>
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="transactionId" className="text-xs md:text-sm font-semibold text-blue-100">{t('ট্রানজেকশন আইডি', 'Transaction ID')}</Label>
                    <Input
                      id="transactionId"
                      placeholder={t('নিশ্চিতকরণ কোড', 'Confirmation code')}
                      value={formData.transactionId}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                      required
                      data-testid="input-transaction-id"
                      className="bg-blue-800/50 border-blue-600/50 text-white placeholder:text-blue-300/60 focus:border-blue-400 focus:ring-blue-400/20 h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-sm font-semibold text-blue-100">{t('বার্তা (ঐচ্ছিক)', 'Message')}</Label>
                  <Textarea
                    id="message"
                    placeholder={t('বার্তা লিখুন...', 'Write your message...')}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={2}
                    data-testid="textarea-donor-message"
                    className="bg-blue-800/50 border-blue-600/50 text-white placeholder:text-blue-300/60 focus:border-blue-400 focus:ring-blue-400/20 text-sm"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full text-base py-5 font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg" 
                  data-testid="button-submit-donation"
                  disabled={donationMutation.isPending}
                >
                  {donationMutation.isPending ? t('জমা হচ্ছে...', 'Submitting...') : t('দান করুন', 'Make Donation')}
                </Button>

                <p className="text-xs text-blue-200/70 text-center">{t('নিরাপদ এবং গোপনীয়', 'Secure & Confidential')}</p>
              </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="bg-primary/5 border-0 shadow-md">
            <CardContent className="pt-8">
              <div className="flex gap-4">
                <div className="p-3 bg-primary/15 rounded-full h-fit">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2" data-testid="text-secure-title">
                    {t('নিরাপদ পেমেন্ট', 'Secure Payment')}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-secure-description">
                    {t(
                      'আপনার দান সম্পূর্ণ নিরাপদ এবং গোপনীয়। আমরা আপনার ব্যক্তিগত তথ্য সুরক্ষিত রাখি।',
                      'Your donation is completely secure and confidential. We keep your personal information safe.'
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent/5 border-0 shadow-md">
            <CardContent className="pt-8">
              <div className="flex gap-4">
                <div className="p-3 bg-accent/15 rounded-full h-fit">
                  <Heart className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2" data-testid="text-impact-title">
                    {t('আপনার প্রভাব', 'Your Impact')}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-impact-description">
                    {t(
                      'প্রতিটি দান সরাসরি সমাজসেবা কার্যক্রমে ব্যবহৃত হয়। আমরা সম্পূর্ণ স্বচ্ছতা বজায় রাখি।',
                      'Every donation is used directly for social welfare programs. We maintain complete transparency.'
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {approvedDonations.length > 0 && (
            <Card className="border-0 shadow-md bg-green/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" data-testid="text-recent-donations-title">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  {t('সম্প্রতি অনুমোদিত দান', 'Recent Approved Donations')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {approvedDonations.slice(0, 5).map((donation: Donation) => (
                    <div key={donation.id} className="flex justify-between items-start p-3 bg-background/50 rounded-lg border border-green-200/50">
                      <div>
                        <p className="font-semibold text-sm">{donation.name}</p>
                        <p className="text-xs text-muted-foreground">{donation.purpose}</p>
                      </div>
                      <p className="font-bold text-primary">৳{donation.amount}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
