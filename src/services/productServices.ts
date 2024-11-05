import { getSession } from "./session";

import { type IProduct } from "@/pages/products/products";

// function to get products
export async function getProducts(): Promise<IProduct[]> {
  const { token } = getSession();

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/product/admin`,
    requestOptions,
  );
  if (!response.ok) {
    const error = await response.json(); // Access the error message from the response body
    throw new Error(error.message);
  }
  const { products } = await response.json();

  return products;
}

// function to get product by id
export async function getProductById(
  id: string | undefined,
): Promise<IProduct> {
  const { token } = getSession();

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/product/readByAdmin/${id}`,
    requestOptions,
  );
  if (!response.ok) {
    const error = await response.json(); // Access the error message from the response body
    throw new Error(error.message);
  }
  const { product } = await response.json();

  return product;
}
// function to get products
export async function changeProdStatus(prod: {
  status: string;
  id: string | undefined;
  prodId: string;
}): Promise<IProduct> {
  const { token } = getSession();

  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productID: prod.id }),
  };
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/productBox/${prod.prodId}/changeActiveProduct`,
    requestOptions,
  );
  if (!response.ok) {
    const error = await response.json(); // Access the error message from the response body
    throw new Error(error.message);
  }
  const { product } = await response.json();

  return product;
}
