import { useState, useRef, useEffect } from "react"
import { Plus } from "lucide-react"

export default function ProfilePromptInput({ label, value, icon, onChange }) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value || "")
  const inputRef = useRef(null)

  useEffect(() => {
    setTempValue(value || "")
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = () => {
    onChange(tempValue)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      setTempValue(value || "")
      setIsEditing(false)
    }
  }

  return (
    <div className="flex items-start gap-4 py-3 group relative select-none">
      <div className="text-gray-500 mt-1 shrink-0">{icon}</div>

      <div className="flex-1 border-b border-gray-200 pb-2.5 min-h-[46px] flex flex-col justify-center">
        {isEditing ? (
          <div className="flex items-center w-full">
            <input
              ref={inputRef}
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              placeholder={`Add ${label.toLowerCase()}...`}
              className="w-full text-sm font-semibold text-gray-800 focus:outline-none bg-transparent"
            />
          </div>
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="cursor-pointer flex items-center justify-between w-full hover:bg-gray-50/70 p-1 -m-1 rounded-lg transition"
          >
            {value ? (
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  {label}
                </p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
              </div>
            ) : (
              <span className="text-sm font-medium text-gray-500 hover:text-gray-900 transition flex items-center gap-1.5 w-full justify-between">
                <span>{label}</span>
                <span className="text-gray-300 group-hover:text-gray-500 transition mr-1">
                  <Plus size={14} className="stroke-[3]" />
                </span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
