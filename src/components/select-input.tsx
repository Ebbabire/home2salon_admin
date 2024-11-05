import { UseFormSetValue } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export type OptionPorp = { value: string; name: string }[];
export type SelectInpuPorp = {
  options: OptionPorp;
  label: string;
  value: string;
  setValue: UseFormSetValue<any>;
  placeholder: string;
};

const SelectInput = ({
  options,
  setValue,
  label,
  value,
  placeholder,
}: SelectInpuPorp) => {
  return (
    <Select onValueChange={(value) => setValue("role", value)} value={value}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map(({ value, name }: { value: string; name: string }) => (
            <SelectItem key={name} value={value}>
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectInput;
