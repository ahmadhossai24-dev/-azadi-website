import { useLanguage } from '@/lib/language';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Mail, Phone, User, Calendar } from 'lucide-react';

export default function AdminVolunteers() {
  const { t } = useLanguage();

  const { data: volunteersData = { data: [] } } = useQuery<any>({
    queryKey: ['/api/volunteers'],
  });

  const volunteers = volunteersData.data || [];

  return (
    <div className="p-6 space-y-6 max-h-[90vh] overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-admin-volunteers-title">
          {t('স্বেচ্ছাসেবক তালিকা', 'Volunteers List')}
        </h1>
        <p className="text-muted-foreground">
          {t(`মোট ${volunteers.length} জন স্বেচ্ছাসেবক রয়েছেন`, `Total ${volunteers.length} volunteers`)}
        </p>
      </div>

      <div className="space-y-4">
        {volunteers.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              {t('কোনো স্বেচ্ছাসেবক নেই', 'No volunteers yet')}
            </CardContent>
          </Card>
        ) : (
          volunteers.map((volunteer: any) => (
            <Card key={volunteer.id} data-testid={`card-volunteer-${volunteer.id}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold" data-testid={`text-volunteer-name-${volunteer.id}`}>
                        {volunteer.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span data-testid={`text-volunteer-email-${volunteer.id}`}>{volunteer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span data-testid={`text-volunteer-phone-${volunteer.id}`}>{volunteer.phone}</span>
                    </div>
                    {volunteer.message && (
                      <div className="text-sm text-muted-foreground bg-muted p-2 rounded" data-testid={`text-volunteer-message-${volunteer.id}`}>
                        {volunteer.message}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span data-testid={`text-volunteer-date-${volunteer.id}`}>
                        {new Date(volunteer.createdAt).toLocaleDateString('bn-BD')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
