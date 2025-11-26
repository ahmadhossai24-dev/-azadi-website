import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/lib/language';

interface AdminNavProps {
  onLogout: () => void;
}

export default function AdminNav({ onLogout }: AdminNavProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { path: '/admin/donations', label: t('দান পরিচালনা', 'Manage Donations') },
    { path: '/admin/events', label: t('ইভেন্ট পরিচালনা', 'Manage Events') },
    { path: '/admin/messages', label: t('বার্তা', 'Messages') },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/admin" className="flex items-center gap-2 font-semibold" data-testid="link-admin-home">
            {t('অ্যাডমিন প্যানেল', 'Admin Panel')}
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex gap-2">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  <Button
                    variant={location === link.path ? 'secondary' : 'ghost'}
                    size="sm"
                    className="text-primary-foreground hover:bg-primary-foreground/20"
                    data-testid={`link-admin-${link.path.split('/').pop()}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="text-primary-foreground hover:bg-primary-foreground/20"
              data-testid="button-logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
              data-testid="button-menu-toggle-admin"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/10">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <Button
                  variant={location === link.path ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid={`button-mobile-admin-${link.path.split('/').pop()}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start text-primary-foreground hover:bg-primary-foreground/20"
              onClick={onLogout}
              data-testid="button-mobile-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('লগআউট', 'Logout')}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
