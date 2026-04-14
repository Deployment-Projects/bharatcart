const categories = [
    "Earrings",
    "Necklaces",
    "Rings",
    "Bracelets",
    "Mangalsutra",
    "Anklets",
    "Hair Accessories",
    "Combo Sets"
  ];
  
  const CategoryStrip = () => {
    return (
      <div className="max-w-[1400px] mx-auto mt-4 px-2">
  
        <div className="flex gap-4 overflow-x-auto pb-2">
  
          {categories.map((cat, index) => (
            <div
              key={index}
              className="min-w-[140px] bg-white rounded-xl shadow-sm p-4 text-center hover:shadow-md transition cursor-pointer"
            >
              <div className="h-12 bg-gray-100 rounded-md mb-2"></div>
              <p className="text-sm font-medium">{cat}</p>
            </div>
          ))}
  
        </div>
  
      </div>
    );
  };
  
  export default CategoryStrip;