import { motion } from "framer-motion";
import { useState } from "react";

const StyleFinder = ({ onSelect }) => {

  const [selected, setSelected] = useState(null);

  const options = [
    { label: "Traditional", emoji: "👑" },
    { label: "Modern", emoji: "✨" },
    { label: "Party", emoji: "🎉" },
    { label: "Wedding", emoji: "💍" }
  ];

  const handleSelect = (option) => {
    setSelected(option);
    onSelect(option.toLowerCase());
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mt-8">

      <h2 className="text-xl font-semibold mb-4">
        Find Your Perfect Style ✨
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {options.map((opt) => (
          <motion.div
            key={opt.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(opt.label)}
            className={`cursor-pointer p-4 rounded-lg border text-center ${
              selected === opt.label
                ? "bg-yellow-400 text-black"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            <div className="text-2xl">{opt.emoji}</div>
            <div className="mt-2 font-medium">{opt.label}</div>
          </motion.div>
        ))}

      </div>
    </div>
  );
};

export default StyleFinder;