import { useLanguage } from '@/lib/language';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertHomePageSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { Loader2, Upload, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { convertToBase64 } from '@/lib/imageUtils';
import z from 'zod';

export default function AdminHome() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [servicesImagePreview, setServicesImagePreview] = useState<string | null>(null);
  const [eventsImagePreview, setEventsImagePreview] = useState<string | null>(null);
  
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const servicesImageInputRef = useRef<HTMLInputElement>(null);
  const eventsImageInputRef = useRef<HTMLInputElement>(null);

  const { data: homeData = {} } = useQuery<any>({
    queryKey: ['/api/home-page'],
  });

  // Hero Section Form
  const heroForm = useForm({
    defaultValues: {
      heroTitle: homeData?.heroTitle || '',
      heroTitleEn: homeData?.heroTitleEn || '',
      heroDescription: homeData?.heroDescription || '',
      heroDescriptionEn: homeData?.heroDescriptionEn || '',
      heroImage: homeData?.heroImage || '',
    },
  });

  // Founded Date Section Form
  const foundedDateForm = useForm({
    defaultValues: {
      foundedDate: homeData?.foundedDate || '১০ জুন ১৯৮৮',
      foundedDateEn: homeData?.foundedDateEn || '10 June 1988',
    },
  });

  // Services Section Form
  const servicesForm = useForm({
    defaultValues: {
      servicesTitle: homeData?.servicesTitle || '',
      servicesTitleEn: homeData?.servicesTitleEn || '',
      servicesDescription: homeData?.servicesDescription || '',
      servicesDescriptionEn: homeData?.servicesDescriptionEn || '',
      servicesImage: homeData?.servicesImage || '',
    },
  });

  // Events Section Form
  const eventsForm = useForm({
    defaultValues: {
      eventsTitle: homeData?.eventsTitle || '',
      eventsTitleEn: homeData?.eventsTitleEn || '',
      eventsImage: homeData?.eventsImage || '',
    },
  });

  // Update form values when homeData loads
  useEffect(() => {
    if (homeData?.id) {
      heroForm.reset({
        heroTitle: homeData.heroTitle || '',
        heroTitleEn: homeData.heroTitleEn || '',
        heroDescription: homeData.heroDescription || '',
        heroDescriptionEn: homeData.heroDescriptionEn || '',
        heroImage: homeData.heroImage || '',
      });
      foundedDateForm.reset({
        foundedDate: homeData.foundedDate || '১০ জুন ১৯৮৮',
        foundedDateEn: homeData.foundedDateEn || '10 June 1988',
      });
      servicesForm.reset({
        servicesTitle: homeData.servicesTitle || '',
        servicesTitleEn: homeData.servicesTitleEn || '',
        servicesDescription: homeData.servicesDescription || '',
        servicesDescriptionEn: homeData.servicesDescriptionEn || '',
        servicesImage: homeData.servicesImage || '',
      });
      eventsForm.reset({
        eventsTitle: homeData.eventsTitle || '',
        eventsTitleEn: homeData.eventsTitleEn || '',
        eventsImage: homeData.eventsImage || '',
      });
    }
  }, [homeData?.id]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, setPreview: any, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setPreview(base64);
        return base64;
      } catch (error) {
        toast({
          variant: 'destructive',
          title: t('ত্রুটি', 'Error'),
          description: t('ছবি আপলোড ব্যর্থ হয়েছে', 'Failed to upload image'),
        });
      }
    }
  };

  const ImageUploadSection = ({ label, preview, setPreview, fieldName, inputRef, form }: any) => (
    <div>
      <Label className="text-sm font-semibold">{t(label[0], label[1])}</Label>
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const base64 = await handleImageChange(e, setPreview, fieldName);
              if (base64) form.setValue(fieldName as any, base64);
            }}
            ref={inputRef}
            className="hidden"
            data-testid={`input-${fieldName}`}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            className="w-full"
            data-testid={`button-upload-${fieldName}`}
          >
            <Upload className="h-4 w-4 mr-2" />
            {t('ছবি বেছে নিন', 'Choose Image')}
          </Button>
        </div>
        {preview && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              setPreview(null);
              form.setValue(fieldName as any, '');
            }}
            data-testid={`button-clear-${fieldName}`}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {preview && (
        <div className="mt-2">
          <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-md" data-testid={`img-${fieldName}-preview`} />
        </div>
      )}
    </div>
  );

  // Mutations for each section
  const heroMutation = useMutation({
    mutationFn: async (data: any) => {
      const current = queryClient.getQueryData(['/api/home-page']) as any;
      if (current?.id) {
        return await apiRequest('PATCH', `/api/home-page/${current.id}`, data);
      }
      return await apiRequest('POST', '/api/home-page', data);
    },
    onSuccess: () => {
      toast({
        title: t('সাফল্য!', 'Success!'),
        description: t('হিরো সেকশন সংরক্ষণ হয়েছে', 'Hero section saved'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/home-page'] });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: t('ত্রুটি', 'Error'),
        description: error.message,
      });
    },
  });

  const foundedDateMutation = useMutation({
    mutationFn: async (data: any) => {
      const current = queryClient.getQueryData(['/api/home-page']) as any;
      if (current?.id) {
        return await apiRequest('PATCH', `/api/home-page/${current.id}`, data);
      }
      // If no ID yet, merge with existing data for POST
      const mergedData = { ...current, ...data };
      return await apiRequest('POST', '/api/home-page', mergedData);
    },
    onSuccess: () => {
      toast({
        title: t('সাফল্য!', 'Success!'),
        description: t('প্রতিষ্ঠার তারিখ সংরক্ষণ হয়েছে', 'Founded date saved'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/home-page'] });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: t('ত্রুটি', 'Error'),
        description: error.message,
      });
    },
  });

  const servicesMutation = useMutation({
    mutationFn: async (data: any) => {
      const current = queryClient.getQueryData(['/api/home-page']) as any;
      if (current?.id) {
        return await apiRequest('PATCH', `/api/home-page/${current.id}`, data);
      }
      // If no ID yet, merge with existing data for POST
      const mergedData = { ...current, ...data };
      return await apiRequest('POST', '/api/home-page', mergedData);
    },
    onSuccess: () => {
      toast({
        title: t('সাফল্য!', 'Success!'),
        description: t('সেবা সেকশন সংরক্ষণ হয়েছে', 'Services section saved'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/home-page'] });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: t('ত্রুটি', 'Error'),
        description: error.message,
      });
    },
  });

  const eventsMutation = useMutation({
    mutationFn: async (data: any) => {
      const current = queryClient.getQueryData(['/api/home-page']) as any;
      if (current?.id) {
        return await apiRequest('PATCH', `/api/home-page/${current.id}`, data);
      }
      // If no ID yet, merge with existing data for POST
      const mergedData = { ...current, ...data };
      return await apiRequest('POST', '/api/home-page', mergedData);
    },
    onSuccess: () => {
      toast({
        title: t('সাফল্য!', 'Success!'),
        description: t('ইভেন্ট সেকশন সংরক্ষণ হয়েছে', 'Events section saved'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/home-page'] });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: t('ত্রুটি', 'Error'),
        description: error.message,
      });
    },
  });

  return (
    <div className="p-6 space-y-6 max-h-[90vh] overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-admin-home-title">
          {t('হোম পৃষ্ঠা পরিচালনা করুন', 'Manage Home Page')}
        </h1>
        <p className="text-muted-foreground">
          {t('হোম পেজের সমস্ত কন্টেন্ট সম্পাদনা করুন', 'Edit all content on the home page')}
        </p>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t('হিরো সেকশন', 'Hero Section')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={heroForm.handleSubmit((data) => heroMutation.mutate(data))} className="space-y-4">
            <ImageUploadSection
              label={['হিরো ছবি', 'Hero Image']}
              preview={heroImagePreview}
              setPreview={setHeroImagePreview}
              fieldName="heroImage"
              inputRef={heroImageInputRef}
              form={heroForm}
            />
            <div>
              <Label className="text-sm font-semibold">{t('শিরোনাম (বাংলা)', 'Title (Bengali)')}</Label>
              <Textarea
                className="h-16 resize-none text-sm"
                placeholder="হিরো শিরোনাম"
                {...heroForm.register('heroTitle')}
                data-testid="textarea-hero-title-bn"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">{t('শিরোনাম (ইংরেজি)', 'Title (English)')}</Label>
              <Textarea
                className="h-16 resize-none text-sm"
                placeholder="Hero title"
                {...heroForm.register('heroTitleEn')}
                data-testid="textarea-hero-title-en"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">{t('বর্ণনা (বাংলা)', 'Description (Bengali)')}</Label>
              <Textarea
                className="h-16 resize-none text-sm"
                placeholder="বর্ণনা"
                {...heroForm.register('heroDescription')}
                data-testid="textarea-hero-desc-bn"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">{t('বর্ণনা (ইংরেজি)', 'Description (English)')}</Label>
              <Textarea
                className="h-16 resize-none text-sm"
                placeholder="Description"
                {...heroForm.register('heroDescriptionEn')}
                data-testid="textarea-hero-desc-en"
              />
            </div>
            <Button type="submit" disabled={heroMutation.isPending} className="w-full" data-testid="button-save-hero">
              {heroMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('সংরক্ষণ করুন', 'Save')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Services Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t('সেবা সেকশন', 'Services Section')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={servicesForm.handleSubmit((data) => servicesMutation.mutate(data))} className="space-y-4">
            <ImageUploadSection
              label={['সেবা ছবি', 'Services Image']}
              preview={servicesImagePreview}
              setPreview={setServicesImagePreview}
              fieldName="servicesImage"
              inputRef={servicesImageInputRef}
              form={servicesForm}
            />
            <div>
              <Label className="text-sm font-semibold">{t('শিরোনাম (বাংলা)', 'Title (Bengali)')}</Label>
              <Textarea
                className="h-12 resize-none text-sm"
                {...servicesForm.register('servicesTitle')}
                data-testid="textarea-services-title-bn"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">{t('শিরোনাম (ইংরেজি)', 'Title (English)')}</Label>
              <Textarea
                className="h-12 resize-none text-sm"
                {...servicesForm.register('servicesTitleEn')}
                data-testid="textarea-services-title-en"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">{t('বর্ণনা (বাংলা)', 'Description (Bengali)')}</Label>
              <Textarea
                className="h-16 resize-none text-sm"
                {...servicesForm.register('servicesDescription')}
                data-testid="textarea-services-desc-bn"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">{t('বর্ণনা (ইংরেজি)', 'Description (English)')}</Label>
              <Textarea
                className="h-16 resize-none text-sm"
                {...servicesForm.register('servicesDescriptionEn')}
                data-testid="textarea-services-desc-en"
              />
            </div>
            <Button type="submit" disabled={servicesMutation.isPending} className="w-full" data-testid="button-save-services">
              {servicesMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('সংরক্ষণ করুন', 'Save')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Events Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t('ইভেন্ট সেকশন', 'Events Section')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={eventsForm.handleSubmit((data) => eventsMutation.mutate(data))} className="space-y-4">
            <ImageUploadSection
              label={['ইভেন্ট ছবি', 'Events Image']}
              preview={eventsImagePreview}
              setPreview={setEventsImagePreview}
              fieldName="eventsImage"
              inputRef={eventsImageInputRef}
              form={eventsForm}
            />
            <div>
              <Label className="text-sm font-semibold">{t('শিরোনাম (বাংলা)', 'Title (Bengali)')}</Label>
              <Textarea
                className="h-12 resize-none text-sm"
                {...eventsForm.register('eventsTitle')}
                data-testid="textarea-events-title-bn"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">{t('শিরোনাম (ইংরেজি)', 'Title (English)')}</Label>
              <Textarea
                className="h-12 resize-none text-sm"
                {...eventsForm.register('eventsTitleEn')}
                data-testid="textarea-events-title-en"
              />
            </div>
            <Button type="submit" disabled={eventsMutation.isPending} className="w-full" data-testid="button-save-events">
              {eventsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('সংরক্ষণ করুন', 'Save')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
