import type { ICategory } from "@/types";
import { mockCategories, nextId } from "./mock/data";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getCategories(): Promise<ICategory[]> {
  await delay();
  return [...mockCategories];
}

export async function getCategoryById(id: string): Promise<ICategory> {
  await delay();
  const cat = mockCategories.find((c) => c._id === id);
  if (!cat) throw new Error("Category not found");
  return { ...cat };
}

export async function addCategory(
  category: Pick<ICategory, "name">,
): Promise<ICategory> {
  await delay();
  const newCat: ICategory = {
    _id: nextId(),
    name: category.name,
    createdAt: new Date().toISOString(),
  };
  mockCategories.push(newCat);
  return newCat;
}

export async function updateCategory(category: ICategory): Promise<ICategory> {
  await delay();
  const idx = mockCategories.findIndex((c) => c._id === category._id);
  if (idx === -1) throw new Error("Category not found");
  mockCategories[idx] = { ...mockCategories[idx], name: category.name };
  return mockCategories[idx];
}

export async function deleteCategory(id: string): Promise<void> {
  await delay();
  const idx = mockCategories.findIndex((c) => c._id === id);
  if (idx === -1) throw new Error("Category not found");
  mockCategories.splice(idx, 1);
}
