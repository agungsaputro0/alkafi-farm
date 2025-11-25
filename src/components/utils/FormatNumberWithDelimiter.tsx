export const formatNumber = (value: string | number): string => {
  if (value === null || value === undefined || value === "") return "";

  const str = typeof value === "number" ? value.toString() : value;

  // Pisahkan bagian desimal (kalau ada)
  const parts = str.split(",");
  let integerPart = parts[0].replace(/[^0-9]/g, "");
  let decimalPart = parts[1]?.replace(/[^0-9]/g, "");

  if (!integerPart) return "";

  let formatted = parseInt(integerPart, 10).toLocaleString("id-ID");

  if (parts.length > 1) {
    formatted += "," + (decimalPart ?? "");
  }

  return formatted;
};

export const formatNumber2 = (value: string | number): string => {
  if (value === null || value === undefined || value === "") return "";

  let str = value.toString();

  // 🔑 Ubah desimal titik (JS default) jadi koma biar konsisten dengan id-ID
  str = str.replace(".", ",");

  const parts = str.split(",");
  let integerPart = parts[0].replace(/[^0-9]/g, "");
  let decimalPart = parts[1]?.replace(/[^0-9]/g, "");

  if (!integerPart) return "";

  let formatted = parseInt(integerPart, 10).toLocaleString("id-ID");

  if (parts.length > 1) {
    formatted += "," + (decimalPart ?? "");
  }

  return formatted;
};


export const formatFromDB = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
    useGrouping: true,
  }).format(value);
};

export const unformatNumber = (value: string): number => {
  if (!value) return 0;

  let normalized = value.replace(/\./g, "").replace(",", ".");

  // Kalau user akhiri dengan koma, tambahkan "00"
  if (normalized.endsWith(".")) {
    normalized += "00";
  }

  return parseFloat(normalized) || 0;
};



export const calculatePercentage = (target: string, realisasi: string) => {
  const t = unformatNumber(target);
  const r = unformatNumber(realisasi);

  if (t === 0) return "-"; // hindari pembagian nol

  const percent = (r / t) * 100;

  // Batas maksimum untuk tampil di UI
  const MAX_PERCENT = 999_999_999.99;

  // Format ribuan dengan 2 digit desimal
  const formatted = percent.toLocaleString("id-ID", { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });

  return percent > MAX_PERCENT
    ? `> ${MAX_PERCENT.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
    : `${formatted}%`;
};
