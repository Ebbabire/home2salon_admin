import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../admins/data-table";
import Loading from "@/components/loader";
import Error from "@/components/error-display";

const Influencers = () => {
  // table column config
  const columns = useColumns();

  // fetch products
  const {
    data: influencers,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admins"],
    queryFn: getInfluencers,
  });
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Influencers</h1>
      </div>
      <div className="flex-1 rounded-lg border border-dashed px-4 py-4 shadow-sm dark:border-muted-foreground/70">
        {!isLoading && !isError && influencers ? (
          <>
            {Influencers.length ? (
              <DataTable columns={columns} data={influencers} />
            ) : (
              <div className="flex h-full flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-1 text-center">
                  <h3 className="text-2xl font-bold tracking-tight">
                    There are no products
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

export default Influencers;
