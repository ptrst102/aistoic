import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";

interface StatInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

export const StatInput = ({ value, onChange, min, max }: StatInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // フォーカス中はlocalValueを使い、それ以外はvalueを表示
  const displayValue = isFocused ? localValue : value.toString();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (newValue === "" || /^\d+$/.test(newValue)) {
      setLocalValue(newValue);

      if (newValue !== "") {
        const numValue = Number.parseInt(newValue, 10);
        if (!Number.isNaN(numValue) && numValue >= min && numValue <= max) {
          onChange(numValue);
        }
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);

    const numValue = Number.parseInt(localValue, 10);
    if (Number.isNaN(numValue) || localValue === "") {
      setLocalValue(value.toString());
    } else if (numValue < min) {
      onChange(min);
    } else if (numValue > max) {
      onChange(max);
    } else {
      onChange(numValue);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setLocalValue(value.toString());
    // Reactイベントハンドラ内で直接selectを呼ぶ
    e.target.select();
  };

  return (
    <div className="flex flex-col">
      <div className="text-2xl font-bold text-center mb-1">{value}</div>
      <Input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className="text-center"
      />
    </div>
  );
};
