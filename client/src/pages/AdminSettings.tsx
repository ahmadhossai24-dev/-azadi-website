import { useState } from 'react';
import { useLanguage } from '@/lib/language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function AdminSettings() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/admin/change-password', data);
    },
    onSuccess: () => {
      toast({
        title: t('সাফল্য!', 'Success!'),
        description: t('পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে', 'Password changed successfully'),
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      localStorage.setItem('adminSecret', newPassword);
      setTimeout(() => {
        window.location.href = '/admin/home';
      }, 1000);
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: t('ত্রুটি', 'Error'),
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast({
        variant: 'destructive',
        title: t('ত্রুটি', 'Error'),
        description: t('বর্তমান পাসওয়ার্ড প্রবেশ করুন', 'Please enter current password'),
      });
      return;
    }

    if (!newPassword) {
      toast({
        variant: 'destructive',
        title: t('ত্রুটি', 'Error'),
        description: t('নতুন পাসওয়ার্ড প্রবেশ করুন', 'Please enter new password'),
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        variant: 'destructive',
        title: t('ত্রুটি', 'Error'),
        description: t('পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে', 'Password must be at least 8 characters'),
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: t('ত্রুটি', 'Error'),
        description: t('পাসওয়ার্ড মেলে না', 'Passwords do not match'),
      });
      return;
    }

    if (currentPassword === newPassword) {
      toast({
        variant: 'destructive',
        title: t('ত্রুটি', 'Error'),
        description: t('নতুন পাসওয়ার্ড পুরানো পাসওয়ার্ডের মতো হতে পারে না', 'New password must be different from current password'),
      });
      return;
    }

    passwordMutation.mutate({
      currentPassword,
      newPassword,
    });
  };

  return (
    <div className="p-6 space-y-6 max-h-[90vh] overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-admin-settings-title">
          {t('সেটিংস', 'Settings')}
        </h1>
        <p className="text-muted-foreground">
          {t('আপনার অ্যাডমিন অ্যাকাউন্ট সেটিংস পরিচালনা করুন', 'Manage your admin account settings')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('পাসওয়ার্ড পরিবর্তন', 'Change Password')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <Label className="text-sm font-semibold" htmlFor="current-pwd">
                {t('বর্তমান পাসওয়ার্ড', 'Current Password')}
              </Label>
              <div className="relative">
                <Input
                  id="current-pwd"
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pr-10"
                  data-testid="input-current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold" htmlFor="new-pwd">
                {t('নতুন পাসওয়ার্ড', 'New Password')}
              </Label>
              <div className="relative">
                <Input
                  id="new-pwd"
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                  data-testid="input-new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('কমপক্ষে ৮ অক্ষর', 'At least 8 characters')}
              </p>
            </div>

            <div>
              <Label className="text-sm font-semibold" htmlFor="confirm-pwd">
                {t('পাসওয়ার্ড নিশ্চিত করুন', 'Confirm Password')}
              </Label>
              <div className="relative">
                <Input
                  id="confirm-pwd"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  data-testid="input-confirm-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={passwordMutation.isPending}
              className="w-full"
              data-testid="button-change-password"
            >
              {passwordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('পাসওয়ার্ড পরিবর্তন করুন', 'Change Password')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
