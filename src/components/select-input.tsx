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
  name: string;
  className: string;
};

const SelectInput = ({
  options,
  setValue,
  label,
  value,
  placeholder,
  name,
  className,
}: SelectInpuPorp) => {
  return (
    <Select onValueChange={(value) => setValue(name, value)} value={value}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={`${className}`}>
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
