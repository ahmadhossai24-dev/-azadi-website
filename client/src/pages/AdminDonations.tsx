import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/language';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Donation } from '@shared/schema';

export default function AdminDonations() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const adminSecret = localStorage.getItem('adminSecret');

  const { data: donationsResponse = [], isLoading } = useQuery<any>({
    queryKey: ['/api/donations'],
  });
  
  const donations = Array.isArray(donationsResponse) ? donationsResponse : (donationsResponse?.data ? Array.from(donationsResponse.data) : []);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest('PATCH', `/api/donations/${id}/status`, { status });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/donations'] });
      toast({
        title: t('সফল!', 'Success!'),
        description: t('দান স্থিতি আপডেট হয়েছে', 'Donation status updated'),
      });
    },
    onError: () => {
      toast({
        title: t('ত্রুটি!', 'Error!'),
        description: t('স্থিতি আপডেট করতে ব্যর্থ হয়েছে', 'Failed to update status'),
        variant: 'destructive',
      });
    },
  });

  const getStatusIcon = (status: string) => {
    if (status === 'approved') return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (status === 'rejected') return <XCircle className="h-4 w-4 text-red-600" />;
    return <Clock className="h-4 w-4 text-yellow-600" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'approved') return <Badge className="bg-green-600">{t('অনুমোদিত', 'Approved')}</Badge>;
    if (status === 'rejected') return <Badge className="bg-red-600">{t('প্রত্যাখ্যান', 'Rejected')}</Badge>;
    return <Badge className="bg-yellow-600">{t('অপেক্ষমান', 'Pending')}</Badge>;
  };

  if (isLoading) return <div className="text-center p-8">{t('লোড হচ্ছে...', 'Loading...')}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-donations-title">
          {t('দান পরিচালনা', 'Manage Donations')}
        </h1>
        <p className="text-muted-foreground mt-2" data-testid="text-donations-description">
          {t('সমস্ত দান পর্যালোচনা এবং অনুমোদন করুন', 'Review and approve all donations')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary" data-testid="stat-total-donations">
              {donations.length}
            </div>
            <p className="text-sm text-muted-foreground" data-testid="stat-total-label">
              {t('মোট দান', 'Total Donations')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600" data-testid="stat-approved">
              {donations.filter(d => d.status === 'approved').length}
            </div>
            <p className="text-sm text-muted-foreground" data-testid="stat-approved-label">
              {t('অনুমোদিত', 'Approved')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-yellow-600" data-testid="stat-pending">
              {donations.filter(d => d.status === 'pending').length}
            </div>
            <p className="text-sm text-muted-foreground" data-testid="stat-pending-label">
              {t('অপেক্ষমান', 'Pending')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold" data-testid="stat-total-amount">
              ৳{donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString('bn-BD')}
            </div>
            <p className="text-sm text-muted-foreground" data-testid="stat-total-amount-label">
              {t('মোট পরিমাণ', 'Total Amount')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {donations.map((donation) => (
          <Card key={donation.id} className="hover-elevate" data-testid={`card-donation-${donation.id}`}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div>
                  <p className="font-semibold" data-testid={`text-donor-name-${donation.id}`}>{donation.name}</p>
                  <p className="text-sm text-muted-foreground" data-testid={`text-donor-phone-${donation.id}`}>{donation.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('ইমেইল', 'Email')}</p>
                  <p className="text-sm" data-testid={`text-donor-email-${donation.id}`}>{donation.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('পরিমাণ', 'Amount')}</p>
                  <p className="font-semibold text-lg text-primary" data-testid={`text-donation-amount-${donation.id}`}>
                    ৳{donation.amount.toLocaleString('bn-BD')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('স্থিতি', 'Status')}</p>
                  <div className="flex items-center gap-2 mt-1" data-testid={`status-${donation.id}`}>
                    {getStatusIcon(donation.status)}
                    {getStatusBadge(donation.status)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => updateStatusMutation.mutate({ id: donation.id, status: 'approved' })}
                    disabled={donation.status === 'approved' || updateStatusMutation.isPending}
                    data-testid={`button-approve-${donation.id}`}
                  >
                    {t('অনুমোদন', 'Approve')}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => updateStatusMutation.mutate({ id: donation.id, status: 'rejected' })}
                    disabled={donation.status === 'rejected' || updateStatusMutation.isPending}
                    data-testid={`button-reject-${donation.id}`}
                  >
                    {t('প্রত্যাখ্যান', 'Reject')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
