import { type ISetting } from "@/pages/setting/setting";
import { getSession } from "./session";

// function to get orice plan settings
export async function getSettings(): Promise<ISetting> {
  const { token } = getSession();

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/setting`,
    requestOptions,
  );
  if (!response.ok) {
    const error = await response.json(); // Access the error message from the response body
    throw new Error(error.message);
  }
  const data = await response.json();

  return data;
}

// function to add price plan to setting
export async function addSetting(setting: {
  category: string;
  type: string;
  price: number;
}) {
  const { token } = getSession();

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(setting),
  };
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/setting/price`,
    requestOptions,
  );
  if (!response.ok) {
    const error = await response.json(); // Access the error message from the response body
    throw new Error(error.message);
  }
  const data = await response.json();

  return data;
}
