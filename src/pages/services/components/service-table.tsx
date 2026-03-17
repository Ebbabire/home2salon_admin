import { useQuery } from "@tanstack/react-query";
import { getServicesByCategory } from "@/services/serviceServices";
import Loading from "@/components/loader";
import Error from "@/components/error-display";
import AddService from "./add-service";
import { ServiceDataTable } from "./service-data-table";
import useServiceColumns from "../Columns";

interface ServiceTableProps {
  categoryId: string;
}

const ServiceTable = ({ categoryId }: ServiceTableProps) => {
  const columns = useServiceColumns();

  const {
    data: services,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["services", categoryId],
    queryFn: () => getServicesByCategory(categoryId),
    enabled: !!categoryId,
  });

  if (isLoading || isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading isLoading={isLoading} />
        <Error error={error} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Services</h2>
        <AddService categoryId={categoryId} />
      </div>
      {services && services.length > 0 ? (
        <ServiceDataTable columns={columns} data={services} />
      ) : (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          No services in this category
        </div>
      )}
    </div>
  );
};

export default ServiceTable;
