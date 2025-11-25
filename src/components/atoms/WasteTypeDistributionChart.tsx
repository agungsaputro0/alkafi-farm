import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer} from "recharts";

export default function WasteTypeDistributionChart() {
  const wasteTypes = [
    "Plastik PET",
    "Plastik HDPE",
    "Plastik PP",
    "Kertas",
    "Karton",
    "Logam Aluminium",
    "Logam Besi",
    "Kaca",
    "Organik",
    "Tekstil",
  ];

  const wasteAmounts = [120, 0, 85, 150, 90, 40, 75, 50, 200, 0];

  const colors = [
    "#ffffff", "#36C0EB", "#FFE56B", "#4BC0C0", "#e9bb7fff",
    "#FFAB40", "#a7bceaff", "#9adbffff", "#04ff00ff", "#FFD700",
  ];

  const chartData = wasteTypes
    .map((name, i) => ({ name, value: wasteAmounts[i], fill: colors[i] }))
    .filter(item => item.value > 0);



  // Custom label untuk total di tengah
 

  return (
    <div className="w-full p-4 bg-white/10 backdrop-blur-md rounded-xl shadow text-white min-h-[400px] flex flex-col">
      <h3 className="text-lg font-bold text-center mb-4">
        ♻️ Waste Distribution by Type
      </h3>

      <div className="flex-1">
        <ResponsiveContainer width="100%" minHeight={333}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="80%"
              paddingAngle={3}
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              
            </Pie>

           <Tooltip
            formatter={(value: number, name: string) => [`${value} kg`, name]}
            contentStyle={{ backgroundColor: "#1f2937", borderRadius: 5, border: "none" }}
            itemStyle={{ color: "#ffffff" }}  
            labelStyle={{ color: "#ffffff" }} 
          />


            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ color: "white" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
