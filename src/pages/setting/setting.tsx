import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
// import { getSession } from "@/services/session";
import { getSettings } from "@/services/settingServices";

import PircePlan from "./tabs/price_plan";
import Loading from "@/components/loader";
import Error from "@/components/error-display";

// setting types
type TCategory = "Product Box" | "Buyer Subscription" | "Referral Code";
type Ttype = "Monthly" | "Yearly" | "One-Time";

export interface ISetting {
  [ket: string]: { category: TCategory; price: number; type: Ttype }[];
}

export const Settings = () => {
  // const { userRole } = getSession();

  // fetch products
  const {
    data: settings,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });
  return (
    <div className="flex-1 rounded-lg border border-dashed px-4 py-4 shadow-sm">
      {!isLoading && !isError && settings ? (
        <Tabs
          defaultValue="pricePlan"
          className="mx-auto my-auto sm:w-[100%] lg:w-[60%]"
        >
          <TabsList className="grid w-full grid-cols-4 gap-4">
            <TabsTrigger value="pricePlan">Price Plans</TabsTrigger>
            <TabsTrigger value="pricePlan2">Price Plans2</TabsTrigger>
            {/* {userRole === "Super Admin" && (
              <>
                <TabsTrigger value="membership">Initial Payment</TabsTrigger>
                <TabsTrigger value="monthly">Monthly Payment</TabsTrigger>
                <TabsTrigger value="status">System Payment Status</TabsTrigger>
              </>
            )} */}
          </TabsList>
          <TabsContent value="pricePlan">
            <PircePlan />
          </TabsContent>

          {/* {userRole === "Super Admin" && (
            <>
              
              <TabsContent value="monthly">
                <MonthlyPayment amount={amount} />
              </TabsContent>
              <TabsContent value="status">
                <PaymentStatus status={status} />
                <IosStatusChange status={iosStatus} />
              </TabsContent>
            </>
          )} */}
        </Tabs>
      ) : (
        <div className="flex h-full items-center justify-center">
          <Loading isLoading={isLoading} />
          <Error error={error} />
        </div>
      )}
    </div>
  );
};
