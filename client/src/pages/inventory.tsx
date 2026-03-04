import { useCars } from "@/hooks/use-cars";
import { CarCard } from "@/components/ui/car-card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Inventory() {
  const { data: cars, isLoading, error } = useCars();

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <section className="pt-40 pb-20 px-6 border-b border-white/10">
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-l-[12px] border-white pl-10"
          >
            <h1 className="text-7xl md:text-9xl font-sans font-black text-white tracking-tighter leading-[0.8] mb-6">
              THE<br/><span className="text-white/10">COLLECTION</span>
            </h1>
            <p className="text-white font-bold uppercase tracking-[0.4em] text-sm">
              Currently {cars?.length || 0} masterpiece vehicles in stock
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse bg-white/5 aspect-[16/9]"></div>
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-red-600 font-black uppercase tracking-tighter">Error loading collection</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cars?.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
