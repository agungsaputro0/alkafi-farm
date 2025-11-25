export const formatTanggalPendek = () => {
  const hari = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  const today = new Date();
  const namaHari = hari[today.getDay()];
  const tanggal = today.getDate().toString().padStart(2, "0");
  const namaBulan = bulan[today.getMonth()];
  const tahun = today.getFullYear();

  return `${namaHari}, ${tanggal} ${namaBulan} ${tahun}`;
};

export const formatTanggalIndo = (tanggalStr: string, denganHari = false): string => {
  const hari = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  // Asumsikan input selalu "YYYY-MM-DD"
  const parts = tanggalStr.split("-");
  
  if (parts.length !== 3) return "Tanggal Tidak Valid";

  const [yyyy, mm, dd] = parts.map(Number);
  if (isNaN(yyyy) || isNaN(mm) || isNaN(dd)) return "Tanggal Tidak Valid";

  // Buat dateObj
  const dateObj = new Date(yyyy, mm - 1, dd); // bulan dimulai dari 0

  const tanggal = dateObj.getDate().toString().padStart(2, "0");
  const namaBulan = bulan[dateObj.getMonth()];
  const tahun = dateObj.getFullYear();

  if (denganHari) {
    const namaHari = hari[dateObj.getDay()];
    return `${namaHari}, ${tanggal} ${namaBulan} ${tahun}`;
  }

  return `${tanggal} ${namaBulan} ${tahun}`;
};
