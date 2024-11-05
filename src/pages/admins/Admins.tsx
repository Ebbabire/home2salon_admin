import { useContext } from "react";
import useQuery from "@/hooks/useQuery";
import ListDataContext, { type Payload } from "@/context/ListDataStore";

import Admin from "./component/detaile-page";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import useColumns from "./Column";
import { getAdmins } from "@/services/adminServices";
import Loading from "@/components/loader";
import Error from "@/components/error-display";
import AddAdmin from "./component/add-admin";

export type Admin = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
  createdAt?: string;
};

export const Admins = () => {
  const columns = useColumns();
  const {
    admins,
    setAdmins,
  }: { admins: Admin[]; setAdmins: (payload: Payload) => void } =
    useContext(ListDataContext);

  const { data, isLoading, isError, error } = useQuery(getAdmins, {
    onSuccess: (data) => setAdmins(data),
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Admins</h1>
        {!isLoading && !isError && admins.length ? <AddAdmin /> : null}
      </div>
      <div className="flex-1 rounded-lg border border-dashed px-4 py-4 shadow-sm dark:border-muted-foreground/70">
        {!isLoading && !isError && data ? (
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
