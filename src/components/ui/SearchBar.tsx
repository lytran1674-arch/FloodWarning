import { Search } from "lucide-react";
import { Input } from "./Input";

interface Props {
  value: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, onKeyDown, placeholder }: Props) => {
  return (
    <Input
      id="search"
      type="text"
      icon={Search}
      value={value ?? ""}
       onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder ?? "Tìm kiếm..."}
      className="w-full border rounded-md mb-1 px-4 py-2 outline-none focus:border-blue-500"
    />
  );
};