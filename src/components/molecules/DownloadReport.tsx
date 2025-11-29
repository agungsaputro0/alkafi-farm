import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import InputElement from "../atoms/InputElement";
import SearchableSelect from "../atoms/SearchAbleSelectElement";
import Button from "../atoms/Button";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import dayjs, { Dayjs } from "dayjs";
import { AiTwotonePieChart } from "react-icons/ai";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

const DownloadReport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reportType: "",
    format: "",
  });

  const [chartData, setChartData] = useState<any[]>([]);

  const generateDummyChartData = (start: string, end: string, reportType: string) => {
    const startDay = dayjs(start);
    const endDay = dayjs(end);
    const diffDays = endDay.diff(startDay, "day") + 1;

    const data: any[] = [];
    for (let i = 0; i < diffDays; i++) {
      const dateLabel = startDay.add(i, "day").format("DD/MM");
      if (reportType === "Populasi Hewan Ternak") {
        data.push({
          date: dateLabel,
          sapi: Math.floor(Math.random() * 20 + 50),
          domba: Math.floor(Math.random() * 30 + 70),
        });
      } else if (reportType === "Kesehatan") {
        data.push({
          date: dateLabel,
          vaksinasi: Math.floor(Math.random() * 10 + 20),
          pengobatan: Math.floor(Math.random() * 5 + 5),
        });
      } else if (reportType === "Penjualan") {
        data.push({
          date: dateLabel,
          hewan: Math.floor(Math.random() * 5 + 2),
          produk: Math.floor(Math.random() * 8 + 3),
        });
      } else if (reportType === "Stok") {
        data.push({
          date: dateLabel,
          pakan: Math.floor(Math.random() * 50 + 100),
          obat: Math.floor(Math.random() * 30 + 50),
        });
      } else if (reportType === "Jadwal") {
        data.push({
          date: dateLabel,
          pakan: Math.floor(Math.random() * 3 + 1),
          vaksinasi: Math.floor(Math.random() * 2 + 1),
        });
      }
    }
    return data;
  };

  const handleDownload = (format: string) => {
    const blob = new Blob([""], { type: format === "pdf" ? "application/pdf" : "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `laporan.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate || !formData.reportType || !formData.format) {
      toast.warning("Mohon lengkapi semua field sebelum generate laporan!");
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Laporan siap di-generate",
      html: `<p>Jenis Laporan: <strong>${formData.reportType}</strong></p>
             <p>Periode: <strong>${formData.startDate}</strong> s/d <strong>${formData.endDate}</strong></p>
             <p>Format: <strong>${formData.format.toUpperCase()}</strong></p>`,
      confirmButtonText: "OK",
    });

    // download file kosong
    handleDownload(formData.format);

    // set chart dummy
    setChartData(generateDummyChartData(formData.startDate, formData.endDate, formData.reportType));
  };

  return (
    <section className="pt-16 flex flex-col items-center mb-20 mx-4" style={{ paddingLeft: "80px" }}>
      <MainPanel>
        <div className="px-6">
          <p className="text-white font-semibold">
            <span
              onClick={() => navigate("/Home")}
              className="text-white/50 hover:text-kemenkeuyellow cursor-pointer"
            >
              Dashboard •{" "}
            </span>
            Laporan
          </p>
        </div>

        <WhiteSection>
          <div className="p-8 bg-[#fffdf9]/90 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <AiTwotonePieChart className="text-6xl text-farmdarkestbrown" />
              <div>
                <h2 className="text-2xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                  Generate Laporan
                </h2>
                <p className="text-sm text-[#724e3a]">
                  Pilih periode dan jenis laporan yang ingin di-generate.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <InputElement
                  inputClass="mb-4"
                  forwhat="startDate"
                  labelMessage="Tanggal Awal Periode"
                  typeInput="date"
                  inputName="startDate"
                  inputPlaceholder="Pilih tanggal awal"
                  value={formData.startDate ? dayjs(formData.startDate, "YYYY-MM-DD") : null}
                  onChange={(_date: Dayjs | null, _dateString: string) =>
                    setFormData((prev) => ({ ...prev, startDate: _date ? _date.format("YYYY-MM-DD") : "" }))
                  }
                />

                <InputElement
                  inputClass="mb-4"
                  forwhat="endDate"
                  labelMessage="Tanggal Akhir Periode"
                  typeInput="date"
                  inputName="endDate"
                  inputPlaceholder="Pilih tanggal akhir"
                  value={formData.endDate ? dayjs(formData.endDate, "YYYY-MM-DD") : null}
                  onChange={(_date: Dayjs | null, _dateString: string) =>
                    setFormData((prev) => ({ ...prev, endDate: _date ? _date.format("YYYY-MM-DD") : "" }))
                  }
                />

                <SearchableSelect
                  inputClass="mb-4 md:col-span-2"
                  forwhat="reportType"
                  labelMessage="Jenis Laporan"
                  placeholder="Pilih jenis laporan"
                  options={[
                    { value: "Populasi Hewan Ternak", label: "Populasi Hewan Ternak" },
                    { value: "Kesehatan", label: "Kesehatan" },
                    { value: "Penjualan", label: "Penjualan" },
                    { value: "Stok", label: "Stok" },
                    { value: "Jadwal", label: "Jadwal" },
                  ]}
                  onChange={(opt) => setFormData((prev) => ({ ...prev, reportType: opt?.value || "" }))}
                  value={formData.reportType}
                />

                <SearchableSelect
                  inputClass="mb-4 md:col-span-2"
                  forwhat="format"
                  labelMessage="Format Laporan"
                  placeholder="Pilih format laporan"
                  options={[
                    { value: "pdf", label: "PDF" },
                    { value: "excel", label: "Excel" },
                  ]}
                  onChange={(opt) => setFormData((prev) => ({ ...prev, format: opt?.value || "" }))}
                  value={formData.format}
                />
              </div>

              <div className="flex justify-end mt-8">
                <Button
                  type="submit"
                  variant="bg-farmbrown hover:bg-farmdarkestbrown text-white px-8 py-3 w-full rounded-full shadow-md transition"
                >
                  Generate
                </Button>
              </div>
            </form>

            {/* Chart */}
            {chartData.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-center mb-4">{formData.reportType} (Periode: {formData.startDate} s/d {formData.endDate})</h3>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {/* Dinamis sesuai report type */}
                      {formData.reportType === "Populasi Hewan Ternak" && (
                        <>
                          <Bar dataKey="sapi" fill="#82ca9d" />
                          <Bar dataKey="domba" fill="#8884d8" />
                        </>
                      )}
                      {formData.reportType === "Kesehatan" && (
                        <>
                          <Bar dataKey="vaksinasi" fill="#82ca9d" />
                          <Bar dataKey="pengobatan" fill="#8884d8" />
                        </>
                      )}
                      {formData.reportType === "Penjualan" && (
                        <>
                          <Bar dataKey="hewan" fill="#82ca9d" />
                          <Bar dataKey="produk" fill="#8884d8" />
                        </>
                      )}
                      {formData.reportType === "Stok" && (
                        <>
                          <Bar dataKey="pakan" fill="#82ca9d" />
                          <Bar dataKey="obat" fill="#8884d8" />
                        </>
                      )}
                      {formData.reportType === "Jadwal" && (
                        <>
                          <Bar dataKey="pakan" fill="#82ca9d" />
                          <Bar dataKey="vaksinasi" fill="#8884d8" />
                        </>
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </WhiteSection>
      </MainPanel>
    </section>
  );
};

export default DownloadReport;
