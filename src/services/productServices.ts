import { type IProduct } from "@/pages/products/products";

// function to get product by id
export async function getProducts(): Promise<IProduct[]> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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
  const { product } = await response.json();

  return product;
}
// function to get product by id
export async function getProductById(
  id: string | undefined,
): Promise<IProduct> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/product/admin/${id}`,
    requestOptions,
  );
  if (!response.ok) {
    const error = await response.json(); // Access the error message from the response body
    throw new Error(error.message);
  }
  const { product } = await response.json();

  return product;
}
