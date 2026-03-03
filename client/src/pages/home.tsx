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
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white tracking-widest mb-6 drop-shadow-2xl">
              UNPARALLELED <span className="gold-gradient-text">PRESTIGE</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-light tracking-wide">
              Discover the world's most exclusive collection of luxury and performance vehicles.
            </p>
            <Link 
              href="/inventory"
              className="inline-flex items-center px-8 py-4 bg-primary text-background font-semibold uppercase tracking-widest hover:bg-white transition-colors duration-300 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            >
              Explore Collection
              <ArrowRight className="ml-3 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest Arrivals Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-sm text-primary uppercase tracking-[0.3em] font-semibold mb-2">New to the showroom</h2>
            <h3 className="text-3xl md:text-4xl font-display text-white">LATEST ARRIVALS</h3>
          </div>
          <Link href="/inventory" className="hidden md:inline-flex items-center text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            View Full Inventory <ArrowRight className="ml-2 w-4 h-4" />
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
        
        <div className="mt-10 text-center md:hidden">
          <Link href="/inventory" className="inline-flex items-center text-sm uppercase tracking-widest text-primary border-b border-primary pb-1">
            View Full Inventory
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-card relative overflow-hidden border-y border-white/5">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
          {/* placeholder abstract luxury texture */}
          <img src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-sm text-primary uppercase tracking-[0.3em] font-semibold mb-2">Our Story</h2>
            <h3 className="text-3xl md:text-4xl font-display text-white mb-8">OUR HERITAGE</h3>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              European Prestige specializes in sourcing the world's most exclusive luxury and performance vehicles. With a focus on quality over quantity, every vehicle in our collection is hand-selected and rigorously inspected.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              For over two decades, we have catered to discerning collectors and automotive enthusiasts globally, providing an unmatched acquisition experience.
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
              <div>
                <p className="text-4xl font-display text-primary mb-2">20+</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Years Experience</p>
              </div>
              <div>
                <p className="text-4xl font-display text-primary mb-2">100%</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Client Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 gold-gradient-bg relative">
        <div className="absolute inset-0 bg-background/90"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-sm text-primary uppercase tracking-[0.3em] font-semibold mb-2">Visit Us</h2>
            <h3 className="text-3xl md:text-4xl font-display text-white">GET IN TOUCH</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card/50 backdrop-blur-sm border border-primary/20 p-8 text-center flex flex-col items-center hover:bg-card hover:border-primary transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <MapPin />
              </div>
              <h4 className="text-white font-display tracking-widest mb-2">Location</h4>
              <p className="text-muted-foreground text-sm">123 Luxury Way<br/>London, UK W1K 1AB</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-primary/20 p-8 text-center flex flex-col items-center hover:bg-card hover:border-primary transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Phone />
              </div>
              <h4 className="text-white font-display tracking-widest mb-2">Phone</h4>
              <p className="text-muted-foreground text-sm">+44 7000 000 000<br/>Direct Sales Line</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-primary/20 p-8 text-center flex flex-col items-center hover:bg-card hover:border-primary transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Mail />
              </div>
              <h4 className="text-white font-display tracking-widest mb-2">Email</h4>
              <p className="text-muted-foreground text-sm">sales@europeanprestige.com<br/>24/7 Support</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-primary/20 p-8 text-center flex flex-col items-center hover:bg-card hover:border-primary transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Clock />
              </div>
              <h4 className="text-white font-display tracking-widest mb-2">Hours</h4>
              <p className="text-muted-foreground text-sm">Mon - Sat: 9:00 - 18:00<br/>Sunday: By Appointment</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
