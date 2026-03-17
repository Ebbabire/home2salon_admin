import type { IProfessional } from "@/types";
import { mockProfessionals, nextId } from "./mock/data";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getProfessionals(): Promise<IProfessional[]> {
  await delay();
  return [...mockProfessionals];
}

export async function getProfessionalById(
  id: string,
): Promise<IProfessional> {
  await delay();
  const pro = mockProfessionals.find((p) => p._id === id);
  if (!pro) throw new Error("Professional not found");
  return { ...pro };
}

export async function addProfessional(
  professional: Pick<IProfessional, "fullName" | "phoneNumber" | "password">,
): Promise<IProfessional> {
  await delay();
  const newPro: IProfessional = {
    _id: nextId(),
    fullName: professional.fullName,
    phoneNumber: professional.phoneNumber,
    status: "Active",
    assignedOrders: 0,
    createdAt: new Date().toISOString(),
  };
  mockProfessionals.push(newPro);
  return newPro;
}

export async function updateProfessional(
  professional: IProfessional,
): Promise<IProfessional> {
  await delay();
  const idx = mockProfessionals.findIndex((p) => p._id === professional._id);
  if (idx === -1) throw new Error("Professional not found");
  mockProfessionals[idx] = { ...mockProfessionals[idx], ...professional };
  return mockProfessionals[idx];
}

export async function changeProfessionalStatus(payload: {
  id: string;
  status: string;
}): Promise<IProfessional> {
  await delay();
  const idx = mockProfessionals.findIndex((p) => p._id === payload.id);
  if (idx === -1) throw new Error("Professional not found");
  mockProfessionals[idx] = {
    ...mockProfessionals[idx],
    status: payload.status as "Active" | "Inactive",
  };
  return mockProfessionals[idx];
}
