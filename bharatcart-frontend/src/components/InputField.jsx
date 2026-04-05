export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder
}) {
  return (
    <div className="mb-6">
      <label className="block text-gray-600 mb-2 font-medium">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}