import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import type { IOrder } from "@/types";
import StatusBadge from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecentOrdersTableProps {
  orders: IOrder[];
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

const formatOrderDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return DATE_FORMATTER.format(date);
};

const getOrderServiceNames = (order: IOrder) => {
  return order.services.map((orderedService) => orderedService.service_id.name).join(", ");
};

export const RecentOrdersTable = ({ orders }: RecentOrdersTableProps) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {!orders.length ? (
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
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="capitalize">
                    {order.user_id.full_name ?? "—"}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {getOrderServiceNames(order)}
                  </TableCell>
                  <TableCell>{order.total_price} ETB</TableCell>
                  <TableCell>{formatOrderDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="icon" variant="ghost" className="h-8 w-8">
                      <Link to={`/orders/${order._id}`} aria-label="View order detail">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
