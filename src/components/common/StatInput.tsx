import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'

interface StatInputProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
}

export const StatInput = ({ value, onChange, min, max }: StatInputProps) => {
  const [inputValue, setInputValue] = useState(value.toString())
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isFocused) {
      setInputValue(value.toString())
    }
  }, [value, isFocused])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    
    if (newValue === '' || /^\d+$/.test(newValue)) {
      setInputValue(newValue)
      
      if (newValue !== '') {
        const numValue = parseInt(newValue, 10)
        if (!isNaN(numValue) && numValue >= min && numValue <= max) {
          onChange(numValue)
        }
      }
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    
    const numValue = parseInt(inputValue, 10)
    if (isNaN(numValue) || inputValue === '') {
      setInputValue(value.toString())
    } else if (numValue < min) {
      onChange(min)
      setInputValue(min.toString())
    } else if (numValue > max) {
      onChange(max)
      setInputValue(max.toString())
    } else {
      onChange(numValue)
      setInputValue(numValue.toString())
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    setTimeout(() => {
      inputRef.current?.select()
    }, 0)
  }

  return (
    <div className="relative">
      <div className="text-2xl font-bold text-center mb-1">{value}</div>
      <Input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className="w-full text-center"
      />
    </div>
  )
}