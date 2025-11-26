import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/lib/language';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Plus, Trash2, Edit } from 'lucide-react';
import type { PaymentMethod } from '@shared/schema';

export default function AdminPaymentMethods() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    phone: '',
    description: '',
    descriptionEn: '',
    order: 0,
    active: true,
  });

  const { data: methods = [] } = useQuery({
    queryKey: ['/api/payment-methods/admin/all'],
    queryFn: async () => {
      const res = await fetch('/api/payment-methods/admin/all');
      if (!res.ok) throw new Error('Failed to fetch payment methods');
      const data = await res.json();
      return data.data as PaymentMethod[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/payment-methods', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payment-methods/admin/all'] });
      queryClient.invalidateQueries({ queryKey: ['/api/payment-methods'] });
      setFormData({ name: '', nameEn: '', phone: '', description: '', descriptionEn: '', order: 0, active: true });
      setShowForm(false);
      toast({ title: t('সফল!', 'Success!'), description: t('পেমেন্ট পদ্ধতি যোগ করা হয়েছে', 'Payment method added') });
    },
    onError: (error: any) => {
      toast({ title: t('ত্রুটি', 'Error'), description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('PATCH', `/api/payment-methods/${editingId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payment-methods/admin/all'] });
      queryClient.invalidateQueries({ queryKey: ['/api/payment-methods'] });
      setFormData({ name: '', nameEn: '', phone: '', description: '', descriptionEn: '', order: 0, active: true });
      setEditingId(null);
      setShowForm(false);
      toast({ title: t('সফল!', 'Success!'), description: t('পেমেন্ট পদ্ধতি আপডেট করা হয়েছে', 'Payment method updated') });
    },
    onError: (error: any) => {
      toast({ title: t('ত্রুটি', 'Error'), description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/payment-methods/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payment-methods/admin/all'] });
      queryClient.invalidateQueries({ queryKey: ['/api/payment-methods'] });
      toast({ title: t('সফল!', 'Success!'), description: t('পেমেন্ট পদ্ধতি মুছে ফেলা হয়েছে', 'Payment method deleted') });
    },
    onError: (error: any) => {
      toast({ title: t('ত্রুটি', 'Error'), description: error.message, variant: 'destructive' });
    },
  });

  const handleEdit = (method: PaymentMethod) => {
    setFormData({
      name: method.name,
      nameEn: method.nameEn,
      phone: method.phone,
      description: method.description || '',
      descriptionEn: method.descriptionEn || '',
      order: method.order,
      active: method.active,
    });
    setEditingId(method.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">{t('পেমেন্ট পদ্ধতি পরিচালনা', 'Manage Payment Methods')}</h1>
          <p className="text-muted-foreground mt-1">{t('সংস্থার জন্য পেমেন্ট পদ্ধতি যোগ এবং সম্পাদনা করুন', 'Add and edit payment methods for the organization')}</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); }} data-testid="button-add-payment">
          <Plus className="h-4 w-4 mr-2" />
          {t('নতুন পেমেন্ট পদ্ধতি', 'New Payment Method')}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? t('পেমেন্ট পদ্ধতি সম্পাদনা করুন', 'Edit Payment Method') : t('নতুন পেমেন্ট পদ্ধতি যোগ করুন', 'Add New Payment Method')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('নাম (বাংলা)', 'Name (Bengali)')}</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required data-testid="input-payment-name" />
                </div>
                <div>
                  <Label>{t('নাম (ইংরেজি)', 'Name (English)')}</Label>
                  <Input value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} required data-testid="input-payment-name-en" />
                </div>
              </div>

              <div>
                <Label>{t('ফোন নম্বর', 'Phone Number')}</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required data-testid="input-payment-phone" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('বর্ণনা (বাংলা)', 'Description (Bengali)')}</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} data-testid="input-payment-description" />
                </div>
                <div>
                  <Label>{t('বর্ণনা (ইংরেজি)', 'Description (English)')}</Label>
                  <Textarea value={formData.descriptionEn} onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })} data-testid="input-payment-description-en" />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-payment-submit">
                  {editingId ? t('আপডেট করুন', 'Update') : t('যোগ করুন', 'Add')}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }} data-testid="button-payment-cancel">
                  {t('বাতিল', 'Cancel')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((method) => (
          <Card key={method.id} data-testid={`card-admin-payment-${method.id}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex justify-between items-start">
                <div>
                  <p>{method.name}</p>
                  <p className="text-sm text-muted-foreground font-normal">{method.nameEn}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${method.active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}>
                  {method.active ? t('সক্রিয়', 'Active') : t('নিষ্ক্রিয়', 'Inactive')}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">{t('ফোন নম্বর', 'Phone')}</p>
                <p className="font-mono">{method.phone}</p>
              </div>
              {method.description && (
                <div>
                  <p className="text-sm text-muted-foreground">{t('বর্ণনা', 'Description')}</p>
                  <p className="text-sm">{method.description}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(method)} data-testid={`button-edit-payment-${method.id}`}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(method.id)} data-testid={`button-delete-payment-${method.id}`}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {methods.length === 0 && !showForm && (
        <Card className="text-center py-12">
          <p className="text-muted-foreground">{t('কোনো পেমেন্ট পদ্ধতি যোগ করা হয়নি', 'No payment methods added yet')}</p>
        </Card>
      )}
    </div>
  );
}
