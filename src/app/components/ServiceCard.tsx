import { Clock, MapPin, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ServiceCardProps {
  title: string;
  category: string;
  location: string;
  duration: string;
  rating: number;
  reviews: number;
  imageUrl: string;
}

export function ServiceCard({
  title,
  category,
  location,
  duration,
  rating,
  reviews,
  imageUrl
}: ServiceCardProps) {
  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-sm">
          {category}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3>{title}</h3>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{duration}</span>
          </div>

          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviews})</span>
          </div>
        </div>

        <button className="w-full py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
          Reservar Ahora
        </button>
      </div>
    </div>
  );
}
