import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit2, Play, Upload, X } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertGallerySchema } from '@shared/schema';
import type { Gallery } from '@shared/schema';

export default function AdminGallery() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Gallery | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { data: galleryResponse = [], isLoading } = useQuery<any>({
    queryKey: ['/api/gallery'],
  });

  const galleryItems = Array.isArray(galleryResponse) ? galleryResponse : (galleryResponse?.data ? Array.from(galleryResponse.data) : []);

  const form = useForm({
    resolver: zodResolver(insertGallerySchema),
    defaultValues: editingItem || {
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      image: '',
      type: 'photo',
      videoUrl: '',
      order: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/gallery', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({
        title: t('সফল!', 'Success!'),
        description: t('গ্যালারি আইটেম যোগ করা হয়েছে', 'Gallery item added'),
      });
      setOpenDialog(false);
      form.reset();
      setEditingItem(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest('PATCH', `/api/gallery/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({
        title: t('সফল!', 'Success!'),
        description: t('গ্যালারি আইটেম আপডেট করা হয়েছে', 'Gallery item updated'),
      });
      setOpenDialog(false);
      form.reset();
      setEditingItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/gallery/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({
        title: t('সফল!', 'Success!'),
        description: t('গ্যালারি আইটেম মুছে ফেলা হয়েছে', 'Gallery item deleted'),
      });
    },
  });

  const handleSubmit = (data: any) => {
    const submitData = {
      ...data,
      additionalImages: typeof data.additionalImages === 'string' ? data.additionalImages : JSON.stringify(additionalImages),
    };
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setImagePreview(null);
    setAdditionalImages([]);
    form.reset({
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      image: '',
      type: 'photo',
      videoUrl: '',
      order: galleryItems.length,
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

  const handleEdit = (item: Gallery) => {
    setEditingItem(item);
    setImagePreview(item.image);
    try {
      const addImages = item.additionalImages ? JSON.parse(item.additionalImages) : [];
      setAdditionalImages(addImages);
    } catch {
      setAdditionalImages([]);
    }
    form.reset(item);
    setOpenDialog(true);
  };

  if (isLoading) return <div className="text-center p-8">{t('লোড হচ্ছে...', 'Loading...')}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('গ্যালারি পরিচালনা', 'Manage Gallery')}</h1>
          <p className="text-muted-foreground mt-2">{t('ছবি ও ভিডিও পরিচালনা করুন', 'Manage photos and videos')}</p>
        </div>
        <Button onClick={handleAddNew} data-testid="button-add-gallery">
          <Plus className="h-4 w-4 mr-2" />
          {t('নতুন আইটেম', 'Add Item')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryItems.map((item: Gallery) => (
          <Card key={item.id} className="hover-elevate" data-testid={`card-gallery-admin-${item.id}`}>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-md overflow-hidden">
                  <img
                    src={item.image}
                    alt={language === 'bn' ? item.title : item.titleEn}
                    className="w-full h-full object-cover"
                    data-testid={`img-gallery-admin-${item.id}`}
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold line-clamp-2" data-testid={`text-gallery-admin-title-${item.id}`}>
                    {language === 'bn' ? item.title : item.titleEn}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{item.type === 'video' ? t('ভিডিও', 'Video') : t('ছবি', 'Photo')}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                    disabled={updateMutation.isPending}
                    data-testid={`button-edit-gallery-${item.id}`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(item.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-gallery-${item.id}`}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto" data-testid="dialog-gallery-form">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? t('আইটেম সম্পাদনা করুন', 'Edit Item') : t('নতুন আইটেম যোগ করুন', 'Add New Item')}
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
                      <Input {...field} placeholder="শিরোনাম" className="h-8 text-sm" data-testid="input-gallery-title" />
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
                      <Input {...field} placeholder="Title" className="h-8 text-sm" data-testid="input-gallery-title-en" />
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
                    <Textarea {...field} value={field.value || ''} placeholder="বর্ণনা" className="text-sm resize-none h-12" data-testid="textarea-gallery-description" />
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
                    <Textarea {...field} value={field.value || ''} placeholder="Description" className="text-sm resize-none h-12" data-testid="textarea-gallery-description-en" />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('ধরন', 'Type')}</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full px-2 py-1.5 text-sm border rounded-md" data-testid="select-gallery-type">
                        <option value="photo">{t('ছবি', 'Photo')}</option>
                        <option value="video">{t('ভিডিও', 'Video')}</option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('ক্রম', 'Order')}</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" value={field.value || 0} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} className="text-sm" data-testid="input-gallery-order" />
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
                        data-testid="input-gallery-image-file"
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
                            data-testid="img-gallery-preview"
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
                      data-testid={`input-gallery-additional-image-${index}`}
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
            {form.watch('type') === 'video' && (
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">{t('ভিডিও URL', 'Video URL')}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} placeholder="https://..." className="h-8 text-sm" data-testid="input-gallery-video-url" />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="w-full h-8 text-sm" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-submit-gallery">
              {editingItem ? t('আপডেট করুন', 'Update') : t('যোগ করুন', 'Add')}
            </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
