import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertCar, UpdateCarRequest } from "@shared/schema";

export function useCars() {
  return useQuery({
    queryKey: [api.cars.list.path],
    queryFn: async () => {
      const res = await fetch(api.cars.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch cars");
      const data = await res.json();
      return api.cars.list.responses[200].parse(data);
    },
  });
}

export function useCar(id: number) {
  return useQuery({
    queryKey: [api.cars.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.cars.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch car");
      const data = await res.json();
      return api.cars.get.responses[200].parse(data);
    },
    enabled: !!id,
  });
}

export function useCreateCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertCar) => {
      const validated = api.cars.create.input.parse(data);
      const res = await fetch(api.cars.create.path, {
        method: api.cars.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.cars.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create car");
      }
      return api.cars.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cars.list.path] });
    },
  });
}

export function useUpdateCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateCarRequest) => {
      const validated = api.cars.update.input.parse(updates);
      const url = buildUrl(api.cars.update.path, { id });
      const res = await fetch(url, {
        method: api.cars.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.cars.update.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 404) throw new Error("Car not found");
        throw new Error("Failed to update car");
      }
      return api.cars.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.cars.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.cars.get.path, variables.id] });
    },
  });
}

export function useDeleteCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.cars.delete.path, { id });
      const res = await fetch(url, { 
        method: api.cars.delete.method, 
        credentials: "include" 
      });
      if (res.status === 404) throw new Error("Car not found");
      if (!res.ok) throw new Error("Failed to delete car");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cars.list.path] });
    },
  });
}
