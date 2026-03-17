import type { IService } from "@/types";
import { mockServices, nextId } from "./mock/data";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getServices(): Promise<IService[]> {
  await delay();
  return [...mockServices];
}

export async function getServicesByCategory(
  categoryId: string,
): Promise<IService[]> {
  await delay();
  return mockServices.filter((s) => {
    const catId = typeof s.category === "string" ? s.category : s.category._id;
    return catId === categoryId;
  });
}

export async function getServiceById(id: string): Promise<IService> {
  await delay();
  const svc = mockServices.find((s) => s._id === id);
  if (!svc) throw new Error("Service not found");
  return { ...svc };
}

export async function addService(formData: FormData): Promise<IService> {
  await delay();
  const newService: IService = {
    _id: nextId(),
    name: formData.get("name") as string,
    price: Number(formData.get("price")),
    category: formData.get("category") as string,
    description: (formData.get("description") as string) || undefined,
    image: "https://placehold.co/200x200/e2e8f0/64748b?text=New",
    createdAt: new Date().toISOString(),
  };
  mockServices.push(newService);
  return newService;
}

export async function updateService(
  id: string,
  formData: FormData,
): Promise<IService> {
  await delay();
  const idx = mockServices.findIndex((s) => s._id === id);
  if (idx === -1) throw new Error("Service not found");
  mockServices[idx] = {
    ...mockServices[idx],
    name: (formData.get("name") as string) || mockServices[idx].name,
    price: Number(formData.get("price")) || mockServices[idx].price,
    description:
      (formData.get("description") as string) ||
      mockServices[idx].description,
  };
  return mockServices[idx];
}

export async function deleteService(id: string): Promise<void> {
  await delay();
  const idx = mockServices.findIndex((s) => s._id === id);
  if (idx === -1) throw new Error("Service not found");
  mockServices.splice(idx, 1);
}
