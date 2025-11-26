import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface EventCardProps {
  id: string;
  title: string;
  titleEn: string;
  date: string;
  location: string;
  locationEn: string;
  image: string;
  description: string;
  descriptionEn: string;
  additionalImages?: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export default function EventCard({
  id,
  title,
  titleEn,
  date,
  location,
  locationEn,
  image,
  description,
  descriptionEn,
  additionalImages = '[]',
  isExpanded = false,
  onToggleExpand,
}: EventCardProps) {
  const { language, t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  let allImages = [image];
  try {
    const additional = JSON.parse(additionalImages);
    if (Array.isArray(additional) && additional.length > 0) {
      allImages = [...allImages, ...additional.filter(img => img)];
    }
  } catch {
    // Keep default allImages
  }
  
  const currentImage = allImages[currentImageIndex] || image;
  const hasMultipleImages = allImages.length > 1;

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  return (
    <Card className="overflow-hidden hover-elevate transition-all group border-0 shadow-md hover:shadow-xl" data-testid={`card-event-${id}`}>
      <div className="aspect-video relative overflow-hidden bg-secondary">
        <img
          src={currentImage}
          alt={language === 'bn' ? title : titleEn}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.currentTarget.src = image; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {hasMultipleImages && (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white transition-all"
              onClick={goToPrevious}
              data-testid={`button-prev-image-${id}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white transition-all"
              onClick={goToNext}
              data-testid={`button-next-image-${id}`}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5 bg-black/40 px-2 sm:px-3 py-1.5 rounded-full">
              {allImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all cursor-pointer ${
                    idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentImageIndex(idx)}
                  data-testid={`indicator-image-${id}-${idx}`}
                />
              ))}
            </div>
          </>
        )}
        
        <div className="absolute top-4 right-4">
          <Badge className="bg-primary/90 backdrop-blur-sm text-primary-foreground font-semibold shadow-lg" data-testid={`badge-event-date-${id}`}>
            {new Date(date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 break-words" data-testid={`text-event-title-${id}`}>
          {language === 'bn' ? title : titleEn}
        </h3>
        <div className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3">
            <Calendar className="h-4 sm:h-5 w-4 sm:w-5 text-primary flex-shrink-0 mt-0.5 sm:mt-0" />
            <span className="font-medium break-words" data-testid={`text-event-full-date-${id}`}>
              {new Date(date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-start sm:items-center gap-2 sm:gap-3">
            <MapPin className="h-4 sm:h-5 w-4 sm:w-5 text-primary flex-shrink-0 mt-0.5 sm:mt-0" />
            <span className="font-medium break-words" data-testid={`text-event-location-${id}`}>{language === 'bn' ? location : locationEn}</span>
          </div>
        </div>
        <p className={`text-muted-foreground text-xs sm:text-sm leading-relaxed break-words whitespace-pre-wrap ${!isExpanded ? 'line-clamp-3' : ''}`} data-testid={`text-event-description-${id}`}>
          {language === 'bn' ? description : descriptionEn}
        </p>
        {onToggleExpand && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="mt-4 px-0 h-auto text-primary hover:text-primary hover:bg-transparent"
            data-testid={`button-toggle-description-${id}`}
          >
            {isExpanded ? t('কম দেখুন', 'Show Less') : t('আরও দেখুন', 'Show More')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
