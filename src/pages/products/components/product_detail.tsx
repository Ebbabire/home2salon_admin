import { Separator } from "@/components/ui/separator";
import { getProductById } from "@/services/productServices";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import Error from "@/components/error-display";
import Loading from "@/components/loader";
import { Button } from "@/components/ui/button";

import { IoReturnDownBackOutline } from "react-icons/io5";

export const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });
  return (
    <>
      <Button
        variant={"ghost"}
        className="flex gap-2 self-start border-b-2 border-black"
        onClick={() => navigate(-1)}
      >
        <IoReturnDownBackOutline />
        <span>Back</span>
      </Button>
      {isLoading && <Loading isLoading={isLoading} />}
      {isError && !isLoading && <Error error={error} />}
      {!isLoading && !isError && product && (
        <>
          <div className="container mx-auto flex flex-col gap-8 px-4 md:flex-row">
            {/* images */}
            <div className="flex flex-wrap items-center gap-4">
              {product?.image.map((img) => (
                <img src={img} alt="product_image" className="w-52" />
              ))}
            </div>
            {/* ******************************************************************************************************************************************** */}
            {/* ******************************************************************************************************************************************** */}
            {/* product basic information */}
            <div className="order-1 flex basis-1/2 flex-col gap-1 md:order-3 md:gap-4">
              <div className="flex items-center gap-4 lg:gap-8">
                <h3 className="text-lg font-bold text-[#16432d] md:text-2xl lg:text-3xl xl:text-4xl">
                  {product?.name}
                </h3>
                <span
                  className={`rounded-full border border-[#16432d] bg-[#16432d]/30 px-4 py-2 text-sm font-bold`}
                >
                  {product?.status}
                </span>
              </div>

              <div className="flex items-center text-[#60432d]">
                <span>
                  ETB{" "}
                  <span className="md:text-2xl lg:text-3xl">
                    {product?.price}
                  </span>
                </span>
                <Separator
                  orientation="vertical"
                  className="mx-4 h-8 w-[1px] rounded-full bg-[#60432d] xl:w-[2px]"
                />
                <span className="lg:text-lg">
                  {product?.location?.address
                    ? product?.location?.address
                    : "--no location info--"}
                </span>
              </div>
              <div className="flex items-center text-[#60432d]">
                <span className="text-lg">{product?.size}</span>
                <Separator
                  orientation="vertical"
                  className="mx-4 h-8 w-[2px] rounded-full bg-[#60432d]"
                />
                <span className="text-sm lg:text-base">
                  {product?.color ? product?.color : "--no color info--"}
                </span>
              </div>

              <div className="space-x-4 self-end">
                <span
                  className={`self-end rounded-full border border-[#16432d] bg-[#16432d]/30 px-4 py-2 text-sm font-bold`}
                >
                  {product?.condition}
                </span>
              </div>
              <Separator />
              <p>
                {product?.shortDescription
                  ? product?.shortDescription
                  : "--no short description--"}
              </p>
            </div>
          </div>
          <div className="container mx-auto flex justify-end gap-4 px-12">
            {/* accept dialog btn */}
            {/* reject dialog btn */}
          </div>
          {/* ******************************************************************************************************************************************** */}
          {/* ******************************************************************************************************************************************** */}
          {/* product detail description section */}
          <div className="relative my-12 bg-[#d3c5aa]">
            <div
              className={`container mx-auto flex flex-col gap-6 px-12 py-24`}
            >
              <h1 className="text-4xl font-bold text-[#16432d]">Descrption</h1>
              <p>{product?.description}</p>
            </div>
          </div>
        </>
      )}
    </>
  );
};
