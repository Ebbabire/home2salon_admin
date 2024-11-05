import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const ProdDetailLoading = () => {
  return (
    <>
      <div className="container mx-auto flex flex-col gap-8 px-4 md:flex-row">
        <div className="order-2 flex flex-col items-start gap-4 lg:h-[25rem] xl:mx-12 xl:h-[30rem] xl:flex-row 2xl:mx-32">
          <div className="flex gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className={`h-[5rem] w-[5rem] object-cover sm:h-[10rem] sm:w-[10rem] md:h-[5rem] md:w-[5rem] lg:h-[8rem] lg:w-[8rem] xl:h-[8rem] xl:w-[10rem]`}
              />
            ))}
          </div>
        </div>
        {/* ******************************************************************************************************************************************** */}
        {/* ******************************************************************************************************************************************** */}

        {/* product basic information */}
        <div className="order-1 flex basis-1/2 flex-col gap-1 md:order-3 md:gap-4">
          <div className="flex items-center justify-between gap-4 lg:gap-8">
            <Skeleton className="w-[20rem] py-5 text-lg font-bold text-[#16432d] md:text-2xl lg:text-3xl xl:text-4xl" />
            <Skeleton className="w-6 py-4" />
          </div>
          <div className="flex items-center text-[#60432d]">
            <Skeleton className="w-32 py-3 text-lg font-bold" />
            <Separator
              orientation="vertical"
              className="mx-4 h-8 w-[1px] rounded-full bg-[#60432d] xl:w-[2px]"
            />
            <Skeleton className="w-32 py-3 text-lg font-bold" />
          </div>
          <div className="flex items-center text-[#60432d]">
            <Skeleton className="w-32 py-3 text-lg font-bold" />

            <Separator
              orientation="vertical"
              className="mx-4 h-8 w-[2px] rounded-full bg-[#60432d]"
            />
            <Skeleton className="w-32 py-3 text-lg font-bold" />
          </div>

          <Skeleton
            className={`self-end rounded-full px-8 py-3 text-sm font-bold`}
          />

          <Separator />
          <Skeleton className="w-32 py-3 text-lg font-bold" />
        </div>
      </div>

      {/* ******************************************************************************************************************************************** */}
      {/* ******************************************************************************************************************************************** */}

      {/* product detail description section */}
      <div className="my-12 bg-[#d3c5aa]">
        <div className="container mx-auto flex flex-col gap-6 px-12 py-24">
          <Skeleton className="w-56 py-4 text-4xl font-bold text-[#16432d]" />
          <div className="flex flex-col gap-2">
            <Skeleton className="w-full py-4 text-4xl font-bold text-[#16432d]" />
            <Skeleton className="w-full py-4 text-4xl font-bold text-[#16432d]" />
            <Skeleton className="w-[50%] py-4 text-4xl font-bold text-[#16432d]" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProdDetailLoading;
