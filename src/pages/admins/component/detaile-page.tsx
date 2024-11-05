import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getAdminById } from "@/services/adminServices";

import { getSession } from "@/services/session";

import EditAdmin from "./edit-admin";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import Loading from "@/components/loader";
import Error from "@/components/error-display";

export default function AdminDetail({
  id,
  close,
}: {
  id: string;
  close: () => void;
}) {
  const user = getSession();
  const {
    data: admin,
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ["admin", id], queryFn: () => getAdminById(id) });
  return (
    <>
      {(isLoading || isError) && (
        <div className="flex h-full w-full items-center justify-center">
          <Loading isLoading={isLoading} />
          <Error error={error} />
        </div>
      )}
      {!isLoading && !isError && admin && (
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                {admin?.fullName}
              </CardTitle>
              <CardDescription>{admin?.role}</CardDescription>
            </div>

            {admin.role === "Super Admin" ? (
              <>
                {user.userRole === "Super Admin" && (
                  <div className="ml-auto flex items-center gap-2 text-green-600">
                    <EditAdmin admin={admin} />
                  </div>
                )}
              </>
            ) : (
              <div className="ml-auto flex items-center gap-2 text-green-600">
                <EditAdmin admin={admin} />
              </div>
            )}
          </CardHeader>
          <CardContent className="overflow-auto p-3 text-sm scrollbar-none">
            <div className="flex flex-col gap-3">
              <div className="font-semibold">User Address</div>
              <ul className="flex flex-col gap-3">
                <li className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Phone Number</span>
                  <span className="font-medium">0{admin?.phoneNumber}</span>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{admin?.email}</span>
                </li>
              </ul>
              <Separator className="my-2" />
              <div className="font-semibold">Admin Details</div>
              <ul className="flex flex-col gap-3">
                <li className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Registed At</span>
                  <span className="font-medium">
                    {moment(admin?.createdAt).format("ll")}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Status</span>
                  <span
                    className={`flex items-center gap-2 font-medium capitalize ${admin?.status === "Active" ? "text-green-600" : "text-red-600"}`}
                  >
                    {admin?.status}{" "}
                    {/* {admin._id !== user.id &&
                      user.userRole === "Super Admin" && (
                        <ChangeAdminStatus
                          id={id}
                          admin={admin}
                          setAdmin={setAdmin}
                        />
                      )} */}
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
            <Button
              variant="ghost"
              className="border border-red-500 px-12 transition-all duration-150 hover:bg-red-500 hover:text-white"
              onClick={close}
            >
              Close
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
