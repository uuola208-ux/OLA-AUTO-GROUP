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
      className="group relative flex flex-col bg-card border-none overflow-hidden"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={thumbnail} 
          alt={car.title}
          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 amari-gradient opacity-90 z-10" />
        
        <div className="absolute bottom-6 left-6 right-6 z-20">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="font-sans font-black text-3xl md:text-4xl text-black tracking-tighter leading-none mb-2">
                {car.title.split(' ').slice(0, 2).join(' ')}<br/>
                <span className="text-black/40">{car.title.split(' ').slice(2).join(' ')}</span>
              </h3>
            </div>
            <div className="text-right">
              <p className="text-black font-black text-2xl italic tracking-tighter mb-1">
                {formattedPrice}
              </p>
              <Link 
                href={`/car/${car.id}`}
                className="inline-block text-black font-black uppercase tracking-tighter border-b-2 border-black pb-0.5 hover:border-black/50 transition-all text-sm"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>

        {/* Hover overlay button */}
        <div className="absolute inset-0 z-30 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             <Link href={`/car/${car.id}`} className="px-8 py-3 bg-black text-white font-black uppercase tracking-tighter transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                Explore Vehicle
             </Link>
        </div>
      </div>
    </motion.div>
  );
}
