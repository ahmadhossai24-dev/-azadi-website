import { useLanguage } from '@/lib/language';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function Gallery() {
  const { t, language } = useLanguage();
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: galleryResponse = [] } = useQuery<any>({
    queryKey: ['/api/gallery'],
  });

  const galleryItems = Array.isArray(galleryResponse) ? galleryResponse : (galleryResponse?.data ? Array.from(galleryResponse.data) : []);

  return (
    <div className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="text-gallery-title">
            {t('আমাদের গ্যালারি', 'Our Gallery')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-gallery-description">
            {t(
              'আমাদের সাম্প্রতিক কার্যক্রমের ছবি ও ভিডিও দেখুন',
              'View photos and videos of our recent activities'
            )}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {galleryItems.map((item: any, index: number) => (
            <Card
              key={item.id || index}
              className="overflow-hidden hover-elevate cursor-pointer group"
              onClick={() => setSelectedMedia(item)}
              data-testid={`card-gallery-${item.id || index}`}
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 aspect-square">
                {item.type === 'video' ? (
                  <>
                    <img
                      src={item.image}
                      alt={language === 'bn' ? item.title : item.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      data-testid={`img-gallery-thumbnail-${item.id}`}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </>
                ) : (
                  <img
                    src={item.image}
                    alt={language === 'bn' ? item.title : item.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    data-testid={`img-gallery-${item.id}`}
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg line-clamp-2" data-testid={`text-gallery-title-${item.id}`}>
                  {language === 'bn' ? item.title : item.titleEn}
                </h3>
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2" data-testid={`text-gallery-description-${item.id}`}>
                    {language === 'bn' ? item.description : item.descriptionEn}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>

        {galleryItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">{t('কোন গ্যালারি আইটেম নেই', 'No gallery items yet')}</p>
          </div>
        )}
      </div>

      {/* Media Viewer Dialog */}
      <Dialog open={!!selectedMedia} onOpenChange={() => { setSelectedMedia(null); setCurrentImageIndex(0); }}>
        <DialogContent className="w-full max-w-5xl max-h-[95vh] overflow-y-auto p-0" data-testid="dialog-gallery-viewer">
          {selectedMedia && (
            <div className="bg-black">
              {selectedMedia.type === 'video' ? (
                <iframe
                  src={selectedMedia.videoUrl}
                  className="w-full aspect-video"
                  allowFullScreen
                  data-testid="iframe-gallery-video"
                />
              ) : (
                <div className="relative w-full max-h-[60vh] flex items-center justify-center bg-black">
                  {(() => {
                    let allImages = [selectedMedia.image];
                    try {
                      const additional = JSON.parse(selectedMedia.additionalImages || '[]');
                      if (Array.isArray(additional) && additional.length > 0) {
                        allImages = [...allImages, ...additional.filter((img: string) => img)];
                      }
                    } catch {
                      // Keep default allImages
                    }
                    
                    const currentImage = allImages[currentImageIndex] || selectedMedia.image;
                    const hasMultipleImages = allImages.length > 1;
                    
                    return (
                      <>
                        <img
                          src={currentImage}
                          alt={language === 'bn' ? selectedMedia.title : selectedMedia.titleEn}
                          className="w-full h-full max-h-[60vh] object-contain"
                          data-testid="img-gallery-fullscreen"
                        />
                        {hasMultipleImages && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full"
                              onClick={() => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                              data-testid="button-prev-gallery-image"
                            >
                              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full"
                              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % allImages.length)}
                              data-testid="button-next-gallery-image"
                            >
                              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                            </Button>
                            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5 bg-black/50 px-3 py-2 rounded-full">
                              {allImages.map((_, idx: number) => (
                                <div
                                  key={idx}
                                  className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all ${
                                    idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                  }`}
                                  data-testid={`indicator-gallery-${idx}`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
              <div className="p-4 sm:p-6 bg-white dark:bg-slate-900">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 break-words" data-testid="text-gallery-fullscreen-title">
                  {language === 'bn' ? selectedMedia.title : selectedMedia.titleEn}
                </h2>
                {selectedMedia.description && (
                  <p className="text-sm sm:text-base text-muted-foreground break-words whitespace-pre-wrap leading-relaxed" data-testid="text-gallery-fullscreen-description">
                    {language === 'bn' ? selectedMedia.description : selectedMedia.descriptionEn}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
