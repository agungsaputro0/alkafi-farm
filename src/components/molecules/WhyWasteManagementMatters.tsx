import React from "react";
import {
  FaRecycle,
  FaLeaf,
  FaSmog,
  FaTrashAlt,
  FaSeedling,
  FaHandHoldingHeart,
} from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const reasons = [
  {
    icon: <FaRecycle className="text-green-400 text-4xl mb-4" />,
    title: "Resource Conservation",
    description:
      "Proper waste management enables recycling and reuse, reducing the need for raw materials.",
  },
  {
    icon: <FaSmog className="text-gray-300 text-4xl mb-4" />,
    title: "Pollution Reduction",
    description:
      "Reduces land, air, and water pollution by controlling waste disposal and emissions.",
  },
  {
    icon: <FaLeaf className="text-lime-300 text-4xl mb-4" />,
    title: "Environmental Protection",
    description:
      "Helps protect ecosystems and wildlife from harmful effects of improper waste handling.",
  },
  {
    icon: <FaTrashAlt className="text-yellow-300 text-4xl mb-4" />,
    title: "Efficient Disposal",
    description:
      "Smart waste management ensures timely and safe disposal, avoiding overflow and hazards.",
  },
  {
    icon: <FaSeedling className="text-emerald-300 text-4xl mb-4" />,
    title: "Sustainable Cities",
    description:
      "Clean and well-managed cities promote health, tourism, and long-term livability.",
  },
  {
    icon: <FaHandHoldingHeart className="text-pink-300 text-4xl mb-4" />,
    title: "Public Health",
    description:
      "Reduces disease spread by minimizing exposure to unmanaged waste and harmful substances.",
  },
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 768, settings: { slidesToShow: 1 } },
  ],
  appendDots: (dots: React.ReactNode) => (
    <div className="mt-6">
      <ul className="flex justify-center gap-2">{dots}</ul>
    </div>
  ),
  customPaging: () => (
    <div className="w-3 h-3 bg-white/30 rounded-full hover:bg-white transition" />
  ),
};

const WhyWasteManagementMatters: React.FC = () => {
  return (
    <div className="w-full mt-20 px-6 py-12 bg-neutral-900 shadow-xl text-white">
      <h2 className="text-2xl font-extrabold mb-3 text-greentech text-center">
        Why Waste Management Matters
      </h2>
      <p className="text-center text-neutral-300 mb-8 max-w-xl mx-auto">
        Proper waste handling is key to a sustainable, healthy, and resilient future for everyone.
      </p>

      <Slider className="mx-10" {...settings}>
        {reasons.map((reason, index) => (
          <div key={index} className="p-4">
            <div className="bg-white/10 hover:bg-white/20 transition rounded-xl shadow p-6 h-full flex flex-col items-center text-center">
              {reason.icon}
              <h3 className="text-md font-semibold text-white mb-2">{reason.title}</h3>
              <p className="text-sm text-neutral-300">{reason.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default WhyWasteManagementMatters;
