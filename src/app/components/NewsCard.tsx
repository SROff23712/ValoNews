import { Clock, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface NewsCardProps {
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  featured?: boolean;
}

export function NewsCard({ title, category, date, image, excerpt, featured = false }: NewsCardProps) {
  if (featured) {
    return (
      <div className="group relative overflow-hidden rounded bg-card border border-primary/20 transition-all hover:border-primary/60 cursor-pointer">
        <div className="aspect-[21/9] overflow-hidden">
          <ImageWithFallback
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="mb-3 flex items-center gap-4">
            <span className="inline-block bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-background">
              {category}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={14} />
              {date}
            </span>
          </div>
          
          <h2 className="mb-3 text-3xl font-bold uppercase tracking-wide text-foreground" style={{ fontFamily: 'Tungsten, sans-serif', fontWeight: 700 }}>
            {title}
          </h2>
          
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
            {excerpt}
          </p>
          
          <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
            <span className="text-sm font-semibold uppercase tracking-wider">Lire la suite</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded bg-card border border-primary/20 transition-all hover:border-primary/60 cursor-pointer">
      <div className="aspect-video overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      <div className="p-5">
        <div className="mb-3 flex items-center gap-3">
          <span className="inline-block bg-primary/20 px-2 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            {category}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} />
            {date}
          </span>
        </div>
        
        <h3 className="mb-2 text-xl font-bold uppercase tracking-wide text-foreground line-clamp-2" style={{ fontFamily: 'Tungsten, sans-serif', fontWeight: 700 }}>
          {title}
        </h3>
        
        <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
          {excerpt}
        </p>
        
        <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
          <span className="text-xs font-semibold uppercase tracking-wider">Lire la suite</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
}
