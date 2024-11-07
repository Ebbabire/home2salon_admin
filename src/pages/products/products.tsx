import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/productServices";

import { DataTable } from "./data_table";
import useColumns from "./column";

import Loading from "@/components/loader";
import Error from "@/components/error-display";

export interface IProduct {
  _id?: string;
  name: string;
  price?: number;
  image: string[];
  seller?: string;
  shortDescription?: string;
  description?: string;
  location?: { coordinates: [number, number]; address: string; type: "Point" };
  status?: string;
  productBox?: string;
  brand?: string;
  condition?: "New" | "Old";
  size?: string;
  color?: string;
  category: string;
  createdAt?: Date;
}

export const Products = () => {
  // table column config
  const columns = useColumns();

  // fetch products
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
      </div>
      <div className="flex-1 rounded-lg border border-dashed px-4 py-4 shadow-sm dark:border-muted-foreground/70">
        {!isLoading && !isError && products ? (
          <>
            {products.length ? (
              <DataTable columns={columns} data={products} />
            ) : (
              <div className="flex h-full flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-1 text-center">
                  <h3 className="text-2xl font-bold tracking-tight">
                    There are no products found.
                  </h3>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <Loading isLoading={isLoading} />
            <Error error={error} />
          </div>
        )}
      </div>
    </>
  );
};
