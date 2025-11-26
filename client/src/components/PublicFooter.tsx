import { Link } from 'wouter';
import { useLanguage } from '@/lib/language';
import { Facebook, Mail, Phone, MapPin, Linkedin, Instagram, Play, Home, Users, Heart, Image, Calendar, DollarSign, LogIn } from 'lucide-react';
import logoImage from '@assets/logo_1764081884326.jpg';
import calligraphy1 from '@assets/calligraphy-1_1764081884316.png';

export default function PublicFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logoImage} alt="Azadi Logo" className="h-12 w-12 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold text-lg text-primary">আজাদী সমাজ কল্যাণ সংঘ</h3>
                <p className="text-sm text-muted-foreground">{t('সেবায় সর্বদা', 'Always in Service')}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t(
                'আমরা একটি সমাজসেবামূলক সংগঠন যা শিক্ষা, শান্তি এবং ক্রীড়া কার্যক্রমের মাধ্যমে সমাজের উন্নয়নে কাজ করছি।',
                'We are a social welfare organization working for the development of society through education, peace, and sports programs.'
              )}
            </p>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <h4 className="font-semibold mb-4">{t('দ্রুত লিঙ্ক', 'Quick Links')}</h4>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/" className="flex items-center gap-2 p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md hover-elevate transition-colors" data-testid="link-footer-home">
                <Home className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs font-medium">{t('হোম', 'Home')}</span>
              </Link>
              <Link href="/leadership" className="flex items-center gap-2 p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md hover-elevate transition-colors" data-testid="link-footer-leadership">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs font-medium">{t('নেতৃবৃন্দ', 'Leadership')}</span>
              </Link>
              <Link href="/services" className="flex items-center gap-2 p-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-md hover-elevate transition-colors" data-testid="link-footer-services">
                <Heart className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs font-medium">{t('সেবা', 'Services')}</span>
              </Link>
              <Link href="/gallery" className="flex items-center gap-2 p-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-md hover-elevate transition-colors" data-testid="link-footer-gallery">
                <Image className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs font-medium">{t('গ্যালারি', 'Gallery')}</span>
              </Link>
              <Link href="/events" className="flex items-center gap-2 p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-md hover-elevate transition-colors" data-testid="link-footer-events">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs font-medium">{t('ইভেন্ট', 'Events')}</span>
              </Link>
              <Link href="/payment-methods" className="flex items-center gap-2 p-2 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 rounded-md hover-elevate transition-colors" data-testid="link-footer-payment-methods">
                <DollarSign className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs font-medium">{t('পেমেন্ট', 'Payment')}</span>
              </Link>
              <Link href="/member/login" className="col-span-2 flex items-center gap-2 p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-md hover-elevate transition-colors" data-testid="link-footer-member">
                <LogIn className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs font-medium">{t('সদস্য লগইন', 'Member Login')}</span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('যোগাযোগ', 'Contact')}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover-elevate active-elevate-2 rounded-md px-2 py-1 -ml-2 w-fit cursor-pointer transition-colors" data-testid="link-contact-address">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{t('১নং রাস্তা মিরবক্সটুলা সিলেট', '1 No. Road Mirbokstula Sylhet')}</span>
              </div>
              <a 
                href="tel:+8801711975488"
                className="flex items-center gap-2 text-sm text-muted-foreground hover-elevate active-elevate-2 rounded-md px-2 py-1 -ml-2 w-fit transition-colors"
                data-testid="link-contact-phone"
              >
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>+8801711975488</span>
              </a>
              <a 
                href="mailto:azadisocialwelfareorganization@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover-elevate active-elevate-2 rounded-md px-2 py-1 -ml-2 w-fit transition-colors"
                data-testid="link-contact-email"
              >
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span>azadisocialwelfareorganization@gmail.com</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('নেটওয়ার্ক', 'Network')}</h4>
            <div className="flex flex-wrap gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 rounded-md hover-elevate active-elevate-2 transition-colors" data-testid="button-social-facebook" title="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-600 dark:text-sky-400 rounded-md hover-elevate active-elevate-2 transition-colors" data-testid="button-social-twitter" title="Twitter">
                <Mail className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-600 dark:text-pink-400 rounded-md hover-elevate active-elevate-2 transition-colors" data-testid="button-social-instagram" title="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 rounded-md hover-elevate active-elevate-2 transition-colors" data-testid="button-social-youtube" title="YouTube">
                <Play className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-blue-700/20 hover:bg-blue-700/30 text-blue-700 dark:text-blue-300 rounded-md hover-elevate active-elevate-2 transition-colors" data-testid="button-social-linkedin" title="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-6">
              <img src={calligraphy1} alt="Islamic Calligraphy" className="w-full max-w-xs rounded-md" />
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Azadi Social Welfare Organization – All rights reserved.
            </p>
            <div className="hidden md:flex flex-1"></div>
            <p className="text-sm text-muted-foreground">
              {t('পরিকল্পনা ও বাস্তবায়নে: ', 'Planning & Implementation: ')}<span className="font-bold text-foreground">{t('আহমদ হোসেন পাভেল', 'Ahmed Hossain Pavel')}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
