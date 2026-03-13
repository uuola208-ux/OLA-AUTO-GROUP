import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import type { InsertCar, UpdateCarRequest } from "@shared/schema";

export function useCars() {
  return useQuery({
    queryKey: [api.cars.list.path],
    queryFn: async () => {
      const res = await apiRequest("GET", api.cars.list.path);
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
      const res = await apiRequest("GET", url);
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
      const res = await apiRequest(api.cars.create.method, api.cars.create.path, validated);
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
      const res = await apiRequest(api.cars.update.method, url, validated);
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
      await apiRequest(api.cars.delete.method, url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cars.list.path] });
    },
  });
}
