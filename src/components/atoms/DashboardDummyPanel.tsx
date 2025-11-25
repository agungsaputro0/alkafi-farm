import React from "react";

const DashboardPanels: React.FC = () => {
  return (
    <div className="w-full bg-white/10 backdrop-blur-md rounded-xl shadow p-4 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Panel 1: Waste Bank Partners */}
        <div className="flex items-center p-4 rounded-2xl shadow-lg transition self-stretch
                        bg-white/10 backdrop-blur-md border border-white/20 text-white hover:shadow-xl">
          <div className="text-4xl mr-4 text-green-400">🏦</div>
          <div>
            <h3 className="text-base font-semibold">Waste Bank Partners</h3>
            <p className="text-2xl font-bold text-green-400 leading-tight">120</p>
            <p className="text-xs text-green-200">As of Today</p>
          </div>
        </div>

        {/* Panel 2: Total Waste Collected Today */}
        <div className="flex items-center p-4 rounded-2xl shadow-lg transition self-stretch
                        bg-white/10 backdrop-blur-md border border-white/20 text-white hover:shadow-xl">
          <div className="text-4xl mr-4 text-yellow-400">♻️</div>
          <div>
            <h3 className="text-base font-semibold">Total Waste Collected Today</h3>
            <p className="text-2xl font-bold text-lime-400 leading-tight">540 Kg</p>
            <p className="text-xs text-yellow-200">Latest Update</p>
          </div>
        </div>

        {/* Panel 3: Points Distributed Today */}
        <div className="flex items-center p-4 rounded-2xl shadow-lg transition self-stretch
                        bg-white/10 backdrop-blur-md border border-white/20 text-white hover:shadow-xl">
          <div className="text-4xl mr-4 text-pink-400">💎</div>
          <div>
            <h3 className="text-base font-semibold">Points Distributed Today</h3>
            <p className="text-2xl font-bold text-amber-300 leading-tight">1,250 Points</p>
            <p className="text-xs text-pink-200">Latest Update</p>
          </div>
        </div>

        {/* Panel 4: Transactions Today */}
        <div className="flex items-center p-4 rounded-2xl shadow-lg transition self-stretch
                        bg-white/10 backdrop-blur-md border border-white/20 text-white hover:shadow-xl">
          <div className="text-4xl mr-4 text-blue-400">📦</div>
          <div>
            <h3 className="text-base font-semibold">Transactions Today</h3>
            <p className="text-2xl font-bold text-greentech leading-tight">55</p>
            <p className="text-xs text-blue-200">Latest Update</p>
          </div>
        </div>

        {/* Panel 5: New Members This Month */}
        <div className="flex items-center p-4 rounded-2xl shadow-lg transition self-stretch
                        bg-white/10 backdrop-blur-md border border-white/20 text-white hover:shadow-xl">
          <div className="text-4xl mr-4 text-purple-400">🧑‍🤝‍🧑</div>
          <div>
            <h3 className="text-base font-semibold">New Members This Month</h3>
            <p className="text-2xl font-bold text-green-200 leading-tight">45</p>
            <p className="text-xs text-purple-200">Latest Update</p>
          </div>
        </div>

        {/* Panel 6: Top Contributor Today */}
        <div className="flex items-center p-4 rounded-2xl shadow-lg transition self-stretch
                        bg-white/10 backdrop-blur-md border border-white/20 text-white hover:shadow-xl">
          <div className="text-4xl mr-4 text-orange-400">🏆</div>
          <div>
            <h3 className="text-base font-semibold">Top Contributor Today</h3>
            <p className="text-2xl font-bold text-yellow-200 leading-tight">75 Kg</p>
            <p className="text-xs text-orange-200">Octavia Halim</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPanels;
