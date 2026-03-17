import { useQuery } from "@tanstack/react-query";
import { getWalletBalances } from "@/services/walletServices";
import { getSession } from "@/services/session";
import Loading from "@/components/loader";
import Error from "@/components/error-display";
import { WalletDataTable } from "./data-table";
import useWalletColumns from "./Columns";

export const Wallet = () => {
  const { userRole } = getSession();
  const columns = useWalletColumns();

  const {
    data: balances,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["walletBalances"],
    queryFn: getWalletBalances,
    enabled: userRole === "Super Admin",
  });

  if (userRole !== "Super Admin") {
    return (
      <div className="flex h-full items-center justify-center">
        <h3 className="text-lg text-muted-foreground">
          Only Super Admin can access wallet management.
        </h3>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl">
        Wallet Management
      </h1>
      <div className="flex-1 rounded-lg border border-dashed px-4 py-4 shadow-sm">
        {isLoading || isError ? (
          <div className="flex h-full items-center justify-center">
            <Loading isLoading={isLoading} />
            <Error error={error} />
          </div>
        ) : balances && balances.length > 0 ? (
          <WalletDataTable columns={columns} data={balances} />
        ) : (
          <div className="flex h-full flex-1 items-center justify-center">
            <h3 className="text-lg text-muted-foreground">
              No wallet data available
            </h3>
          </div>
        )}
      </div>
    </>
  );
};
