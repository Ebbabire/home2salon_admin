import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

export type SelectOption = { value: string; name: string }

interface SelectInputProps {
  options: SelectOption[]
  label: string
  value: string
  onValueChange: (value: string) => void
  placeholder: string
}

const SelectInput = ({
  options,
  label,
  value,
  onValueChange,
  placeholder,
}: SelectInputProps) => {
  return (
    <Select onValueChange={onValueChange} value={value} >
      <SelectTrigger className="w-[100%]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.name} value={option.value}>
              {option.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectInput
