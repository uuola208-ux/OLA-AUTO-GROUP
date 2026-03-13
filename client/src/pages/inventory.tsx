import { useCars, useDeleteCar } from "@/hooks/use-cars";
import { CarCard } from "@/components/ui/car-card";
import { Loader2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { CarFormDialog } from "@/components/admin/car-form-dialog";
import { useState } from "react";
import type { Car } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Inventory() {
  const { data: cars, isLoading, error } = useCars();
  const { user } = useAuth();
  const deleteMutation = useDeleteCar();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const handleCreateNew = () => {
    setEditingCar(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      try {
        await deleteMutation.mutateAsync(id);
        toast({ title: "Deleted", description: "Vehicle removed from inventory." });
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <section className="pt-40 pb-20 px-6 border-b border-white/10">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-l-[12px] border-white pl-10"
          >
            <h1 className="text-7xl md:text-9xl font-sans font-black text-white tracking-tighter leading-[0.8] mb-6">
              THE<br /><span className="text-white/10">COLLECTION</span>
            </h1>
            <p className="text-white font-bold uppercase tracking-[0.4em] text-sm">
              Currently {cars?.length || 0} masterpiece vehicles in stock
            </p>
          </motion.div>

          {user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleCreateNew}
                className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs rounded-none px-8 py-6 shadow-lg shadow-primary/20"
              >
                <Plus className="w-5 h-5 mr-3" /> Add New Vehicle
              </Button>
            </motion.div>
          )}
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
              <CarCard
                key={car.id}
                car={car}
                index={index}
                isAdmin={!!user}
                onEdit={() => handleEdit(car)}
                onDelete={() => handleDelete(car.id, car.title)}
              />
            ))}
          </div>
        )}
      </section>

      <CarFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        car={editingCar}
      />
    </div>
  );
}
