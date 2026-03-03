import { useCars } from "@/hooks/use-cars";
import { CarCard } from "@/components/ui/car-card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Inventory() {
  const { data: cars, isLoading, error } = useCars();

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center md:text-left"
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-widest">
          FULL <span className="text-primary">INVENTORY</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Browse our complete collection of hand-selected luxury and performance vehicles. 
          Every motorcar represents the pinnacle of automotive engineering.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-primary">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="text-sm uppercase tracking-widest">Loading Collection...</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 p-8 text-center rounded-sm">
          <p className="text-destructive font-semibold">Failed to load inventory. Please try again later.</p>
        </div>
      ) : !cars || cars.length === 0 ? (
        <div className="bg-card border border-white/5 p-16 text-center">
          <h3 className="text-2xl font-display text-white mb-2">NO VEHICLES FOUND</h3>
          <p className="text-muted-foreground">Our inventory is currently being updated. Please check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car, index) => (
            <CarCard key={car.id} car={car} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
