import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MdDelete } from "react-icons/md";

import { Separator } from "@/components/ui/separator";
import { Admin } from "../Admins";
import EditAdmin from "./edit-admin";
import { Edit } from "lucide-react";

export default function AdminDetail({
  user,
  close,
}: {
  user: object | Admin;
  close: () => void;
}) {
  const user2 = {
    email: "ebba.birhanu@gmail.com",
    firstName: "Ebba",
    lastName: "Birhanu",
    password: "123456",
    phoneNumber: "0935287667",
    role: "Admin",
  };
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {user?.firstName} {user?.lastName}
          </CardTitle>
          <CardDescription>{user?.role}</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2 text-green-600 dark:text-green-400">
          <EditAdmin user={user2} />
          <MdDelete
            color="fa3f3f"
            size="1.3rem"
            className="hover:cursor-pointer"
          />
        </div>
      </CardHeader>
      <CardContent className="overflow-auto p-3 text-sm scrollbar-none">
        <div className="flex flex-col gap-3">
          <div className="font-semibold">User Address</div>
          <ul className="flex flex-col gap-3">
            <li className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Phone Number</span>
              <span className="font-medium">0{user?.phoneNumber}</span>
            </li>
            <li className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{user?.email}</span>
            </li>
          </ul>
          <Separator className="my-2" />
          <div className="font-semibold">User Details</div>
          <ul className="flex flex-col gap-3">
            <li className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Registed At</span>
              <span className="font-medium">{user?.createdAt}</span>
            </li>
            <li className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Status</span>
              <span
                className={`flex items-center gap-2 font-medium capitalize ${user?.status === "Active" ? "text-green-600" : "text-red-600"}`}
              >
                {user?.status}{" "}
                <Button variant="ghost" className="h-4 p-0 font-normal">
                  <Edit size={"1rem"} />
                </Button>
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
  );
}
