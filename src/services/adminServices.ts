import { type IAdmin } from "@/pages/admins/Admins";
import { getSession } from "./session";

import { Login } from "@/pages/login/Login";

// login service
export const login = async (
  authDetail: Login,
): Promise<{ token: string; admin: IAdmin }> => {
  // options object to pass to the fetch api function
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(authDetail),
  };
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/admin/login`,
    requestOptions,
  );
  if (!response.ok) {
    const error = await response.json(); // Access the error message from the response body
    throw new Error(error.message);
  }
  const { data } = await response.json();

  if (data.token) {
    sessionStorage.setItem("token", JSON.stringify(data.token));
    sessionStorage.setItem("id", JSON.stringify(data.admin._id));
    sessionStorage.setItem(
      "userName",
      JSON.stringify(`${data.admin.fullName}`),
    );
    sessionStorage.setItem("userRole", JSON.stringify(data.admin.role));
  }

  return data;
};

// function to get admins
export async function getAdmins(): Promise<IAdmin[]> {
  const { token } = getSession();
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/admin`,
    requestOptions,
  );
  if (!response.ok) {
    const error = await response.json(); // Access the error message from the response body
    throw new Error(error.message);
  }
  const data = await response.json();

  return data;
}

// function to get admin by id
export async function getAdminById(id: string): Promise<IAdmin> {
  const { token } = getSession();
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/admin/${id}`,
    requestOptions,
  );
  if (!response.ok) {
    const error = await response.json(); // Access the error message from the response body
    throw new Error(error.message);
  }
  const { requiredAdmin } = await response.json();

  return requiredAdmin;
}

// function to add new admin
export async function addAdmin(admin: IAdmin): Promise<IAdmin> {
  const { token } = getSession();
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(admin),
  };
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/admin`,
    requestOptions,
  );
  if (!response.ok) {
    const error = await response.json(); // Access the error message from the response body
    throw new Error(error.message);
  }
  const { requiredAdmin } = await response.json();

  return requiredAdmin;
}

// function to get admins
export async function updateAdmin(updatedAdmin: IAdmin): Promise<IAdmin> {
  console.log(updatedAdmin);
  const { token } = getSession();
  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedAdmin),
  };
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/admin/${updatedAdmin._id}`,
    requestOptions,
  );
  if (!response.ok) {
    const error = await response.json(); // Access the error message from the response body
    throw new Error(error.message);
  }
  const { admin } = await response.json();

  return admin;
}

// function to add new admin
export async function changeAdminStatus(status: {
  id: string;
  status: string;
}): Promise<IAdmin> {
  const { token } = getSession();
  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: status.status }),
  };
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/admin/${status.id}`,
    requestOptions,
  );
  if (!response.ok) {
    const error = await response.json(); // Access the error message from the response body
    throw new Error(error.message);
  }
  const { requiredAdmin } = await response.json();

  return requiredAdmin;
}
