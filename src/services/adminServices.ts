import { type IAdmin } from "@/pages/admins/Admins";
import { mockAdmins, nextId } from "./mock/data";

import { Login } from "@/pages/login/Login";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const login = async (
  authDetail: Login,
): Promise<{ token: string; admin: IAdmin }> => {
  await delay(500);

  const admin = mockAdmins.find(
    (a) =>
      a.phoneNumber === authDetail.phoneNumber ||
      a.email === authDetail.phoneNumber,
  );

  if (!admin) throw new Error("Invalid credentials");

  const token = "mock-token-" + Date.now();
  sessionStorage.setItem("token", JSON.stringify(token));
  sessionStorage.setItem("id", JSON.stringify(admin._id));
  sessionStorage.setItem("userName", JSON.stringify(admin.fullName));
  sessionStorage.setItem("userRole", JSON.stringify(admin.role));

  return { token, admin };
};

export async function getAdmins(): Promise<IAdmin[]> {
  await delay();
  return [...mockAdmins];
}

export async function getAdminById(id?: string): Promise<IAdmin> {
  await delay();
  const admin = mockAdmins.find((a) => a._id === id);
  if (!admin) throw new Error("Admin not found");
  return { ...admin };
}

export async function addAdmin(admin: IAdmin): Promise<IAdmin> {
  await delay();
  const newAdmin: IAdmin = {
    ...admin,
    _id: nextId(),
    status: "Active",
    createdAt: new Date(),
  };
  mockAdmins.push(newAdmin);
  return newAdmin;
}

export async function updateAdmin(updatedAdmin: IAdmin): Promise<IAdmin> {
  await delay();
  const idx = mockAdmins.findIndex((a) => a._id === updatedAdmin._id);
  if (idx === -1) throw new Error("Admin not found");
  mockAdmins[idx] = { ...mockAdmins[idx], ...updatedAdmin };
  return mockAdmins[idx];
}

export async function changeAdminStatus(status: {
  id: string;
  status: string;
}): Promise<IAdmin> {
  await delay();
  const idx = mockAdmins.findIndex((a) => a._id === status.id);
  if (idx === -1) throw new Error("Admin not found");
  mockAdmins[idx] = { ...mockAdmins[idx], status: status.status };
  return mockAdmins[idx];
}
