import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import type { IOrder, IProfessional } from "@/types";
import StatusBadge from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const useAssignedColumns = () => {
  const navigate = useNavigate();

  const columns: ColumnDef<IOrder, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "customer",
        header: "Customer",
        cell: ({ row }) => (
          <div className="capitalize">{row.original.customer.fullName}</div>
        ),
      },
      {
        id: "professional",
        header: "Professional",
        cell: ({ row }) => {
          const pro = row.original.professional;
          if (!pro) return <span className="text-muted-foreground">—</span>;
          const name =
            typeof pro === "string" ? pro : (pro as IProfessional).fullName;
          return <div className="capitalize">{name}</div>;
        },
      },
      {
        id: "services",
        header: "Services",
        cell: ({ row }) => {
          const names = row.original.services.map((s) =>
            typeof s.service === "string" ? s.service : s.service.name,
          );
          return (
            <div className="max-w-[200px] truncate">{names.join(", ")}</div>
          );
        },
      },
      {
        accessorKey: "scheduledDate",
        header: "Scheduled",
        cell: ({ row }) => (
          <div className="text-sm">
            {moment(row.original.scheduledDate).format("ll")}{" "}
            {row.original.scheduledTime}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => navigate(`/orders/${row.original._id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [navigate],
  );

  return columns;
};

export default useAssignedColumns;
