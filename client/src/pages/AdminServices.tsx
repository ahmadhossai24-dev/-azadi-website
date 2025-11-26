import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit2, Upload } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Service } from '@shared/schema';
import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertServiceSchema } from '@shared/schema';

const iconOptions = [
  'Book', 'Heart', 'Trophy', 'Users', 'Leaf', 'Lightbulb',
];

export default function AdminServices() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: servicesResponse = [], isLoading } = useQuery<any>({
    queryKey: ['/api/services'],
  });

  const services = Array.isArray(servicesResponse) ? servicesResponse : (servicesResponse?.data ? Array.from(servicesResponse.data) : []);

  const form = useForm({
    resolver: zodResolver(insertServiceSchema),
    defaultValues: editingService || {
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      image: '',
      icon: 'Book',
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/services', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: t('সফল!', 'Success!'),
        description: t('সেবা যোগ করা হয়েছে', 'Service added'),
      });
      setOpenDialog(false);
      form.reset();
      setEditingService(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiRequest('PATCH', `/api/services/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: t('সফল!', 'Success!'),
        description: t('সেবা আপডেট করা হয়েছে', 'Service updated'),
      });
      setOpenDialog(false);
      form.reset();
      setEditingService(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/services/${id}`, {});
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: t('সফল!', 'Success!'),
        description: t('সেবা মুছে ফেলা হয়েছে', 'Service deleted'),
      });
    },
  });

  const handleSubmit = (data: any) => {
    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleAddNew = () => {
    setEditingService(null);
    setImagePreview(null);
    form.reset({
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      image: '',
      icon: 'Book',
    });
    setOpenDialog(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setImagePreview(service.image);
    form.reset(service);
    setOpenDialog(true);
  };

  if (isLoading) return <div className="text-center p-8">{t('লোড হচ্ছে...', 'Loading...')}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('সেবা পরিচালনা', 'Manage Services')}</h1>
          <p className="text-muted-foreground mt-2">{t('সমস্ত সেবা পরিচালনা করুন', 'Manage all services')}</p>
        </div>
        <Button onClick={handleAddNew} data-testid="button-add-service">
          <Plus className="h-4 w-4 mr-2" />
          {t('নতুন সেবা', 'Add Service')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service: Service) => (
          <Card key={service.id} className="hover-elevate" data-testid={`card-service-${service.id}`}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-lg" data-testid={`text-service-title-${service.id}`}>
                    {language === 'bn' ? service.title : service.titleEn}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-service-description-${service.id}`}>
                    {language === 'bn' ? service.description : service.descriptionEn}
                  </p>
                </div>
                {service.image && (
                  <img 
                    src={service.image} 
                    alt={language === 'bn' ? service.title : service.titleEn}
                    className="w-full h-32 object-cover rounded-md"
                    data-testid={`img-service-${service.id}`}
                  />
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(service)}
                    disabled={updateMutation.isPending}
                    data-testid={`button-edit-service-${service.id}`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(service.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-service-${service.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto" data-testid="dialog-service-form">
          <DialogHeader>
            <DialogTitle>
              {editingService ? t('সেবা সম্পাদনা করুন', 'Edit Service') : t('নতুন সেবা যোগ করুন', 'Add New Service')}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">{t('শিরোনাম (বাংলা)', 'Title (Bengali)')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="শিরোনাম" className="h-8 text-sm" data-testid="input-service-title" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="titleEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">{t('শিরোনাম (ইংরেজি)', 'Title (English)')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Title" className="h-8 text-sm" data-testid="input-service-title-en" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">{t('বর্ণনা (বাংলা)', 'Description (Bengali)')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="বর্ণনা" className="text-sm resize-none h-16" data-testid="textarea-service-description" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descriptionEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">{t('বর্ণনা (ইংরেজি)', 'Description (English)')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Description" className="text-sm resize-none h-16" data-testid="textarea-service-description-en" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">{t('ছবি আপলোড করুন', 'Upload Image')}</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        className="hidden"
                        data-testid="input-service-image-file"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-8 text-sm"
                        onClick={() => fileInputRef.current?.click()}
                        data-testid="button-upload-image"
                      >
                        <Upload className="h-3 w-3 mr-2" />
                        {t('ছবি নির্বাচন করুন', 'Select Image')}
                      </Button>
                      {imagePreview && (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-24 object-cover rounded-md"
                            data-testid="img-service-preview"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => {
                              setImagePreview(null);
                              form.setValue('image', '');
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            data-testid="button-remove-image"
                          >
                            ✕
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">{t('আইকন', 'Icon')}</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full px-2 py-1 text-sm border rounded-md h-8" data-testid="select-service-icon">
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-8 text-sm" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-submit-service">
              {editingService ? t('আপডেট করুন', 'Update') : t('যোগ করুন', 'Add')}
            </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
