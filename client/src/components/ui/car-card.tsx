import { Link } from "wouter";
import { type Car } from "@shared/schema";
import { motion } from "framer-motion";

interface CarCardProps {
  car: Car;
  index?: number;
}

export function CarCard({ car, index = 0 }: CarCardProps) {
  const thumbnail = car.images?.[0] || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800";
  
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0
  }).format(car.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group flex flex-col bg-card border border-white/5 overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-black/50">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img 
          src={thumbnail} 
          alt={car.title}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute bottom-4 left-4 z-20">
          <p className="text-primary font-display font-semibold text-lg drop-shadow-md">
            {formattedPrice}
          </p>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-display text-xl text-white mb-2 line-clamp-1">{car.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-grow">
          {car.details || "Experience unparalleled prestige with this luxury vehicle."}
        </p>
        
        <Link 
          href={`/car/${car.id}`}
          className="inline-flex items-center justify-center w-full py-3 bg-secondary text-white text-xs uppercase tracking-widest font-semibold border border-white/10 group-hover:bg-primary group-hover:text-background group-hover:border-primary transition-all duration-300"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
