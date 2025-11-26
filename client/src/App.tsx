import { Switch, Route, useLocation } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LanguageProvider, useLanguage } from '@/lib/language';
import { ThemeProvider } from '@/lib/theme';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import AdminNav from '@/components/AdminNav';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Leadership from '@/pages/Leadership';
import Services from '@/pages/Services';
import Events from '@/pages/Events';
import Donate from '@/pages/Donate';
import Contact from '@/pages/Contact';
import AdminLogin from '@/pages/AdminLogin';
import AdminDonations from '@/pages/AdminDonations';
import AdminEvents from '@/pages/AdminEvents';
import AdminServices from '@/pages/AdminServices';
import AdminMessages from '@/pages/AdminMessages';
import AdminLeadership from '@/pages/AdminLeadership';
import AdminGallery from '@/pages/AdminGallery';
import AdminPaymentMethods from '@/pages/AdminPaymentMethods';
import AdminAbout from '@/pages/AdminAbout';
import AdminHome from '@/pages/AdminHome';
import AdminContact from '@/pages/AdminContact';
import AdminSocialMedia from '@/pages/AdminSocialMedia';
import AdminVolunteers from '@/pages/AdminVolunteers';
import AdminSettings from '@/pages/AdminSettings';
import Gallery from '@/pages/Gallery';
import PaymentMethods from '@/pages/PaymentMethods';
import MemberLogin from '@/pages/MemberLogin';
import MemberRegister from '@/pages/MemberRegister';
import NotFound from '@/pages/not-found';
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Link } from 'wouter';
import { LogOut, BarChart3, Calendar, Mail, Briefcase, Image as ImageIcon, DollarSign } from 'lucide-react';

function PublicRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/leadership" component={Leadership} />
      <Route path="/services" component={Services} />
      <Route path="/events" component={Events} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/payment-methods" component={PaymentMethods} />
      <Route path="/donate" component={Donate} />
      <Route path="/contact" component={Contact} />
      <Route path="/member/login" component={MemberLogin} />
      <Route path="/member/register" component={MemberRegister} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AdminRouter() {
  const [location] = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('adminSecret'));
  const { t } = useLanguage();
  const [adminLocation] = useLocation();

  useEffect(() => {
    if (!isLoggedIn && !location.includes('login')) {
      window.location.href = '/admin/login';
    }
  }, [isLoggedIn, location]);

  const handleLogout = () => {
    localStorage.removeItem('adminSecret');
    setIsLoggedIn(false);
    window.location.href = '/admin/login';
  };

  if (!isLoggedIn) {
    return <AdminLogin />;
  }
  
  const adminMenuItems = [
    { path: '/admin/home', label: t('হোম পৃষ্ঠা', 'Home Page'), icon: BarChart3 },
    { path: '/admin/about', label: t('আমাদের সম্পর্কে', 'About Page'), icon: BarChart3 },
    { path: '/admin/contact', label: t('যোগাযোগ', 'Contact'), icon: Mail },
    { path: '/admin/social-media', label: t('সামাজিক মাধ্যম', 'Social Media'), icon: Mail },
    { path: '/admin/donations', label: t('দান পরিচালনা', 'Manage Donations'), icon: BarChart3 },
    { path: '/admin/events', label: t('ইভেন্ট পরিচালনা', 'Manage Events'), icon: Calendar },
    { path: '/admin/services', label: t('সেবা পরিচালনা', 'Manage Services'), icon: Briefcase },
    { path: '/admin/gallery', label: t('গ্যালারি পরিচালনা', 'Manage Gallery'), icon: ImageIcon },
    { path: '/admin/payment-methods', label: t('পেমেন্ট পদ্ধতি', 'Payment Methods'), icon: DollarSign },
    { path: '/admin/leadership', label: t('নেতৃত্ব পরিচালনা', 'Manage Leadership'), icon: Mail },
    { path: '/admin/volunteers', label: t('স্বেচ্ছাসেবক', 'Volunteers'), icon: Mail },
    { path: '/admin/messages', label: t('বার্তা', 'Messages'), icon: Mail },
    { path: '/admin/settings', label: t('সেটিংস', 'Settings'), icon: Mail },
  ];

  const sidebarStyle = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <div className="px-4 py-4 border-b mb-4">
                <h2 className="text-lg font-bold text-primary">{t('অ্যাডমিন প্যানেল', 'Admin Panel')}</h2>
                <p className="text-xs text-muted-foreground">{t('আজাদী সমাজ কল্যাণ সংঘ', 'Azadi Organization')}</p>
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminMenuItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild isActive={adminLocation === item.path}>
                        <Link href={item.path} data-testid={`link-admin-${item.path.split('/').pop()}`}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="border-t p-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('লগআউট', 'Logout')}
            </Button>
          </div>
        </Sidebar>
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between px-6 py-4">
              <h1 className="text-2xl font-bold text-primary">{t('ড্যাশবোর্ড', 'Dashboard')}</h1>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" data-testid="button-theme-toggle">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              <Switch>
                <Route path="/admin" component={AdminHome} />
                <Route path="/admin/home" component={AdminHome} />
                <Route path="/admin/about" component={AdminAbout} />
                <Route path="/admin/contact" component={AdminContact} />
                <Route path="/admin/social-media" component={AdminSocialMedia} />
                <Route path="/admin/donations" component={AdminDonations} />
                <Route path="/admin/events" component={AdminEvents} />
                <Route path="/admin/services" component={AdminServices} />
                <Route path="/admin/gallery" component={AdminGallery} />
                <Route path="/admin/payment-methods" component={AdminPaymentMethods} />
                <Route path="/admin/leadership" component={AdminLeadership} />
                <Route path="/admin/volunteers" component={AdminVolunteers} />
                <Route path="/admin/messages" component={AdminMessages} />
                <Route path="/admin/settings" component={AdminSettings} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');
  const isAdminLogin = location === '/admin/login';

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      {isAdminLogin ? (
        <AdminLogin />
      ) : isAdminRoute ? (
        <AdminRouter />
      ) : (
        <div className="min-h-screen flex flex-col bg-modern-gradient">
          <PublicNav />
          <main className="flex-1">
            <PublicRouter />
          </main>
          <PublicFooter />
        </div>
      )}
      <Toaster />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
