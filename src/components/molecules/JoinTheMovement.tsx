import React from "react";
import { FaTrash, FaUniversity, FaPeopleCarry } from "react-icons/fa";

const movements = [
  {
    icon: <FaTrash className="text-green-600 text-2xl" />,
    title: "Smart Waste Management",
    description:
      "Revolutionizing waste disposal with SmartBin technology, automatic sorting, and real-time tracking to maximize recycling efficiency.",
  },
  {
    icon: <FaUniversity className="text-green-600 text-2xl" />,
    title: "Earn While You Recycle",
    description:
      "Gain points, incentives, or savings through the Waste Bank system every time you recycle — while helping your community stay clean.",
  },
  {
    icon: <FaPeopleCarry className="text-green-600 text-2xl" />,
    title: "Collective Clean-Up Impact",
    description:
      "Act together for quick response: get hotspot alerts, join Crowd Action events, and witness the tangible impact of your contributions.",
  },
];

const JoinTheMovement: React.FC = () => {
  return (
    <section className="w-full bg-green-200 py-16 px-6">
      <div className="max-w-7xl px-6 py-10 mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Left - Text & Points */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Join the Movement
          </h2>
          <p className="text-gray-600 mb-8">
            Waste is not just an environmental issue — it’s a shared responsibility. 
            Join ZeroTrace to create a cleaner, healthier, and more sustainable future.
          </p>

          <div className="flex flex-col gap-6">
            {movements.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-green-800">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 text-justify">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Image */}
        <div className="w-full md:w-1/2">
          <img
            src="/assets/img/joinOurMovement.png"
            alt="Join the Movement"
            className="rounded-xl object-cover w-full h-full max-h-[400px]"
          />
          <p className="text-sm text-gray-500 mt-3 text-justify">
            “We believe change starts with each individual. 
            With ZeroTrace, you can dispose of waste wisely, 
            gain rewards, and be part of a powerful movement to clean our cities.”
          </p>
        </div>
      </div>
    </section>
  );
};

export default JoinTheMovement;
