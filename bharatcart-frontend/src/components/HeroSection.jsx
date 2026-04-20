import banner from "../assets/banner2.png";

const HeroSection = () => {
  return (
    <div className="w-full">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* 🔥 HERO CONTAINER */}
        <div className="relative w-full h-[420px] rounded-2xl overflow-hidden">

          {/* ✅ BANNER IMAGE */}
          <img
            src={banner}
            alt="Banner"
            className="w-full h-full object-cover block"
          />

          {/* 🔥 CLICKABLE BUTTON (EXACT POSITION)
          <button
            className="
              absolute 
              left-[120px] 
              top-[240px] 
              bg-[#c58b2a] 
              text-white 
              px-6 py-3 
              rounded-full 
              font-medium 
              shadow-lg 
              hover:scale-105 
              transition
            "
          >
            Shop Now →
          </button> */}

        </div>

      </div>
    </div>
  );
};

export default HeroSection;