import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/language';
import { Mail, Phone, User } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Message } from '@shared/schema';

export default function AdminMessages() {
  const { t } = useLanguage();
  const adminSecret = localStorage.getItem('adminSecret');

  const { data: messagesResponse = [], isLoading } = useQuery<any>({
    queryKey: ['/api/messages'],
  });

  const messages = Array.isArray(messagesResponse) ? messagesResponse : (messagesResponse?.data ? Array.from(messagesResponse.data) : []);

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('PATCH', `/api/messages/${id}`, { read: true });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
  });

  if (isLoading) return <div className="text-center p-8">{t('লোড হচ্ছে...', 'Loading...')}</div>;

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-messages-title">
          {t('বার্তা', 'Messages')}
        </h1>
        <p className="text-muted-foreground mt-2" data-testid="text-messages-description">
          {unreadCount > 0 && (
            <span className="flex items-center gap-2">
              <Badge variant="destructive" data-testid="badge-unread-count">{unreadCount} {t('নতুন', 'New')}</Badge>
            </span>
          )}
        </p>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={`hover-elevate cursor-pointer transition-all ${!message.read ? 'border-primary' : ''}`}
            onClick={() => !message.read && markReadMutation.mutate(message.id)}
            data-testid={`card-message-${message.id}`}
          >
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg" data-testid={`text-message-subject-${message.id}`}>
                      {message.subject}
                    </h3>
                    <p className="text-sm text-muted-foreground" data-testid={`text-message-date-${message.id}`}>
                      {new Date(message.createdAt).toLocaleString('bn-BD')}
                    </p>
                  </div>
                  {!message.read && (
                    <Badge className="bg-primary" data-testid={`badge-unread-${message.id}`}>
                      {t('নতুন', 'New')}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex items-start sm:items-center gap-2 text-xs sm:text-sm break-all">
                    <User className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 sm:mt-0" />
                    <span className="break-words" data-testid={`text-message-name-${message.id}`}>{message.name}</span>
                  </div>
                  <div className="flex items-start sm:items-center gap-2 text-xs sm:text-sm break-all">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 sm:mt-0" />
                    <span className="break-words" data-testid={`text-message-email-${message.id}`}>{message.email}</span>
                  </div>
                  <div className="flex items-start sm:items-center gap-2 text-xs sm:text-sm break-all">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 sm:mt-0" />
                    <span className="break-words" data-testid={`text-message-phone-${message.id}`}>{message.phone}</span>
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-md p-3 sm:p-4">
                  <p className="text-xs sm:text-sm break-words whitespace-pre-wrap leading-relaxed" data-testid={`text-message-body-${message.id}`}>
                    {message.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {messages.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              {t('কোন বার্তা নেই', 'No messages')}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
