import { useState } from "react";
import { useCars, useDeleteCar } from "@/hooks/use-cars";
import { CarFormDialog } from "@/components/admin/car-form-dialog";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, LayoutDashboard, Loader2, Image as ImageIcon } from "lucide-react";
import type { Car } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { data: cars, isLoading } = useCars();
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
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="text-primary w-8 h-8" />
            <div>
              <h1 className="text-2xl font-display font-bold text-white tracking-widest">STAFF DASHBOARD</h1>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Inventory Management</p>
            </div>
          </div>
          <Button 
            onClick={handleCreateNew}
            className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs rounded-none px-6 shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4 mr-2" /> Add New Vehicle
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !cars || cars.length === 0 ? (
          <div className="bg-card border border-white/5 p-12 text-center flex flex-col items-center">
            <ImageIcon className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-display text-white mb-2">Inventory is Empty</h3>
            <p className="text-muted-foreground mb-6 text-sm">You haven't added any vehicles to the database yet.</p>
            <Button variant="outline" onClick={handleCreateNew} className="border-primary text-primary hover:bg-primary hover:text-background rounded-none uppercase tracking-widest text-xs">
              Add First Vehicle
            </Button>
          </div>
        ) : (
          <div className="bg-card border border-white/10 rounded-sm overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-black/50 text-xs uppercase tracking-widest text-muted-foreground border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-medium">Image</th>
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Images</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {cars.map((car) => (
                    <tr key={car.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="w-16 h-12 rounded-sm overflow-hidden bg-black/50 border border-white/10">
                          {car.images?.[0] ? (
                            <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-display font-semibold text-white">
                        {car.title}
                      </td>
                      <td className="px-6 py-4 text-primary">
                        £{car.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {car.images?.length || 0} photos
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(car)}
                            className="h-8 w-8 p-0 text-white hover:text-primary hover:bg-primary/10 rounded-sm"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(car.id, car.title)}
                            disabled={deleteMutation.isPending}
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-sm"
                          >
                            {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
      
      <CarFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        car={editingCar} 
      />
    </div>
  );
}
