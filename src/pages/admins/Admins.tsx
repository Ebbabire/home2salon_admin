import { DataTable } from "./data-table";
import useColumns from "./Column";
import { getAdmins } from "@/services/adminServices";

import AddAdmin from "./component/add-admin";
import Loading from "@/components/loader";
import Error from "@/components/error-display";
import { useQuery } from "@tanstack/react-query";

export interface IAdmin {
  _id?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "Admin" | "Super Admin";
  status?: string;
  createdAt?: Date;
}

export const Admins = () => {
  const columns = useColumns();

  const {
    data: admins,
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ["admins"], queryFn: getAdmins });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">Admins</h1>
        {!isLoading && !isError && admins ? <AddAdmin /> : null}
      </div>
      <div className="flex-1 rounded-xl border bg-card px-4 py-4 shadow-sm">
        {!isLoading && !isError && admins ? (
          <>
            {admins.length ? (
              <DataTable columns={columns} data={admins} />
            ) : (
              <div className="flex h-full flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-1 text-center">
                  <h3 className="text-2xl font-bold tracking-tight">
                    There are no admins
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    You can add an <span className="font-semibold">admin</span>.
                  </p>
                  <AddAdmin />
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
