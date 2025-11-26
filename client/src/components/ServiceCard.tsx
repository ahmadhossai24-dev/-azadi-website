import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
}

export default function ServiceCard({ icon: Icon, title, description, image }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all group border-0 shadow-md hover:shadow-xl" data-testid={`card-service-${title.toLowerCase()}`}>
      <div className="aspect-video relative overflow-hidden bg-secondary">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-4 right-4 p-3 bg-primary/90 backdrop-blur-sm rounded-full shadow-lg">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>
      <CardContent className="p-8">
        <h3 className="text-xl lg:text-2xl font-bold mb-3" data-testid={`text-service-title-${title.toLowerCase()}`}>{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-base" data-testid={`text-service-description-${title.toLowerCase()}`}>{description}</p>
      </CardContent>
    </Card>
  );
}
