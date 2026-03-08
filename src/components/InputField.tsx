interface InputFieldProps {
  label: string
  type: string
  name?: string
  placeholder?: string
  required?: boolean
  className?: string
}

export default function InputField({
  label,
  type,
  name,
  placeholder,
  required = false,
  className = "",
}: InputFieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
      />
    </div>
  )
}