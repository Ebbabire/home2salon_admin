import { useQuery } from "@tanstack/react-query";
import { getProfessionals } from "@/services/professionalServices";
import Loading from "@/components/loader";
import Error from "@/components/error-display";
import AddProfessional from "./components/add-professional";
import { ProfessionalDataTable } from "./data-table";
import useProfessionalColumns from "./Columns";

export const Professionals = () => {
  const columns = useProfessionalColumns();

  const {
    data: professionals,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["professionals"],
    queryFn: getProfessionals,
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">Professionals</h1>
        {!isLoading && !isError && professionals ? <AddProfessional /> : null}
      </div>
      <div className="flex-1 rounded-xl border bg-card px-4 py-4 shadow-sm">
        {!isLoading && !isError && professionals ? (
          <>
            {professionals.length ? (
              <ProfessionalDataTable columns={columns} data={professionals} />
            ) : (
              <div className="flex h-full flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-1 text-center">
                  <h3 className="text-2xl font-bold tracking-tight">
                    There are no professionals
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    You can add a{" "}
                    <span className="font-semibold">professional</span>.
                  </p>
                  <AddProfessional />
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
