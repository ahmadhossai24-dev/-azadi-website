import { useLanguage } from '@/lib/language';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function Contact() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const { data: contactData = {} } = useQuery<any>({
    queryKey: ['/api/contact-page'],
  });

  const { data: socialData = {} } = useQuery<any>({
    queryKey: ['/api/social-media'],
  });

  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const volunteerMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/volunteers', data);
    },
    onSuccess: () => {
      toast({
        title: t('সাফল্য!', 'Success!'),
        description: t('আপনার আবেদন সফলভাবে জমা হয়েছে', 'Your application has been submitted successfully'),
      });
      setVolunteerForm({ name: '', email: '', phone: '', message: '' });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: t('ত্রুটি', 'Error'),
        description: error.message,
      });
    },
  });

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    volunteerMutation.mutate(volunteerForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    toast({
      title: t('বার্তা পাঠানো হয়েছে!', 'Message Sent!'),
      description: t(
        'আপনার বার্তার জন্য ধন্যবাদ। শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।',
        'Thank you for your message. We will contact you soon.'
      ),
    });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-contact-title">
            {t('যোগাযোগ করুন', 'Contact Us')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-contact-description">
            {t(
              'আমাদের সাথে যোগাযোগ করুন। আমরা আপনার সাহায্য করতে সর্বদা প্রস্তুত।',
              'Contact us. We are always ready to help you.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="hover-elevate transition-all">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2" data-testid="text-phone-title">
                {t('ফোন', 'Phone')}
              </h3>
              <p className="text-muted-foreground" data-testid="text-phone-number">+8801711975488</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2" data-testid="text-email-title">
                {t('ইমেইল', 'Email')}
              </h3>
              <p className="text-muted-foreground" data-testid="text-email-address">azadisocialwelfareorganization@gmail.com</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2" data-testid="text-address-title">
                {t('ঠিকানা', 'Address')}
              </h3>
              <p className="text-muted-foreground" data-testid="text-address-details">
                {t('১নং রাস্তা মিরবক্সটুলা সিলেট', '1 No. Road Mirbokstula Sylhet')}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-form-title">
                {t('বার্তা পাঠান', 'Send Message')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('নাম', 'Name')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="input-contact-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t('ইমেইল', 'Email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    data-testid="input-contact-email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t('ফোন নম্বর', 'Phone Number')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    data-testid="input-contact-phone"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">{t('বিষয়', 'Subject')}</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    data-testid="input-contact-subject"
                  />
                </div>
                <div>
                  <Label htmlFor="message">{t('বার্তা', 'Message')}</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    required
                    data-testid="textarea-contact-message"
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="button-submit-contact">
                  {t('বার্তা পাঠান', 'Send Message')}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-office-hours-title">
                  {t('কার্যালয়ের সময়', 'Office Hours')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm whitespace-pre-line">
                  {language === 'bn' ? (contactData?.sundayThursdayBn || 'রবিবার - বৃহস্পতিবার\n৯:০০ AM - ৫:০০ PM') : (contactData?.sundayThursdayEn || 'Sunday - Thursday\n9:00 AM - 5:00 PM')}
                </div>
                <div className="text-sm whitespace-pre-line">
                  {language === 'bn' ? (contactData?.fridayBn || 'শুক্রবার\nবন্ধ') : (contactData?.fridayEn || 'Friday\nClosed')}
                </div>
                <div className="text-sm whitespace-pre-line">
                  {language === 'bn' ? (contactData?.saturdayBn || 'শনিবার\n১০:০০ AM - ২:०० PM') : (contactData?.saturdayEn || 'Saturday\n10:00 AM - 2:00 PM')}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle data-testid="text-social-media-title">
                  {t('সামাজিক যোগাযোগ', 'Social Media')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4" data-testid="text-social-description">
                  {t(
                    'আমাদের সামাজিক মাধ্যমে ফলো করুন এবং সর্বশেষ আপডেট পান',
                    'Follow us on social media and get the latest updates'
                  )}
                </p>
                <div className="flex gap-3">
                  {socialData?.facebook && (
                    <a href={socialData.facebook} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" data-testid="button-social-facebook">
                        <Facebook className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                  {socialData?.instagram && (
                    <a href={socialData.instagram} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" data-testid="button-social-instagram">
                        <Instagram className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                  {socialData?.youtube && (
                    <a href={socialData.youtube} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" data-testid="button-social-youtube">
                        <Youtube className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle data-testid="text-volunteer-title">
                  {t('স্বেচ্ছাসেবক হন', 'Become a Volunteer')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVolunteerSubmit} className="space-y-3">
                  <div>
                    <Label htmlFor="vol-name" className="text-xs">{t('নাম', 'Name')}</Label>
                    <Input
                      id="vol-name"
                      value={volunteerForm.name}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, name: e.target.value })}
                      required
                      className="h-8 text-sm"
                      data-testid="input-volunteer-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vol-email" className="text-xs">{t('ইমেইল', 'Email')}</Label>
                    <Input
                      id="vol-email"
                      type="email"
                      value={volunteerForm.email}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })}
                      required
                      className="h-8 text-sm"
                      data-testid="input-volunteer-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vol-phone" className="text-xs">{t('ফোন', 'Phone')}</Label>
                    <Input
                      id="vol-phone"
                      type="tel"
                      value={volunteerForm.phone}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, phone: e.target.value })}
                      required
                      className="h-8 text-sm"
                      data-testid="input-volunteer-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vol-message" className="text-xs">{t('বার্তা', 'Message')}</Label>
                    <Textarea
                      id="vol-message"
                      value={volunteerForm.message}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, message: e.target.value })}
                      className="h-16 resize-none text-sm"
                      placeholder={t('আপনার আগ্রহ বলুন', 'Tell us about your interests')}
                      data-testid="textarea-volunteer-message"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={volunteerMutation.isPending}
                    data-testid="button-volunteer-submit"
                  >
                    {volunteerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('যোগ দিন', 'Join Now')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
