import { Admin } from "@/pages/admins/Admins";
import { getSession } from "./session";

import { Login } from "@/pages/login/Login";

// login service
export const login = async (authDetail: Login) => {
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
export async function getAdmins() {
  const { token } = getSession();

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/admin/`,
    requestOptions,
  );
  if (!response.ok) {
    const error = await response.json(); // Access the error message from the response body
    throw new Error(error.message);
  }
  const data = await response.json();

  return data;
}

// function to get an admin
export async function getAdminById(id: string): Promise<Admin> {
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
  const { admin } = await response.json();

  return admin;
}

// function to add a new admins
export async function addAdmin(admin: Admin): Promise<Admin> {
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
  const {
    data: { newAdmin },
  } = await response.json();

  return newAdmin;
}

// function to update admin's info
export async function updateAdmin(updatedAdmin: Admin): Promise<Admin> {
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
  const data = await response.json();

  return data;
}
