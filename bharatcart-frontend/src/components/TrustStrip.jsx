const items = [
  { title: "Free Shipping" },
  { title: "Cash on Delivery" },
  { title: "Easy Returns" },
  { title: "Secure Payments" },
  { title: "24/7 Support" }
];

const TrustStrip = () => {
  return (
    <div className="max-w-[1400px] mx-auto mt-6">

      <div className="bg-[#f5e6d3] rounded-xl p-4 flex justify-between text-sm">

        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 bg-white rounded-full mb-2"></div>
            <p className="text-center">{item.title}</p>
          </div>
        ))}

      </div>

    </div>
  );
};

export default TrustStrip;