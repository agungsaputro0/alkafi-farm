import { GiCow, GiSheep, GiGoat, GiPodium } from "react-icons/gi";

interface TopTransaction {
  customer: string;
  type: string;
  quantity: number;
  totalValue: number;
  date: string;
  icon: JSX.Element;
}

const topTransactions: TopTransaction[] = [
  { customer: "CV Berkah Mandiri", type: "Sapi Limousin", quantity: 2, totalValue: 180000000, date: "18 Okt 2025", icon: <GiCow /> },
  { customer: "CV Ternak Sejahtera", type: "Sapi Bali", quantity: 8, totalValue: 176000000, date: "5 Okt 2025", icon: <GiCow /> },
  { customer: "Koperasi Makmur Jaya", type: "Sapi Madura", quantity: 4, totalValue: 92000000, date: "12 Okt 2025", icon: <GiCow /> },
  { customer: "PT Agro Nusantara", type: "Domba Garut", quantity: 15, totalValue: 90000000, date: "8 Okt 2025", icon: <GiSheep /> },
  { customer: "H. Rahmat Farm", type: "Kambing Etawa", quantity: 6, totalValue: 78000000, date: "15 Okt 2025", icon: <GiGoat /> },
];

interface LeaderboardProps {
  className?: string;
}

const formatRupiah = (value: number) =>
  `Rp ${value.toLocaleString("id-ID")}`;

const Leaderboard: React.FC<LeaderboardProps> = ({ className = "" }) => {
  return (
    <div
      className={`w-full bg-white border border-gray-200 backdrop-blur-md rounded-xl shadow-lg p-6 text-farmlighestbrown ${className}`}
    >
      {/* Header Trophy */}
      <div className="flex justify-center items-center relative w-full h-28">
        <div className="absolute w-28 h-28 rounded-full bg-farmdarkestbrown/10 border border-farmdarkestbrown/20"></div>
        <div className="absolute w-20 h-20 rounded-full bg-farmdarkestbrown/20 border border-farmdarkestbrown/30"></div>
        <div className="relative w-14 h-14 rounded-full bg-farmdarkestbrown/20 flex items-center justify-center text-3xl shadow-lg border border-farmdarkestbrown/40">
          <GiPodium />
        </div>
      </div>

      <h3 className="text-md font-bold mb-4 mt-2 text-center text-farmdarkestbrown">
        Top 5 Transaksi Bulan Ini
      </h3>

      <ul className="space-y-3">
        {topTransactions.map((tx, index) => {
          const medal =
            index === 0 ? "🥇" :
            index === 1 ? "🥈" :
            index === 2 ? "🥉" : "";

          const bgHighlight =
            index === 0 ? "bg-farmfreshgreen/30" :
            index === 1 ? "bg-farmfreshgreen/20" :
            index === 2 ? "bg-farmfreshgreen/10" : "bg-white/5";

          return (
            <li
              key={tx.customer}
              className={`flex items-center justify-between p-3 rounded-lg shadow-sm ${bgHighlight} hover:bg-farmbrown/70 transition`}
            >
              {/* Kiri: icon + customer */}
              <div className="flex items-center space-x-3">
                <span className="text-lg w-6">{index + 1}</span>
                <div className="text-3xl text-farmgreen">
                  {tx.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm text-farmdarkbrown">
                    {medal} {tx.customer}
                  </span>
                  <p className="text-xs text-farmbrown">
                    {tx.type} • {tx.quantity} ekor
                  </p>
                </div>
              </div>

              {/* Kanan: nominal dan tanggal */}
              <div className="text-right text-xs text-farmbrown">
                <p className="font-semibold text-farmdarkestbrown">
                  {formatRupiah(tx.totalValue)}
                </p>
                <p>{tx.date}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Leaderboard;
