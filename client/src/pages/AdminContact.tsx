import { useLanguage } from '@/lib/language';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertContactPageSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { Loader2 } from 'lucide-react';

export default function AdminContact() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const { data: contactData = {} } = useQuery<any>({
    queryKey: ['/api/contact-page'],
  });

  const form = useForm({
    resolver: zodResolver(insertContactPageSchema),
    defaultValues: {
      sundayThursdayBn: contactData?.sundayThursdayBn || 'রবিবার - বৃহস্পতিবার\n৯:০০ AM - ৫:०० PM',
      sundayThursdayEn: contactData?.sundayThursdayEn || 'Sunday - Thursday\n9:00 AM - 5:00 PM',
      fridayBn: contactData?.fridayBn || 'শুক্রবার\nবন্ধ',
      fridayEn: contactData?.fridayEn || 'Friday\nClosed',
      saturdayBn: contactData?.saturdayBn || 'শনিবার\n১०:०० AM - २:००० PM',
      saturdayEn: contactData?.saturdayEn || 'Saturday\n10:00 AM - 2:00 PM',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (contactData?.id) {
        return await apiRequest('PATCH', `/api/contact-page/${contactData.id}`, data);
      }
      return await apiRequest('POST', '/api/contact-page', data);
    },
    onSuccess: () => {
      toast({
        title: t('সাফল্য!', 'Success!'),
        description: t('পৃষ্ঠা সংরক্ষণ হয়েছে', 'Page saved successfully'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/contact-page'] });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: t('ত্রুটি', 'Error'),
        description: error.message,
      });
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <div className="p-6 space-y-6 max-h-[90vh] overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-admin-contact-title">
          {t('যোগাযোগ পৃষ্ঠা পরিচালনা করুন', 'Manage Contact Page')}
        </h1>
        <p className="text-muted-foreground">
          {t('কার্যালয়ের সময় সম্পাদনা করুন', 'Edit office hours')}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Sunday - Thursday */}
        <Card>
          <CardHeader>
            <CardTitle>{t('রবিবার - বৃহস্পতিবার', 'Sunday - Thursday')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">{t('বাংলায়', 'Bengali')}</Label>
              <Textarea
                placeholder="রবিবার - বৃহস্পতিবার\n९:००० AM - ५:०० PM"
                className="h-20 resize-none text-sm"
                {...form.register('sundayThursdayBn')}
                data-testid="textarea-sunday-thursday-bn"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">{t('ইংরেজিতে', 'English')}</Label>
              <Textarea
                placeholder="Sunday - Thursday\n9:00 AM - 5:00 PM"
                className="h-20 resize-none text-sm"
                {...form.register('sundayThursdayEn')}
                data-testid="textarea-sunday-thursday-en"
              />
            </div>
          </CardContent>
        </Card>

        {/* Friday */}
        <Card>
          <CardHeader>
            <CardTitle>{t('শুক্রবার', 'Friday')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">{t('বাংলায়', 'Bengali')}</Label>
              <Textarea
                placeholder="শুক্রবার\nবন্ধ"
                className="h-20 resize-none text-sm"
                {...form.register('fridayBn')}
                data-testid="textarea-friday-bn"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">{t('ইংরেজিতে', 'English')}</Label>
              <Textarea
                placeholder="Friday\nClosed"
                className="h-20 resize-none text-sm"
                {...form.register('fridayEn')}
                data-testid="textarea-friday-en"
              />
            </div>
          </CardContent>
        </Card>

        {/* Saturday */}
        <Card>
          <CardHeader>
            <CardTitle>{t('শনিবার', 'Saturday')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">{t('বাংলায়', 'Bengali')}</Label>
              <Textarea
                placeholder="শনিবার\n१०:०० AM - २:००० PM"
                className="h-20 resize-none text-sm"
                {...form.register('saturdayBn')}
                data-testid="textarea-saturday-bn"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">{t('ইংরেজিতে', 'English')}</Label>
              <Textarea
                placeholder="Saturday\n10:00 AM - 2:00 PM"
                className="h-20 resize-none text-sm"
                {...form.register('saturdayEn')}
                data-testid="textarea-saturday-en"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={mutation.isPending} className="w-full" data-testid="button-save-contact">
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('সংরক্ষণ করুন', 'Save Changes')}
        </Button>
      </form>
    </div>
  );
}
