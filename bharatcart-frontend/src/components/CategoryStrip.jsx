import earrings from "../assets/categories/earrings.png";
import necklaces from "../assets/categories/necklace-bg.png";
import rings from "../assets/categories/ring.png";
import bracelets from "../assets/categories/brecelet-bg.png";
import mangalsutra from "../assets/categories/mangalsutra-bg.png";
import anklets from "../assets/categories/anklet-bg.png";
import hair from "../assets/categories/hair.png";
import combo from "../assets/categories/combo-bg.png";
import '../App.css';

const categories = [
  { name: "Earrings", image: earrings },
  { name: "Necklaces", image: necklaces },
  { name: "Rings", image: rings },
  { name: "Bracelets", image: bracelets },
  { name: "Mangalsutra", image: mangalsutra },
  { name: "Anklets", image: anklets },
  { name: "Hair Accessories", image: hair },
  { name: "Combo Sets", image: combo },
];

const CategoryStrip = () => {
  return (
    <div className="w-full">
      <div className="max-w-[1400px] mx-auto px-4">
      {/* <div className="bg-[#f8f8f8] rounded-2xl p-0"> */}
      <div className="bg-[#f8f8f8] rounded-2xl p-2">
          {/* <div className="flex gap-2.5 py-2 overflow-x-auto overflow-y-visible scrollbar-hide scroll-smooth"> */}
          <div className="grid grid-cols-8 gap-3">
            {categories.map((cat, index) => (
              <div
                key={index}
                className="
    bg-white 
    rounded-xl 
    border 
    border-gray-100 
    py-3 px-2
    flex flex-col items-center 
    justify-center 
    hover:shadow-md 
    hover:scale-105
    transition-all
    duration-300
    will-change-transform
    cursor-pointer
    "
              >
                {/* IMAGE */}
                <div className="w-full h-[48px] flex items-center justify-center mb-0 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* TEXT */}
                <p className="text-sm font-medium text-gray-700 text-center">
                  {cat.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryStrip;
