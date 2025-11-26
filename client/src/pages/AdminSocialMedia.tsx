import { useLanguage } from '@/lib/language';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertSocialMediaSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { Loader2 } from 'lucide-react';

export default function AdminSocialMedia() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const { data: socialData = {} } = useQuery<any>({
    queryKey: ['/api/social-media'],
  });

  const form = useForm({
    resolver: zodResolver(insertSocialMediaSchema),
    defaultValues: {
      facebook: socialData?.facebook || '',
      instagram: socialData?.instagram || '',
      youtube: socialData?.youtube || '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (socialData?.id) {
        return await apiRequest('PATCH', `/api/social-media/${socialData.id}`, data);
      }
      return await apiRequest('POST', '/api/social-media', data);
    },
    onSuccess: () => {
      toast({
        title: t('সাফল্য!', 'Success!'),
        description: t('সামাজিক মাধ্যম সংরক্ষণ হয়েছে', 'Social media updated successfully'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/social-media'] });
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
        <h1 className="text-3xl font-bold mb-2" data-testid="text-admin-social-title">
          {t('সামাজিক মাধ্যম পরিচালনা করুন', 'Manage Social Media')}
        </h1>
        <p className="text-muted-foreground">
          {t('Facebook, Instagram এবং YouTube লিংক যোগ করুন', 'Add Facebook, Instagram and YouTube links')}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('সামাজিক মাধ্যম লিংক', 'Social Media Links')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Facebook</Label>
              <Input
                placeholder="https://facebook.com/yourpage"
                {...form.register('facebook')}
                data-testid="input-facebook"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">Instagram</Label>
              <Input
                placeholder="https://instagram.com/yourprofile"
                {...form.register('instagram')}
                data-testid="input-instagram"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">YouTube</Label>
              <Input
                placeholder="https://youtube.com/@yourchannelname"
                {...form.register('youtube')}
                data-testid="input-youtube"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={mutation.isPending} className="w-full" data-testid="button-save-social">
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('সংরক্ষণ করুন', 'Save Changes')}
        </Button>
      </form>
    </div>
  );
}
