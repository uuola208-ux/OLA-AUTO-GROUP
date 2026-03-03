import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateCar, useUpdateCar } from "@/hooks/use-cars";
import type { Car, InsertCar } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CarFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  car?: Car | null;
}

export function CarFormDialog({ open, onOpenChange, car }: CarFormDialogProps) {
  const { toast } = useToast();
  const createMutation = useCreateCar();
  const updateMutation = useUpdateCar();
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    imagesText: "",
    details: "",
  });

  useEffect(() => {
    if (car) {
      setFormData({
        title: car.title,
        price: car.price.toString(),
        imagesText: car.images.join("\n"),
        details: car.details || "",
      });
    } else {
      setFormData({ title: "", price: "", imagesText: "", details: "" });
    }
  }, [car, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse images from textarea
    const images = formData.imagesText
      .split("\n")
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (images.length === 0) {
      toast({ title: "Error", description: "At least one image URL is required.", variant: "destructive" });
      return;
    }

    const payload: InsertCar = {
      title: formData.title,
      price: parseInt(formData.price.replace(/\D/g, '') || "0", 10),
      images,
      details: formData.details || null,
    };

    try {
      if (car) {
        await updateMutation.mutateAsync({ id: car.id, ...payload });
        toast({ title: "Success", description: "Vehicle updated successfully." });
      } else {
        await createMutation.mutateAsync(payload);
        toast({ title: "Success", description: "New vehicle added to inventory." });
      }
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-white/10 text-foreground">
        <DialogHeader>
          <DialogTitle className="font-display tracking-widest text-primary">
            {car ? "EDIT VEHICLE" : "ADD NEW VEHICLE"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {car ? "Update details for this vehicle." : "Enter details for the new arrival."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs uppercase tracking-widest text-muted-foreground">Vehicle Title</Label>
              <Input 
                id="title" 
                required 
                value={formData.title}
                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                className="bg-background border-white/10 focus-visible:ring-primary"
                placeholder="e.g. 2023 Aston Martin DBS"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price" className="text-xs uppercase tracking-widest text-muted-foreground">Price (£)</Label>
              <Input 
                id="price" 
                type="number" 
                required 
                value={formData.price}
                onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
                className="bg-background border-white/10 focus-visible:ring-primary"
                placeholder="e.g. 250000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="images" className="text-xs uppercase tracking-widest text-muted-foreground">Image URLs (One per line)</Label>
            <Textarea 
              id="images" 
              required 
              rows={4}
              value={formData.imagesText}
              onChange={e => setFormData(p => ({ ...p, imagesText: e.target.value }))}
              className="bg-background border-white/10 focus-visible:ring-primary resize-none font-mono text-sm"
              placeholder="https://images.unsplash.com/photo-...\nhttps://images.unsplash.com/photo-..."
            />
            <p className="text-[10px] text-muted-foreground">Use high quality Unsplash URLs for best presentation.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details" className="text-xs uppercase tracking-widest text-muted-foreground">Description</Label>
            <Textarea 
              id="details" 
              rows={5}
              value={formData.details}
              onChange={e => setFormData(p => ({ ...p, details: e.target.value }))}
              className="bg-background border-white/10 focus-visible:ring-primary resize-none"
              placeholder="Detailed description of the vehicle's heritage, specs, and condition."
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-white/10 hover:bg-white/5 uppercase tracking-widest text-xs"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-xs"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {car ? "Save Changes" : "Create Vehicle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
