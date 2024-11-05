import { getSession } from "./session";

import { type TInfluencer } from "@/pages/products/products";

// function to get products
export async function getProducts(): Promise<TInfluencer[]> {
  const { token } = getSession();

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/product/filter`,
    requestOptions,
  );
  if (!response.ok) {
    const error = await response.json(); // Access the error message from the response body
    throw new Error(error.message);
  }
  const data = await response.json();

  return data;
}
