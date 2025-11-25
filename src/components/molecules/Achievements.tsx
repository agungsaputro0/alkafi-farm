import { Card, Button } from 'antd';

const achievements = [
  { title: "Nasabah Terdaftar", value: "11.631" },
  { title: "Bank Sampah Terdaftar", value: "1783" },
  { title: "Sampah Terkumpul (Kg)", value: "4.439.640" },
  { title: "Sampah Terkelola (Kg)", value: "4.039.640" },
];

const OurAchievements = () => {
  return (
    <div className="bg-green-800 py-10 flex flex-col items-center min-w-screen">
      <h2 className="text-white text-2xl font-semibold mb-8">Pencapaian Kami</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {achievements.map((item, index) => (
          <Card
            key={index}
            className="w-48 text-center shadow-lg rounded-md"
            style={{ borderRadius: '8px'}}
          >
            <div className="text-green-600 text-center text-3xl font-bold">{item.value}</div>
            <div className="text-gray-600 font-medium">{item.title}</div>
          </Card>
        ))}
      </div>
      <Button type="primary" className="mt-8 bg-green-500 border-none hover:bg-[#002904]">
        Selengkapnya
      </Button>
    </div>
  );
};

export default OurAchievements;
