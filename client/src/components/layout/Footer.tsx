import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-black py-20 px-4 border-t border-white/10">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <Link href="/" className="text-4xl font-sans font-black tracking-tighter text-white mb-6 block">
            OLA<span className="text-white/20">AUTO GROUP</span>
          </Link>
          <p className="text-white/40 max-w-md font-bold uppercase tracking-widest text-xs leading-relaxed">
            The world's finest selection of luxury and performance vehicles.
          </p>
        </div>
        <div>
          <h4 className="text-white font-black uppercase tracking-tighter mb-6 text-xl">Inventory</h4>
          <ul className="space-y-4">
            <li><Link href="/inventory" className="text-white/40 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">All Stock</Link></li>
            <li><Link href="/inventory?category=new" className="text-white/40 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">New Arrivals</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-black uppercase tracking-tighter mb-6 text-xl">Connect</h4>
          <ul className="space-y-4 text-white/40 font-bold uppercase tracking-widest text-xs">
            <li>Email: enquiries@olaautogroup.co.uk</li>
            <li>Instagram: @olaautogroup</li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-white/20 text-[10px] uppercase font-bold tracking-[0.3em]">
          &copy; {new Date().getFullYear()} OLA AUTO GROUP LTD. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-8">
          <a href="#" className="text-white/20 text-[10px] uppercase font-bold tracking-[0.3em] hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-white/20 text-[10px] uppercase font-bold tracking-[0.3em] hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
