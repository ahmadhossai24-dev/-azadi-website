import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe, Home, Users, Crown, Briefcase, Calendar, Mail, Heart, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/lib/language';
import { ThemeToggle } from '@/components/ThemeToggle';
import logoImage from '@assets/logo_1764081884326.jpg';

export default function PublicNav() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { path: '/', label: t('হোম', 'Home'), icon: Home },
    { path: '/about', label: t('সম্পর্কে', 'About'), icon: Users },
    { path: '/leadership', label: t('নেতৃত্ব', 'Leadership'), icon: Crown },
    { path: '/services', label: t('সেবা', 'Services'), icon: Briefcase },
    { path: '/events', label: t('ইভেন্ট', 'Events'), icon: Calendar },
    { path: '/contact', label: t('যোগাযোগ', 'Contact'), icon: Mail },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-md px-2 py-1 -ml-2 flex-shrink-0" data-testid="link-home">
            <img src={logoImage} alt="Azadi Logo" className="h-11 w-11 rounded-full object-cover shadow-sm" />
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-primary">
                {language === 'bn' ? 'আজাদী সমাজ কল্যাণ সংঘ' : 'Azadi Social Welfare Organization'}
              </span>
              <span className="text-xs text-muted-foreground">{t('প্রতিষ্ঠিত ১০ জুন ১৯৮৮', 'Founded 10 June 1988')}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} data-testid={`link-${link.path.slice(1) || 'home'}`}>
                <Button
                  variant={location === link.path ? 'default' : 'ghost'}
                  size="sm"
                  className="h-9 px-3 gap-1.5 text-xs font-medium flex items-center"
                >
                  <link.icon className="h-4 w-4 flex-shrink-0" />
                  <span>{link.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              data-testid="button-language-toggle"
              className="h-9 w-9"
            >
              <Globe className="h-4 w-4" />
            </Button>
            <Link href="/donate" className="hidden sm:inline">
              <Button 
                variant="default" 
                size="sm" 
                data-testid="button-donate"
                className="h-9 px-3 gap-1.5 text-xs flex items-center"
              >
                <Heart className="h-4 w-4 flex-shrink-0" />
                <span>{t('দান করুন', 'Donate')}</span>
              </Button>
            </Link>
            <Link href="/admin" className="hidden sm:inline">
              <Button 
                variant="outline" 
                size="sm" 
                data-testid="button-admin"
                className="h-9 px-3 gap-1.5 text-xs flex items-center"
              >
                <LogIn className="h-4 w-4 flex-shrink-0" />
                <span>{t('এডমিন', 'Admin')}</span>
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden h-9 w-9"
              data-testid="button-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <Button
                  variant={location === link.path ? 'default' : 'ghost'}
                  className="w-full justify-start h-9 text-xs gap-2"
                  size="sm"
                  data-testid={`link-mobile-${link.path.slice(1) || 'home'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <link.icon className="h-4 w-4 flex-shrink-0" />
                  {link.label}
                </Button>
              </Link>
            ))}
            <Link href="/donate" className="block">
              <Button 
                variant="default" 
                className="w-full justify-start h-9 text-xs gap-2 mt-2" 
                size="sm" 
                data-testid="button-donate-mobile"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="h-4 w-4 flex-shrink-0" />
                {t('দান করুন', 'Donate Now')}
              </Button>
            </Link>
            <Link href="/admin" className="block">
              <Button 
                variant="outline" 
                className="w-full justify-start h-9 text-xs gap-2" 
                size="sm" 
                data-testid="button-admin-mobile"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn className="h-4 w-4 flex-shrink-0" />
                {t('এডমিন লগইন', 'Admin Login')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
