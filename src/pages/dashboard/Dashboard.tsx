import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getOrders } from "@/services/orderServices";
import { getProfessionals } from "@/services/professionalServices";
import { getServices } from "@/services/serviceServices";
import {
  PENDING_STATUSES,
  ASSIGNED_STATUSES,
  COMPLETED_STATUSES,
} from "@/types";
import StatusBadge from "@/components/status-badge";
import Loading from "@/components/loader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  Users,
  Scissors,
  Eye,
} from "lucide-react";

export const Dashboard = () => {
  const navigate = useNavigate();

  const { data: orders, isLoading: loadingOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
  const { data: professionals, isLoading: loadingPros } = useQuery({
    queryKey: ["professionals"],
    queryFn: getProfessionals,
  });
  const { data: services, isLoading: loadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const isLoading = loadingOrders || loadingPros || loadingServices;

  const pendingCount =
    orders?.filter((o) => PENDING_STATUSES.includes(o.status)).length ?? 0;
  const assignedCount =
    orders?.filter((o) => ASSIGNED_STATUSES.includes(o.status)).length ?? 0;
  const completedCount =
    orders?.filter((o) => COMPLETED_STATUSES.includes(o.status)).length ?? 0;

  const recentOrders = orders
    ?.slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? "").getTime() -
        new Date(a.createdAt ?? "").getTime(),
    )
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading isLoading />
      </div>
    );
  }

  const stats = [
    {
      title: "Pending Orders",
      value: pendingCount,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      href: "/orders/pending",
    },
    {
      title: "Assigned Orders",
      value: assignedCount,
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/orders/assigned",
    },
    {
      title: "Completed Orders",
      value: completedCount,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
      href: "/orders/completed",
    },
    {
      title: "Professionals",
      value: professionals?.length ?? 0,
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      href: "/professionals",
    },
    {
      title: "Services",
      value: services?.length ?? 0,
      icon: Scissors,
      color: "text-purple-600",
      bg: "bg-purple-50",
      href: "/services",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <Card
            key={s.title}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => navigate(s.href)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.title}
              </CardTitle>
              <div className={`rounded-md p-2 ${s.bg}`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {!recentOrders?.length ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No orders yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => {
                  const names = order.services.map((s) =>
                    typeof s.service === "string"
                      ? s.service
                      : s.service.name,
                  );
                  return (
                    <TableRow key={order._id}>
                      <TableCell className="capitalize">
                        {order.customer.fullName}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {names.join(", ")}
                      </TableCell>
                      <TableCell>{order.totalPrice} ETB</TableCell>
                      <TableCell>
                        {moment(order.createdAt).format("ll")}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => navigate(`/orders/${order._id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
