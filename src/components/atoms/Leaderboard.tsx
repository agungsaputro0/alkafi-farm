import { GiCow, GiSheep, GiGoat } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

interface TopTransaction {
  customer: string;
  type: string;
  quantity: number;
  totalValue: number;
  date: string;
  icon: JSX.Element;
}

// Utility membuat tanggal acak dalam bulan ini,
// namun tidak melebihi tanggal hari ini
const getRandomDatesThisMonth = (count: number) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const maxDay = today.getDate(); // batas tanggal = hari ini
  const used = new Set<number>();

  while (used.size < count) {
    used.add(Math.floor(Math.random() * maxDay) + 1);
  }

  return [...used]
    .sort((a, b) => b - a) // dari terbaru → terlama
    .map(day => new Date(year, month, day));
};

const randomDates = getRandomDatesThisMonth(5);

const formatDateID = (d: Date) =>
  d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// 5 transaksi terakhir bulan ini (urutan ditentukan dari tanggal)
const topTransactions: TopTransaction[] = [
  {
    customer: "CV Berkah Mandiri",
    type: "Sapi Limousin",
    quantity: 2,
    totalValue: 180000000,
    date: formatDateID(randomDates[0]),
    icon: <GiCow />,
  },
  {
    customer: "CV Ternak Sejahtera",
    type: "Sapi Bali",
    quantity: 4,
    totalValue: 92000000,
    date: formatDateID(randomDates[1]),
    icon: <GiCow />,
  },
  {
    customer: "Koperasi Makmur Jaya",
    type: "Sapi Madura",
    quantity: 8,
    totalValue: 152000000,
    date: formatDateID(randomDates[2]),
    icon: <GiCow />,
  },
  {
    customer: "PT Agro Nusantara",
    type: "Domba Garut",
    quantity: 15,
    totalValue: 90000000,
    date: formatDateID(randomDates[3]),
    icon: <GiSheep />,
  },
  {
    customer: "H. Rahmat Farm",
    type: "Kambing Etawa",
    quantity: 6,
    totalValue: 78000000,
    date: formatDateID(randomDates[4]),
    icon: <GiGoat />,
  },
];

// Sort final
topTransactions.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

interface LeaderboardProps {
  className?: string;
}

const formatRupiah = (value: number) =>
  `Rp ${value.toLocaleString("id-ID")}`;

const Leaderboard: React.FC<LeaderboardProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`w-full bg-white border border-gray-200 backdrop-blur-md rounded-xl shadow-lg p-6 text-farmlighestbrown ${className}`}
    >
      <h3 className="text-xl flex gap-2 justify-center items-center font-bold mb-4 mt-2 text-center text-farmdarkestbrown">
        5 Transaksi Terakhir Bulan Ini
      </h3>

      <ul className="space-y-3 mt-8">
        {topTransactions.map((tx, index) => (
          <li
            key={tx.customer}
            className={`flex items-center border border-gray-200 justify-between p-3 rounded-lg shadow-sm bg-white hover:bg-greenlogo/40 transition`}
          >
            {/* Kiri */}
            <div className="flex items-center space-x-3">
              <span className="text-lg w-6">{index + 1}</span>

              <div className="text-3xl text-farmdarkbrown">
                {tx.icon}
              </div>

              <div className="flex flex-col">
                <span className="font-medium text-sm text-farmdarkbrown">
                  {tx.customer}
                </span>
                <p className="text-xs text-farmbrown">
                  {tx.type} • {tx.quantity} ekor
                </p>
              </div>
            </div>

            {/* Kanan */}
            <div className="text-right text-xs text-farmbrown">
              <p className="font-semibold text-farmdarkestbrown">
                {formatRupiah(tx.totalValue)}
              </p>
              <p>{tx.date}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Button lihat semua transaksi */}
      <button
        onClick={() => {navigate("/transaksi")}}
        className="w-full mt-6 py-2 text-sm font-semibold transition duration-300 ease-in-out text-farmdarkbrown border border-farmdarkbrown rounded-lg hover:bg-farmbrown hover:text-white transition"
      >
        Lihat Semua Transaksi
      </button>
    </div>
  );
};

export default Leaderboard;
