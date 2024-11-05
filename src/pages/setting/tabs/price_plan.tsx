import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/services/settingServices";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import SettingForm from "../components/setting_form";

const PircePlan = () => {
  // get category list
  const { data: setting } = useQuery({
    queryKey: ["price-plans"],
    queryFn: getSettings,
  });
  return (
    <div>
      <Card className="mt-2 py-4">
        <CardContent>
          <SettingForm />
        </CardContent>
      </Card>
      <Card className="mt-2 py-4">
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-1 px-12 py-2 text-lg font-bold">
          <span>Category</span>
          <span>Type</span>
          <span>Price</span>
        </CardHeader>
        <Separator className="mx-auto w-[90%]" />
        {setting && (
          <CardContent>
            {Object.keys(setting).length > 0 &&
              Object.keys(setting).map((prod) => (
                <>
                  <ul className="px-12">
                    {setting[prod].map((set, i) => (
                      <li
                        key={i}
                        className="flex flex-row items-center justify-between gap-4 space-y-1 py-2"
                      >
                        <span>{set.category}</span>
                        <span>{set.type}</span>
                        <span>{set.price}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default PircePlan;
