import { useLanguage } from '@/lib/language';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertAboutPageSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { Loader2, Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { convertToBase64 } from '@/lib/imageUtils';

export default function AdminAbout() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { data: aboutData = {} } = useQuery<any>({
    queryKey: ['/api/about-page'],
  });

  const form = useForm({
    resolver: zodResolver(insertAboutPageSchema),
    defaultValues: {
      historyP1: aboutData?.historyP1 || '',
      historyP1En: aboutData?.historyP1En || '',
      historyP2: aboutData?.historyP2 || '',
      historyP2En: aboutData?.historyP2En || '',
      historyP3: aboutData?.historyP3 || '',
      historyP3En: aboutData?.historyP3En || '',
      image: aboutData?.image || '',
      studentsCount: aboutData?.studentsCount || '১০০০+',
      eventsCount: aboutData?.eventsCount || '৫০+',
      yearsCount: aboutData?.yearsCount || '৩৬+',
      officeHours: aboutData?.officeHours || '২৪/৭',
      officeHoursEn: aboutData?.officeHoursEn || '24/7',
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setImagePreview(base64);
        form.setValue('image', base64);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: t('ত্রুটি', 'Error'),
          description: t('ছবি আপলোড ব্যর্থ হয়েছে', 'Failed to upload image'),
        });
      }
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (aboutData?.id) {
        return await apiRequest('PATCH', `/api/about-page/${aboutData.id}`, data);
      }
      return await apiRequest('POST', '/api/about-page', data);
    },
    onSuccess: () => {
      toast({
        title: t('সাফল্য!', 'Success!'),
        description: t('পৃষ্ঠা সংরক্ষণ হয়েছে', 'Page saved successfully'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/about-page'] });
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
        <h1 className="text-3xl font-bold mb-2" data-testid="text-admin-about-title">
          {t('আমাদের সম্পর্কে পৃষ্ঠা পরিচালনা করুন', 'Manage About Page')}
        </h1>
        <p className="text-muted-foreground">
          {t('আমাদের সম্পর্কে পৃষ্ঠার সমস্ত কন্টেন্ট সম্পাদনা করুন', 'Edit all content on the About page')}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('পৃষ্ঠা ছবি', 'Page Image')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">{t('ছবি আপলোড করুন', 'Upload Image')}</Label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={imageInputRef}
                    className="hidden"
                    data-testid="input-about-image"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full"
                    data-testid="button-upload-about-image"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {t('ছবি বেছে নিন', 'Choose Image')}
                  </Button>
                </div>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setImagePreview(null);
                      form.setValue('image', '');
                    }}
                    data-testid="button-clear-about-image"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {imagePreview && (
                <div className="mt-4">
                  <img src={imagePreview} alt="About Preview" className="w-full h-40 object-cover rounded-md" data-testid="img-about-preview" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* History Sections */}
        <Card>
          <CardHeader>
            <CardTitle>{t('ইতিহাস', 'History')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((num: number) => {
              const historyKey = `historyP${num}` as any;
              const historyEnKey = `historyP${num}En` as any;
              return (
                <div key={num} className="space-y-2">
                  <Label className="font-semibold">{t(`অনুচ্ছেদ ${num}`, `Paragraph ${num}`)}</Label>
                  <Textarea
                    placeholder={`Bengali paragraph ${num}`}
                    className="h-20 resize-none text-sm"
                    {...form.register(historyKey)}
                    data-testid={`textarea-history-p${num}-bn`}
                  />
                  <Textarea
                    placeholder={`English paragraph ${num}`}
                    className="h-20 resize-none text-sm"
                    {...form.register(historyEnKey)}
                    data-testid={`textarea-history-p${num}-en`}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Impact Numbers */}
        <Card>
          <CardHeader>
            <CardTitle>{t('প্রভাব সংখ্যা এবং কার্যালয় সময়', 'Impact Numbers & Office Hours')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label className="text-xs">{t('শিক্ষার্থী', 'Students')}</Label>
                <Input
                  placeholder="১০০০+"
                  className="h-8 text-sm"
                  {...form.register('studentsCount')}
                  data-testid="input-students-count"
                />
              </div>
              <div>
                <Label className="text-xs">{t('কার্যক্রম', 'Events')}</Label>
                <Input
                  placeholder="৫০+"
                  className="h-8 text-sm"
                  {...form.register('eventsCount')}
                  data-testid="input-events-count"
                />
              </div>
              <div>
                <Label className="text-xs">{t('বছর', 'Years')}</Label>
                <Input
                  placeholder="৩৬+"
                  className="h-8 text-sm"
                  {...form.register('yearsCount')}
                  data-testid="input-years-count"
                />
              </div>
              <div>
                <Label className="text-xs">{t('কার্যালয় সময় (বাংলা)', 'Office Hours (Bengali)')}</Label>
                <Input
                  placeholder="২৪/৭"
                  className="h-8 text-sm"
                  {...form.register('officeHours')}
                  data-testid="input-office-hours-bn"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">{t('কার্যালয় সময় (ইংরেজি)', 'Office Hours (English)')}</Label>
              <Input
                placeholder="24/7"
                className="h-8 text-sm"
                {...form.register('officeHoursEn')}
                data-testid="input-office-hours-en"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={mutation.isPending} className="w-full" data-testid="button-save-about">
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('সংরক্ষণ করুন', 'Save Changes')}
        </Button>
      </form>
    </div>
  );
}
