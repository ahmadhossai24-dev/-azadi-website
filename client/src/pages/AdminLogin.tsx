import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/lib/language';
import { useToast } from '@/hooks/use-toast';
import { Lock, LogIn, Facebook, Instagram, Linkedin, Mail, Play } from 'lucide-react';
import PublicFooter from '@/components/PublicFooter';

export default function AdminLogin() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const ADMIN_USERNAME = 'azadi';
  const ADMIN_PASSWORD = 'Azadi passwor 123456';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (username.toLowerCase() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('adminSecret', password);
        toast({
          title: t('স্বাগতম!', 'Welcome!'),
          description: t('আপনি সফলভাবে এডমিন প্যানেলে লগইন করেছেন', 'You have successfully logged into the admin panel'),
        });
        window.location.href = '/admin';
      } else if (!username) {
        toast({
          title: t('ত্রুটি!', 'Error!'),
          description: t('ব্যবহারকারীর নাম প্রবেশ করুন', 'Please enter username'),
          variant: 'destructive',
        });
      } else if (!password) {
        toast({
          title: t('ত্রুটি!', 'Error!'),
          description: t('পাসওয়ার্ড প্রবেশ করুন', 'Please enter password'),
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('ত্রুটি!', 'Error!'),
          description: t('ভুল ব্যবহারকারীর নাম বা পাসওয়ার্ড', 'Incorrect username or password'),
          variant: 'destructive',
        });
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-modern-gradient">
      <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">{t('আজাদী', 'Azadi')}</h1>
          </div>
          <p className="text-muted-foreground">{t('অ্যাডমিন প্যানেল', 'Admin Panel')}</p>
        </div>

        <Card className="shadow-2xl border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              <div>
                <CardTitle className="text-2xl">{t('নিরাপদ প্রবেশ', 'Secure Login')}</CardTitle>
                <CardDescription className="text-primary-foreground/80">{t('শুধুমাত্র অনুমোদিত ব্যবহারকারীদের জন্য', 'Authorized users only')}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-8 space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  {t('ব্যবহারকারীর নাম', 'Username')}
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('ব্যবহারকারীর নাম প্রবেশ করুন', 'Enter username')}
                  required
                  disabled={loading}
                  data-testid="input-admin-username"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t('পাসওয়ার্ড', 'Password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('পাসওয়ার্ড প্রবেশ করুন', 'Enter password')}
                  required
                  disabled={loading}
                  data-testid="input-admin-password"
                  className="h-10"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 text-base font-semibold"
                disabled={loading}
                data-testid="button-admin-login"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                    {t('লগইন হচ্ছে...', 'Logging in...')}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-5 w-5" />
                    {t('লগইন করুন', 'Login')}
                  </div>
                )}
              </Button>
            </form>

            <div className="pt-4 border-t">
              <p className="text-xs text-center text-muted-foreground">
                {t('এটি একটি সুরক্ষিত এডমিন প্যানেল। শুধুমাত্র অনুমোদিত ব্যবহারকারীরা প্রবেশ করতে পারেন।', 'This is a secured admin panel. Only authorized users can access.')}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            {t('আজাদী সমাজ কল্যাণ সংঘ', 'Azadi Social Welfare Organization')} © 2024
          </p>
          
          <div className="flex justify-center gap-3 pt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 rounded-md hover-elevate active-elevate-2 transition-colors" data-testid="button-social-facebook-login" title="Facebook">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-600 dark:text-sky-400 rounded-md hover-elevate active-elevate-2 transition-colors" data-testid="button-social-twitter-login" title="Twitter">
              <Mail className="h-5 w-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-600 dark:text-pink-400 rounded-md hover-elevate active-elevate-2 transition-colors" data-testid="button-social-instagram-login" title="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 rounded-md hover-elevate active-elevate-2 transition-colors" data-testid="button-social-youtube-login" title="YouTube">
              <Play className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-blue-700/20 hover:bg-blue-700/30 text-blue-700 dark:text-blue-300 rounded-md hover-elevate active-elevate-2 transition-colors" data-testid="button-social-linkedin-login" title="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      </div>
      
      <PublicFooter />
    </div>
  );
}
