import { useParams } from "wouter";
import { useCar } from "@/hooks/use-cars";
import { Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Link } from "wouter";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CarDetails() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const { data: car, isLoading, error } = useCar(id);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-display text-white mb-4">Vehicle Not Found</h1>
        <p className="text-muted-foreground mb-8">The vehicle you are looking for does not exist or has been removed.</p>
        <Link href="/inventory" className="px-6 py-3 bg-primary text-background uppercase tracking-widest font-semibold text-sm hover:bg-white transition-colors">
          Return to Inventory
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0
  }).format(car.price);

  const hasImages = car.images && car.images.length > 0;
  const mainImages = hasImages ? car.images : ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200"];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/inventory" className="inline-flex items-center text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative overflow-hidden bg-card border border-white/10 aspect-[4/3]" ref={emblaRef}>
              <div className="flex h-full">
                {mainImages.map((src, idx) => (
                  <div className="flex-[0_0_100%] min-w-0 relative" key={idx}>
                    <img 
                      src={src} 
                      alt={`${car.title} - View ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              
              {mainImages.length > 1 && (
                <>
                  <button onClick={scrollPrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white border border-white/20 flex items-center justify-center hover:bg-primary hover:text-background transition-colors backdrop-blur-sm z-10">
                    &larr;
                  </button>
                  <button onClick={scrollNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white border border-white/20 flex items-center justify-center hover:bg-primary hover:text-background transition-colors backdrop-blur-sm z-10">
                    &rarr;
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {mainImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {mainImages.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollTo(idx)}
                    className={`aspect-video overflow-hidden border-2 transition-all ${
                      selectedIndex === idx ? "border-primary" : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={src} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right Column: Car Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">
              {car.title}
            </h1>
            
            <div className="mb-8 pb-8 border-b border-white/10">
              <p className="text-4xl text-primary font-display font-semibold drop-shadow-sm">
                {formattedPrice}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-widest text-white/50 mb-4">Vehicle Description</h3>
              <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                {car.details || "No description provided for this vehicle. Contact us for full specifications and history."}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-8">
              <a 
                href="#contact" 
                className="flex-1 bg-primary text-background text-center py-4 uppercase tracking-widest text-sm font-semibold hover:bg-white transition-colors shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                Inquire Now
              </a>
              <button className="flex-1 bg-transparent border border-white/20 text-white text-center py-4 uppercase tracking-widest text-sm font-semibold hover:bg-white/5 transition-colors">
                Book Viewing
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
