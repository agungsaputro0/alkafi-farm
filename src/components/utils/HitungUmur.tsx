export const hitungUmur = (tanggalLahir: string): string => {
  if (!tanggalLahir) return "Tidak diketahui";

  const today = new Date();
  const birth = new Date(tanggalLahir);

  let tahun = today.getFullYear() - birth.getFullYear();
  let bulan = today.getMonth() - birth.getMonth();

  // Jika bulan saat ini lebih kecil dari bulan lahir → belum ulang tahun tahun ini
  if (bulan < 0) {
    tahun--;
    bulan += 12;
  }

  // Jika masih di bulan yang sama tapi belum tanggal lahirnya
  if (bulan === 0 && today.getDate() < birth.getDate()) {
    bulan = 11;
    tahun--;
  }

  // Format hasil secara natural
  let hasil = "";
  if (tahun > 0) hasil += `${tahun} tahun `;
  if (bulan > 0) hasil += `${bulan} bulan`;
  if (!hasil) hasil = "Kurang dari 1 bulan";

  return hasil.trim();
};

export const getStatusKadaluwarsa = (tanggalStr?: string): string => {
  if (!tanggalStr) return "Tidak Diketahui";

  const today = new Date();
  today.setHours(0, 0, 0, 0); // hanya tanggal

  const tanggalKadaluwarsa = new Date(tanggalStr);
  tanggalKadaluwarsa.setHours(0, 0, 0, 0);

  if (tanggalKadaluwarsa < today) return "Kadaluarsa";
  return "Masih berlaku";
};