import { 
  FaShippingFast,
  FaMoneyBillWave,
  FaUndo,
  FaShieldAlt,
  FaHeadphones
} from "react-icons/fa";

const TrustStrip = () => {
  const items = [
    {
      icon: <FaShippingFast />,
      title: "Free Shipping",
      subtitle: "On orders above ₹999"
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Cash on Delivery",
      subtitle: "Available across India"
    },
    {
      icon: <FaUndo />,
      title: "Easy Returns",
      subtitle: "7 days return policy"
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Payments",
      subtitle: "100% safe & secure"
    },
    {
      icon: <FaHeadphones />,
      title: "24/7 Support",
      subtitle: "We're here to help"
    }
  ];

  return (
    <div className="w-full">

      {/* ✅ FIX 1: SAME WIDTH AS CATEGORY */}
      <div className="max-w-[1385px] mx-auto px-4">

        {/* ✅ FIX 2: TEMPLATE BACKGROUND */}
        <div className="bg-[#efe3d3] rounded-xl px-6 py-2">

          {/* ✅ FIX 3: USE GRID (NOT FLEX) */}
          <div className="grid grid-cols-5 items-center">

            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 justify-center">

                {/* ✅ FIX 4: ICON STYLE */}
                <div className="
                  w-9 h-9 
                  flex items-center justify-center 
                  rounded-full 
                  bg-white 
                  text-[#c58b2a] 
                  text-[16px]
                  shadow-sm
                ">
                  {item.icon}
                </div>

                {/* TEXT */}
                <div className="leading-tight">
                  <p className="text-[14px] font-semibold text-gray-800">
                    {item.title}
                  </p>
                  <p className="text-[12px] text-gray-500">
                    {item.subtitle}
                  </p>
                </div>

              </div>
            ))}

          </div>

        </div>
      </div>
    </div>
  );
};

export default TrustStrip;