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
    `${import.meta.env.VITE_API_URL}/api/v1/admin/login`,
    requestOptions,
  );
  if (!response.ok) {
    const error = await response.json(); // Access the error message from the response body
    throw new Error(error.message);
  }
  const data = await response.json();

  if (data.token) {
    sessionStorage.setItem("token", JSON.stringify(data.token));
    sessionStorage.setItem("id", JSON.stringify(data.admin._id));
    sessionStorage.setItem(
      "userName",
      JSON.stringify(`${data.admin.firstName} ${data.admin.lastName}`),
    );
    sessionStorage.setItem("userRole", JSON.stringify(data.admin.role));
  }

  return data;
};

// function to get admins
export async function getAdmins() {
  // const { token } = getSession();
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2M2M4ZDJlZGQ3MWUxMmQyODQyYTdhMCIsImlhdCI6MTcxNzU4MDAwNCwiZXhwIjoxNzE4NDQ0MDA0fQ.Zrfli-fFAbmpFe-w-XM-Oa_goy6fJ-_Ro7lWdI53E8Q";
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    `https://iconscholar.com/backend/api/v1/admin`,
    requestOptions,
  );
  if (!response.ok) {
    const error = await response.json(); // Access the error message from the response body
    throw new Error(error.message);
  }
  const data = await response.json();

  return data;
}
