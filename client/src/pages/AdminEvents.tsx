import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit2, Upload, X } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Event } from '@shared/schema';
import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertEventSchema } from '@shared/schema';

export default function AdminEvents() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { data: eventsResponse = [], isLoading } = useQuery<any>({
    queryKey: ['/api/events'],
  });

  const events = Array.isArray(eventsResponse) ? eventsResponse : (eventsResponse?.data ? Array.from(eventsResponse.data) : []);

  const form = useForm({
    resolver: zodResolver(insertEventSchema),
    defaultValues: editingEvent ? {
      ...editingEvent,
      date: new Date(editingEvent.date).toISOString().split('T')[0],
    } : {
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      locationEn: '',
      image: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      // Convert date string to timestamp
      if (typeof data.date === 'string') {
        data.date = new Date(data.date).toISOString();
      }
      const response = await apiRequest('POST', '/api/events', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: t('সফল!', 'Success!'),
        description: t('ইভেন্ট যোগ করা হয়েছে', 'Event added'),
      });
      setOpenDialog(false);
      form.reset();
      setEditingEvent(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      // Convert date string to timestamp
      if (typeof data.date === 'string') {
        data.date = new Date(data.date).toISOString();
      }
      const response = await apiRequest('PATCH', `/api/events/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: t('সফল!', 'Success!'),
        description: t('ইভেন্ট আপডেট করা হয়েছে', 'Event updated'),
      });
      setOpenDialog(false);
      form.reset();
      setEditingEvent(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/events/${id}`, {});
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: t('সফল!', 'Success!'),
        description: t('ইভেন্ট মুছে ফেলা হয়েছে', 'Event deleted'),
      });
    },
  });

  const handleSubmit = (data: any) => {
    const submitData = {
      ...data,
      additionalImages: typeof data.additionalImages === 'string' ? data.additionalImages : JSON.stringify(additionalImages),
    };
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setImagePreview(event.image);
    try {
      const addImages = event.additionalImages ? JSON.parse(event.additionalImages) : [];
      setAdditionalImages(addImages);
    } catch {
      setAdditionalImages([]);
    }
    form.reset({
      ...event,
      date: new Date(event.date).toISOString().split('T')[0],
    });
    setOpenDialog(true);
  };

  const handleAddNew = () => {
    setEditingEvent(null);
    setImagePreview(null);
    setAdditionalImages([]);
    const now = new Date();
    form.reset({
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      date: now.toISOString().split('T')[0] as any,
      location: '',
      locationEn: '',
      image: '',
      additionalImages: '[]',
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

  const handleAdditionalImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const newImages = [...additionalImages];
        newImages[index] = result;
        setAdditionalImages(newImages);
        form.setValue('additionalImages', JSON.stringify(newImages));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAdditionalImage = (index: number) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
    form.setValue('additionalImages', JSON.stringify(newImages));
  };

  if (isLoading) return <div className="text-center p-8">{t('লোড হচ্ছে...', 'Loading...')}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('ইভেন্ট পরিচালনা', 'Manage Events')}</h1>
          <p className="text-muted-foreground mt-2">{t('সমস্ত ইভেন্ট পরিচালনা করুন', 'Manage all events')}</p>
        </div>
        <Button onClick={handleAddNew} data-testid="button-add-event">
          <Plus className="h-4 w-4 mr-2" />
          {t('নতুন ইভেন্ট', 'Add Event')}
        </Button>
      </div>

      <div className="space-y-4">
        {events.map((event: Event) => (
          <Card key={event.id} className="hover-elevate" data-testid={`card-event-${event.id}`}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <p className="font-semibold" data-testid={`text-event-title-${event.id}`}>
                    {language === 'bn' ? event.title : event.titleEn}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid={`text-event-date-${event.id}`}>
                    {new Date(event.date).toLocaleDateString('bn-BD')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('অবস্থান', 'Location')}</p>
                  <p className="text-sm" data-testid={`text-event-location-${event.id}`}>
                    {language === 'bn' ? event.location : event.locationEn}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('বর্ণনা', 'Description')}</p>
                  <p className="text-sm line-clamp-2" data-testid={`text-event-description-${event.id}`}>
                    {language === 'bn' ? event.description : event.descriptionEn}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(event)}
                    disabled={updateMutation.isPending}
                    data-testid={`button-edit-event-${event.id}`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(event.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-event-${event.id}`}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto" data-testid="dialog-event-form">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? t('ইভেন্ট সম্পাদনা করুন', 'Edit Event') : t('নতুন ইভেন্ট যোগ করুন', 'Add New Event')}
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
                      <Input {...field} placeholder="শিরোনাম" className="h-8 text-sm" data-testid="input-event-title" />
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
                      <Input {...field} placeholder="Title" className="h-8 text-sm" data-testid="input-event-title-en" />
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
                    <Textarea {...field} placeholder="বর্ণনা" className="text-sm resize-none h-16" data-testid="textarea-event-description" />
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
                    <Textarea {...field} placeholder="Description" className="text-sm resize-none h-16" data-testid="textarea-event-description-en" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">{t('তারিখ', 'Date')}</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="date" 
                      className="h-8 text-sm"
                      value={typeof field.value === 'string' ? field.value : field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                      data-testid="input-event-date" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">{t('অবস্থান (বাংলা)', 'Location (Bengali)')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="অবস্থান" className="h-8 text-sm" data-testid="input-event-location" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">{t('অবস্থান (ইংরেজি)', 'Location (English)')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Location" className="h-8 text-sm" data-testid="input-event-location-en" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">{t('প্রধান ছবি', 'Main Image')}</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        className="hidden"
                        data-testid="input-event-image-file"
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
                            data-testid="img-event-preview"
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
            <div className="space-y-2">
              <FormLabel className="text-xs">{t('অতিরিক্ত ছবি (সর্বোচ্চ ৩টি)', 'Additional Images (Max 3)')}</FormLabel>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAdditionalImageChange(e, index)}
                      ref={(el) => { additionalImagesRefs.current[index] = el; }}
                      className="hidden"
                      data-testid={`input-event-additional-image-${index}`}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="w-full h-16 text-xs p-1"
                      onClick={() => additionalImagesRefs.current[index]?.click()}
                      data-testid={`button-upload-additional-image-${index}`}
                    >
                      {additionalImages[index] ? (
                        <img 
                          src={additionalImages[index]} 
                          alt={`Additional ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-0.5">
                          <Upload className="h-3 w-3" />
                          <span>{t('ছবি', 'Image')} {index + 1}</span>
                        </div>
                      )}
                    </Button>
                    {additionalImages[index] && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="w-full h-6 text-xs"
                        onClick={() => removeAdditionalImage(index)}
                        data-testid={`button-remove-additional-image-${index}`}
                      >
                        <X className="h-3 w-3 mr-1" />
                        {t('সরান', 'Remove')}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full h-8 text-sm" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-submit-event">
              {editingEvent ? t('আপডেট করুন', 'Update') : t('যোগ করুন', 'Add')}
            </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
