import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit2, Upload, Loader2 } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Leader } from '@shared/schema';
import { useState, useRef, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { uploadImage, validateImageFile } from '@/lib/imageUtils';

export default function AdminLeadership() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    position: '',
    positionEn: '',
    quote: '',
    quoteEn: '',
    image: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: leadersResponse, isLoading } = useQuery<any>({
    queryKey: ['/api/leaders'],
    staleTime: 30000,
    gcTime: 60000,
  });

  const leaders = useMemo(() => {
    if (!leadersResponse) return [];
    if (Array.isArray(leadersResponse)) return leadersResponse as Leader[];
    if (leadersResponse.data && Array.isArray(leadersResponse.data)) {
      return Array.from(leadersResponse.data) as Leader[];
    }
    return [];
  }, [leadersResponse]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => await apiRequest('POST', '/api/leaders', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leaders'] });
      toast({
        title: t('সফল!', 'Success!'),
        description: t('নেতা যোগ করা হয়েছে', 'Leader added'),
      });
      handleCloseDialog();
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('ত্রুটি', 'Error'),
        description: t('নেতা যোগ করতে ব্যর্থ হয়েছে', 'Failed to add leader'),
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => await apiRequest('PATCH', `/api/leaders/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leaders'] });
      toast({
        title: t('সফল!', 'Success!'),
        description: t('নেতা আপডেট করা হয়েছে', 'Leader updated'),
      });
      handleCloseDialog();
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('ত্রুটি', 'Error'),
        description: t('নেতা আপডেট করতে ব্যর্থ হয়েছে', 'Failed to update leader'),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await apiRequest('DELETE', `/api/leaders/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leaders'] });
      toast({
        title: t('সফল!', 'Success!'),
        description: t('নেতা মুছে ফেলা হয়েছে', 'Leader deleted'),
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('ত্রুটি', 'Error'),
        description: t('নেতা মুছতে ব্যর্থ হয়েছে', 'Failed to delete leader'),
      });
    },
  });

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingLeader(null);
    setImagePreview(null);
    setFormData({
      name: '',
      nameEn: '',
      position: '',
      positionEn: '',
      quote: '',
      quoteEn: '',
      image: '',
    });
  }, []);

  const handleAddNew = useCallback(() => {
    setEditingLeader(null);
    setImagePreview(null);
    setFormData({
      name: '',
      nameEn: '',
      position: '',
      positionEn: '',
      quote: '',
      quoteEn: '',
      image: '',
    });
    setOpenDialog(true);
  }, []);

  const handleEdit = useCallback((leader: Leader) => {
    setEditingLeader(leader);
    setImagePreview(leader.image);
    setFormData({
      name: leader.name,
      nameEn: leader.nameEn,
      position: leader.position,
      positionEn: leader.positionEn,
      quote: leader.quote,
      quoteEn: leader.quoteEn,
      image: leader.image,
    });
    setOpenDialog(true);
  }, []);

  const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({
          variant: 'destructive',
          title: t('ত্রুটি', 'Error'),
          description: validation.error || t('ছবি ফরম্যাট সমর্থিত নয়', 'Image format not supported'),
        });
        return;
      }

      const base64 = await uploadImage(file, { maxWidth: 1000, maxHeight: 1000, quality: 0.75 });
      setImagePreview(base64);
      setFormData((prev) => ({ ...prev, image: base64 }));
      
      toast({
        title: t('সাফল্য!', 'Success!'),
        description: t('ছবি আপলোড হয়েছে', 'Image uploaded successfully'),
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('ত্রুটি', 'Error'),
        description: error?.message || t('ছবি আপলোড ব্যর্থ হয়েছে', 'Failed to upload image'),
      });
    }
  }, [toast, t]);

  const handleRemoveImage = useCallback(() => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.name || !formData.nameEn || !formData.position || !formData.positionEn) {
      toast({
        variant: 'destructive',
        title: t('ত্রুটি', 'Error'),
        description: t('সমস্ত ফিল্ড পূরণ করুন', 'Please fill all fields'),
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingLeader) {
        updateMutation.mutate({ id: editingLeader.id, data: formData });
      } else {
        createMutation.mutate(formData);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, editingLeader, createMutation, updateMutation, toast, t]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">{t('লোড হচ্ছে...', 'Loading...')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('নেতৃত্ব পরিচালনা', 'Manage Leadership')}</h1>
          <p className="text-muted-foreground mt-2">{t('সংগঠনের নেতাদের পরিচালনা করুন', 'Manage organization leaders')}</p>
        </div>
        <Button onClick={handleAddNew} data-testid="button-add-leader">
          <Plus className="h-4 w-4 mr-2" />
          {t('নেতা যোগ করুন', 'Add Leader')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leaders.map((leader) => (
          <Card key={leader.id} className="hover-elevate" data-testid={`card-leader-${leader.id}`}>
            <CardContent className="pt-6">
              {leader.image && (
                <img
                  src={leader.image}
                  alt={language === 'bn' ? leader.name : leader.nameEn}
                  className="w-full h-48 object-cover rounded-md mb-4"
                  loading="lazy"
                  data-testid={`img-leader-${leader.id}`}
                />
              )}
              <h3 className="font-bold text-lg mb-1" data-testid={`text-leader-name-${leader.id}`}>
                {language === 'bn' ? leader.name : leader.nameEn}
              </h3>
              <p className="text-sm text-primary mb-3" data-testid={`text-leader-position-${leader.id}`}>
                {language === 'bn' ? leader.position : leader.positionEn}
              </p>
              <p className="text-sm text-muted-foreground mb-4 italic" data-testid={`text-leader-quote-${leader.id}`}>
                "{language === 'bn' ? leader.quote : leader.quoteEn}"
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(leader)}
                  disabled={updateMutation.isPending}
                  data-testid={`button-edit-leader-${leader.id}`}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(leader.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-leader-${leader.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto" data-testid="dialog-leader-form">
          <DialogHeader>
            <DialogTitle>
              {editingLeader ? t('নেতা সম্পাদনা করুন', 'Edit Leader') : t('নতুন নেতা যোগ করুন', 'Add New Leader')}
            </DialogTitle>
            <DialogDescription>
              {editingLeader ? t('নেতার তথ্য আপডেট করুন', 'Update leader information') : t('নতুন নেতার তথ্য যোগ করুন', 'Add new leader information')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">{t('নাম (বাংলা)', 'Name (Bengali)')}</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="নাম"
                  className="h-8 text-sm"
                  data-testid="input-leader-name"
                />
              </div>
              <div>
                <Label className="text-sm">{t('নাম (ইংরেজি)', 'Name (English)')}</Label>
                <Input
                  value={formData.nameEn}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nameEn: e.target.value }))}
                  placeholder="Name"
                  className="h-8 text-sm"
                  data-testid="input-leader-name-en"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">{t('পদবী (বাংলা)', 'Position (Bengali)')}</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
                  placeholder="পদবী"
                  className="h-8 text-sm"
                  data-testid="input-leader-position"
                />
              </div>
              <div>
                <Label className="text-sm">{t('পদবী (ইংরেজি)', 'Position (English)')}</Label>
                <Input
                  value={formData.positionEn}
                  onChange={(e) => setFormData((prev) => ({ ...prev, positionEn: e.target.value }))}
                  placeholder="Position"
                  className="h-8 text-sm"
                  data-testid="input-leader-position-en"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm">{t('বাণী (বাংলা)', 'Quote (Bengali)')}</Label>
              <Textarea
                value={formData.quote}
                onChange={(e) => setFormData((prev) => ({ ...prev, quote: e.target.value }))}
                placeholder="বাণী"
                className="text-sm resize-none h-16"
                data-testid="textarea-leader-quote"
              />
            </div>

            <div>
              <Label className="text-sm">{t('বাণী (ইংরেজি)', 'Quote (English)')}</Label>
              <Textarea
                value={formData.quoteEn}
                onChange={(e) => setFormData((prev) => ({ ...prev, quoteEn: e.target.value }))}
                placeholder="Quote"
                className="text-sm resize-none h-16"
                data-testid="textarea-leader-quote-en"
              />
            </div>

            <div>
              <Label className="text-sm">{t('ছবি আপলোড করুন', 'Upload Image')}</Label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                  data-testid="input-leader-image-file"
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
                {(imagePreview || formData.image) && (
                  <div className="relative">
                    <img
                      src={imagePreview || formData.image}
                      alt="Preview"
                      className="w-full h-24 object-cover rounded-md"
                      data-testid="img-leader-preview"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={handleRemoveImage}
                      data-testid="button-remove-image"
                    >
                      ✕
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
              className="w-full h-8 text-sm"
              data-testid="button-submit-leader"
            >
              {isSubmitting || createMutation.isPending || updateMutation.isPending ? (
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
              ) : null}
              {editingLeader ? t('আপডেট করুন', 'Update') : t('যোগ করুন', 'Add')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
