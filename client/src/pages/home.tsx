import { Link } from "wouter";
import { useCars } from "@/hooks/use-cars";
import { CarCard } from "@/components/ui/car-card";
import { motion } from "framer-motion";
import { ArrowRight, Phone, MapPin, Mail, Clock } from "lucide-react";

export default function Home() {
  const { data: cars, isLoading } = useCars();
  
  // Show max 3 cars on home page
  const latestCars = cars?.slice(0, 3) || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* landing page hero luxury car dark */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-background z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1920&auto=format&fit=crop" 
            alt="Luxury Aston Martin" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-7xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-sans font-black text-white tracking-tighter mb-2 leading-[0.8] drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              OLA<br/><span className="text-white/10">AUTO GROUP</span>
            </h1>
            <p className="text-xl md:text-2xl text-white font-bold uppercase tracking-[0.2em] mt-8 mb-12">
              The World's Finest Selection
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/inventory"
                className="inline-flex items-center px-10 py-5 bg-white text-black font-black uppercase tracking-tighter hover:bg-white/90 transition-all duration-300 text-lg"
              >
                View Inventory
              </Link>
              <a 
                href="#contact"
                className="inline-flex items-center px-10 py-5 bg-transparent text-white border-2 border-white font-black uppercase tracking-tighter hover:bg-white hover:text-black transition-all duration-300 text-lg"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest Arrivals Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 border-l-8 border-white pl-8">
          <div>
            <h3 className="text-6xl md:text-8xl font-sans font-black text-white tracking-tighter leading-none">NEW ARRIVALS</h3>
            <p className="text-white/40 font-bold uppercase tracking-[0.3em] mt-4">Fresh stock updated daily</p>
          </div>
          <Link href="/inventory" className="mt-8 md:mt-0 text-white font-black uppercase tracking-tighter border-b-4 border-white pb-1 hover:border-white/50 transition-all text-xl">
            See All Stock
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-card h-96 border border-white/5"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestCars.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-card relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-6xl md:text-8xl font-sans font-black text-white tracking-tighter">GET IN TOUCH</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            <div className="p-8">
              <h4 className="text-white font-black uppercase tracking-widest mb-2 text-xl">Business</h4>
              <p className="text-white/60 font-bold uppercase tracking-widest">Ola Auto Group Ltd</p>
            </div>
            
            <div className="p-8">
              <h4 className="text-white font-black uppercase tracking-widest mb-2 text-xl">Email</h4>
              <p className="text-white/60 font-bold uppercase tracking-widest">enquiries@olaautogroup.co.uk</p>
            </div>
            
            <div className="p-8">
              <h4 className="text-white font-black uppercase tracking-widest mb-2 text-xl">Instagram</h4>
              <p className="text-white/60 font-bold uppercase tracking-widest">@olaautogroup</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
