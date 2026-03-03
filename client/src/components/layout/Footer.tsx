import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <Link href="/" className="text-2xl font-display font-bold tracking-widest text-white block mb-4">
              EUROPEAN<span className="text-primary">PRESTIGE</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Sourcing the world's most exclusive luxury and performance vehicles. 
              Quality over quantity, rigorously inspected for the discerning collector.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-display tracking-widest mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/inventory" className="hover:text-primary transition-colors">Inventory</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">Staff Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-display tracking-widest mb-4">Showroom</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>123 Luxury Way, London, UK</li>
              <li>+44 7000 000 000</li>
              <li>sales@europeanprestige.com</li>
              <li className="pt-2">Mon - Sat: 9am - 6pm</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 text-center text-xs text-muted-foreground flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} European Prestige. All Rights Reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
