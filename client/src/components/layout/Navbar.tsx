import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Inventory", path: "/inventory" },
    { name: "Admin", path: "/admin" },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white py-4 shadow-xl" : "bg-transparent py-8"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 flex justify-between items-center">
        <Link 
          href="/" 
          className={`text-4xl font-sans font-black tracking-tighter transition-colors ${
            isScrolled ? "text-black" : "text-black"
          }`}
        >
          OLA<span className={isScrolled ? "text-black/10" : "text-black/10"}>AUTO GROUP</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={`text-xs uppercase tracking-[0.2em] font-black transition-colors hover:opacity-50 ${
                isScrolled 
                  ? (location === link.path ? "text-black" : "text-black/60") 
                  : (location === link.path ? "text-black" : "text-black/60")
              }`}
            >
              {link.name}
            </Link>
          ))}
          <a 
            href="#contact" 
            className={`px-8 py-3 font-black uppercase tracking-tighter text-sm transition-all border-2 ${
              isScrolled 
                ? "border-black text-black hover:bg-black hover:text-white" 
                : "border-black text-black hover:bg-black hover:text-white"
            }`}
          >
            Get in Touch
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white hover:text-primary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/5 overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-8 space-y-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg uppercase tracking-widest font-medium transition-colors ${
                    location === link.path ? "text-primary" : "text-white/80"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 px-6 py-3 border border-primary text-primary text-center hover:bg-primary hover:text-background transition-all uppercase tracking-widest text-sm font-semibold"
              >
                Contact Us
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
