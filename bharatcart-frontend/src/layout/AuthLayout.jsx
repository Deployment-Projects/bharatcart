export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 px-4">
      
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-10">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-500 mt-2">{subtitle}</p>
        </div>

        {children}

      </div>
    </div>
  );
}