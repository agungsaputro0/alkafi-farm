import { useState } from "react";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import InputElement from "../atoms/InputElement";
import SearchableSelect from "../atoms/SearchAbleSelectElement";
import Button from "../atoms/Button";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import { AiTwotonePieChart } from "react-icons/ai";

// RECHARTS
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
  LineChart, Line,
  AreaChart, Area,
  PieChart, Pie, Cell,
} from "recharts";

// COLORS
const COLORS = ["#82ca9d", "#8884d8", "#ffc658", "#d45028", "#0088FE", "#FFBB28"];

// Helper random & smooth functions
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const smoothStep = (prev: number, variance: number) => {
  const diff = (Math.random() - 0.5) * variance;
  const next = Math.max(0, Math.round(prev + diff));
  return next;
};

const DownloadReport = () => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reportType: "",
    format: "",
  });

  // chartData will hold multiple datasets per report:
  // { main:[], breakdown:[], summary:[], extra?:[] }
  const [chartData, setChartData] = useState<any | null>(null);

  // PIE summary used for small pies where needed
  const [_pieSummary, setPieSummary] = useState<any[]>([]);

  // ---------------------------
  // Generate realistic dummy datasets per report type
  // ---------------------------
  const generateDummyChartData = (start: string, end: string, reportType: string) => {
    const startDay = dayjs(start);
    const endDay = dayjs(end);
    const diffDays = Math.max(1, endDay.diff(startDay, "day") + 1);

    // We'll build three separate datasets per report:
    // main: time series for main chart
    // breakdown: time series for breakdown chart
    // summary: aggregated values for pie/summary chart
    let main: any[] = [];
    let breakdown: any[] = [];
    let summary: any[] = [];

    // seeds for smoothing
    let seed = {
      sapi: 80,
      kambing: 60,
      domba: 50,
      konsentrat: 800,
      hay: 1200,
      vitamin: 80,
      antibiotik: 50,
      sales_sapi: 3,
      sales_kambing: 4,
      sales_domba: 2,
    };

    // POPULASI: 3 charts
    // main = populasi over time (sapi/kambing/domba)
    // breakdown = lahir/mati/terjual per species per day (grouped fields)
    // summary = age distribution aggregated (pie)
    if (reportType === "Populasi Hewan Ternak") {
      let ageAgg = { sapi: 0, kambing: 0, domba: 0 };
      for (let i = 0; i < diffDays; i++) {
        const date = startDay.add(i, "day").format("DD/MM");

        // smooth population change using seed + small drift
        seed.sapi = smoothStep(seed.sapi + rand(-1, 2), 5);
        seed.kambing = smoothStep(seed.kambing + rand(-1, 2), 5);
        seed.domba = smoothStep(seed.domba + rand(-1, 2), 4);

        // births/deaths/sold per species (realistic small ints)
        const lahir = { sapi: rand(0, 2), kambing: rand(0, 3), domba: rand(0, 3) };
        const mati = { sapi: rand(0, 1), kambing: rand(0, 1), domba: rand(0, 1) };
        const terjual = { sapi: rand(0, 2), kambing: rand(0, 2), domba: rand(0, 2) };

        // update seeds by applying births - deaths - sold
        seed.sapi = Math.max(0, seed.sapi + lahir.sapi - mati.sapi - terjual.sapi);
        seed.kambing = Math.max(0, seed.kambing + lahir.kambing - mati.kambing - terjual.kambing);
        seed.domba = Math.max(0, seed.domba + lahir.domba - mati.domba - terjual.domba);

        // main time series (population)
        main.push({
          date,
          sapi: seed.sapi,
          kambing: seed.kambing,
          domba: seed.domba,
        });

        // breakdown: grouped bars for all "lahir/mati/terjual" per species (flatten)
        breakdown.push({
          date,
          sapi_lahir: lahir.sapi,
          sapi_mati: mati.sapi,
          sapi_terjual: terjual.sapi,
          kambing_lahir: lahir.kambing,
          kambing_mati: mati.kambing,
          kambing_terjual: terjual.kambing,
          domba_lahir: lahir.domba,
          domba_mati: mati.domba,
          domba_terjual: terjual.domba,
        });

        // age distribution snapshot (simulate slightly changing)
        const age = {
          sapi: { bayi: rand(5, 12), remaja: rand(8, 18), dewasa: rand(40, 60), tua: rand(3, 8) },
          kambing: { bayi: rand(6, 15), remaja: rand(10, 22), dewasa: rand(30, 45), tua: rand(2, 6) },
          domba: { bayi: rand(5, 13), remaja: rand(9, 20), dewasa: rand(25, 38), tua: rand(2, 6) },
        };
        // aggregate age totals to summary (we'll use last snapshot as pie)
        ageAgg.sapi += age.sapi.bayi + age.sapi.remaja + age.sapi.dewasa + age.sapi.tua;
        ageAgg.kambing += age.kambing.bayi + age.kambing.remaja + age.kambing.dewasa + age.kambing.tua;
        ageAgg.domba += age.domba.bayi + age.domba.remaja + age.domba.dewasa + age.domba.tua;
      }

      // summary pie: proportion of total animals by species (based on average of population)
      // const totalPop = main.reduce((s, r) => s + r.sapi + r.kambing + r.domba, 0);
      const avgSapi = Math.round((main.reduce((s, r) => s + r.sapi, 0)) / main.length || 0);
      const avgKambing = Math.round((main.reduce((s, r) => s + r.kambing, 0)) / main.length || 0);
      const avgDomba = Math.round((main.reduce((s, r) => s + r.domba, 0)) / main.length || 0);

      summary = [
        { name: "Sapi (avg)", value: avgSapi },
        { name: "Kambing (avg)", value: avgKambing },
        { name: "Domba (avg)", value: avgDomba },
      ];

      setPieSummary(summary);
      return { main, breakdown, summary, meta: { ageAgg } };
    }

    // KESEHATAN: 3 charts
    // main = daily sick counts per species
    // breakdown = penanganan counts (vaksin/obat/rawatInap) per day
    // summary = outcome totals (sembuh vs mati) as pie
    if (reportType === "Kesehatan") {
      let totSembuh = 0;
      let totMati = 0;
      for (let i = 0; i < diffDays; i++) {
        const date = startDay.add(i, "day").format("DD/MM");
        // sick instances per species (small numbers)
        seed.sapi = smoothStep(seed.sapi, 2); // keep some baseline but not used here
        const sick = { sapi: rand(0, 5), kambing: rand(0, 6), domba: rand(0, 5) };

        // penanganan distribution for that day
        const vaksin = rand(0, Math.ceil((sick.sapi + sick.kambing + sick.domba) * 0.6));
        const obat = rand(0, Math.ceil((sick.sapi + sick.kambing + sick.domba) * 0.5));
        const rawatInap = rand(0, Math.ceil((sick.sapi + sick.kambing + sick.domba) * 0.15));

        // outcomes: assume majority sembuh thanks to treatment
        const sembuh = Math.min(vaksin + obat, rand(0, vaksin + obat + 1));
        const mati = Math.min(rawatInap, rand(0, rawatInap + 1));

        totSembuh += sembuh;
        totMati += mati;

        main.push({ date, sapi: sick.sapi, kambing: sick.kambing, domba: sick.domba });
        breakdown.push({ date, vaksin, obat, rawatInap });
      }

      summary = [
        { name: "Sembuh", value: totSembuh },
        { name: "Mati", value: totMati },
      ];

      setPieSummary(summary);
      return { main, breakdown, summary };
    }

    // PENJUALAN: 3 charts
    // main = sales per day per species (time series)
    // breakdown = kanal distribution aggregated (pie or summary over period)
    // summary = payment method counts aggregated (bar)
    if (reportType === "Penjualan") {
      let kanalAgg = { offline: 0, marketplace: 0, reseller: 0 };
      let metodeAgg = { cash: 0, transfer: 0, ewallet: 0 };

      for (let i = 0; i < diffDays; i++) {
        const date = startDay.add(i, "day").format("DD/MM");

        const sales = {
          sapi: rand(0, 4),
          kambing: rand(0, 6),
          domba: rand(0, 5),
        };

        // random channel and payment for those sales (distribute counts)
        const offline = rand(0, Math.max(1, Math.floor(sales.sapi + sales.kambing + sales.domba) - 1));
        const marketplace = rand(0, Math.max(0, Math.floor((sales.sapi + sales.kambing + sales.domba) / 2)));
        const reseller = Math.max(0, (sales.sapi + sales.kambing + sales.domba) - offline - marketplace);

        kanalAgg.offline += offline;
        kanalAgg.marketplace += marketplace;
        kanalAgg.reseller += reseller;

        // payment distribution (scale)
        const cash = rand(0, offline);
        const transfer = rand(0, marketplace + reseller);
        const ewallet = Math.max(0, (sales.sapi + sales.kambing + sales.domba) - cash - transfer);

        metodeAgg.cash += cash;
        metodeAgg.transfer += transfer;
        metodeAgg.ewallet += ewallet;

        main.push({ date, sapi: sales.sapi, kambing: sales.kambing, domba: sales.domba });
        breakdown.push({ date, offline, marketplace, reseller, cash, transfer, ewallet });
      }

      summary = [
        { name: "Offline", value: kanalAgg.offline },
        { name: "Marketplace", value: kanalAgg.marketplace },
        { name: "Reseller", value: kanalAgg.reseller },
      ];
      // set pie to kanal (primary)
      setPieSummary(summary);
      // additional aggregated metodeAgg returned as summary2
      const summary2 = Object.entries(metodeAgg).map(([k, v]: any) => ({ name: k, value: v }));
      return { main, breakdown, summary, summary2 };
    }

    // STOK: 3 charts
    // main = area chart showing masuk vs dipakai per feed type over time (we'll show konsentrat & hay)
    // breakdown = current stock per feed type (bar)
    // summary = source distribution (pengadaan sendiri vs beli) pie
    if (reportType === "Stok") {
      let sourceAgg = { pengadaanSendiri: 0, beli: 0 };
      // track running stock for 'current' snapshot
      let running = {
        konsentrat: seed.konsentrat,
        hay: seed.hay,
        vitamin: seed.vitamin,
        antibiotik: seed.antibiotik,
      };

      for (let i = 0; i < diffDays; i++) {
        const date = startDay.add(i, "day").format("DD/MM");

        const masuk = {
          konsentrat: rand(80, 220),
          hay: rand(120, 380),
          vitamin: rand(5, 18),
          antibiotik: rand(3, 12),
        };
        const dipakai = {
          konsentrat: rand(60, 200),
          hay: rand(100, 320),
          vitamin: rand(4, 10),
          antibiotik: rand(2, 8),
        };

        running.konsentrat = Math.max(0, running.konsentrat + masuk.konsentrat - dipakai.konsentrat);
        running.hay = Math.max(0, running.hay + masuk.hay - dipakai.hay);
        running.vitamin = Math.max(0, running.vitamin + masuk.vitamin - dipakai.vitamin);
        running.antibiotik = Math.max(0, running.antibiotik + masuk.antibiotik - dipakai.antibiotik);

        const asal = { pengadaanSendiri: rand(30, 60), beli: rand(20, 50) };
        sourceAgg.pengadaanSendiri += asal.pengadaanSendiri;
        sourceAgg.beli += asal.beli;

        main.push({
          date,
          masuk_konsentrat: masuk.konsentrat,
          masuk_hay: masuk.hay,
          dipakai_konsentrat: dipakai.konsentrat,
          dipakai_hay: dipakai.hay,
        });

        // breakdown will hold snapshot of running stock that day
        breakdown.push({
          date,
          konsentrat: running.konsentrat,
          hay: running.hay,
          vitamin: running.vitamin,
          antibiotik: running.antibiotik,
        });
      }

      summary = [
        { name: "Pengadaan Sendiri", value: sourceAgg.pengadaanSendiri },
        { name: "Beli", value: sourceAgg.beli },
      ];

      setPieSummary(summary);
      return { main, breakdown, summary, currentStock: breakdown[breakdown.length - 1] || {} };
    }

    // JADWAL: 3 charts
    // main = aggregated activities per day (counts)
    // breakdown = how many tasks per petugas across period
    // summary = activity distribution pie
    if (reportType === "Jadwal") {
      const petugas = ["Budi", "Asep", "Toni", "Dewi", "Sari"];
      const petugasAgg: Record<string, number> = petugas.reduce((acc, p) => (acc[p] = 0, acc), {} as any);
      const activityAgg: Record<string, number> = { pembersihan: 0, pemberianPakan: 0, kontrolKesehatan: 0 };

      for (let i = 0; i < diffDays; i++) {
        const date = startDay.add(i, "day").format("DD/MM");
        // each day multiple petugas may work; randomize who and how many tasks
        const assignments = rand(1, 3); // number of petugas that day
        let dayCounts = { pembersihan: 0, pemberianPakan: 0, kontrolKesehatan: 0 };

        for (let a = 0; a < assignments; a++) {
          const selected = petugas[rand(0, petugas.length - 1)];
          const pembersihan = rand(0, 3);
          const pemberianPakan = rand(1, 5);
          const kontrolKesehatan = rand(0, 2);

          petugasAgg[selected] += pembersihan + pemberianPakan + kontrolKesehatan;
          dayCounts.pembersihan += pembersihan;
          dayCounts.pemberianPakan += pemberianPakan;
          dayCounts.kontrolKesehatan += kontrolKesehatan;

          activityAgg.pembersihan += pembersihan;
          activityAgg.pemberianPakan += pemberianPakan;
          activityAgg.kontrolKesehatan += kontrolKesehatan;
        }

        main.push({
          date,
          pembersihan: dayCounts.pembersihan,
          pemberianPakan: dayCounts.pemberianPakan,
          kontrolKesehatan: dayCounts.kontrolKesehatan,
        });
      }

      // breakdown: per petugas totals (bar)
      breakdown = Object.entries(petugasAgg).map(([name, total]) => ({ name, total }));
      summary = Object.entries(activityAgg).map(([k, v]) => ({ name: k, value: v }));

      setPieSummary(summary);
      return { main, breakdown, summary };
    }

    // default empty
    return { main: [], breakdown: [], summary: [] };
  };

  // ---------------------------
  // Download (PDF minimal or CSV)
  // ---------------------------
  const handleDownload = (format: string) => {
    let content = "";
    let mime = "";
    let filename = "";
    if (format === "pdf") {
      mime = "application/pdf";
      filename = "laporan.pdf";
      content = `%PDF-1.1
1 0 obj <</Type/Catalog/Pages 2 0 R>> endobj
2 0 obj <</Type/Pages/Count 0>> endobj
xref
0 3
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
trailer <</Root 1 0 R /Size 3>>
startxref
100
%%EOF`;
    } else {
      mime = "text/csv";
      filename = "laporan.csv";
      content = "Tanggal,Data\n";
    }
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ---------------------------
  // Submit
  // ---------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reportType || !formData.format) {
      toast.warning("Mohon lengkapi semua field sebelum generate laporan!");
      return;
    }

    handleDownload(formData.format);

    const data = generateDummyChartData(formData.startDate, formData.endDate, formData.reportType);
    setChartData(data);
  };

  // ---------------------------
  // Render helpers for each report type
  // ---------------------------
  const renderPopulasiCharts = (dataObj: any) => {
    const main = dataObj.main || [];
    const breakdown = dataObj.breakdown || [];
    const summary = dataObj.summary || [];
    return (
      <>
        {/* Title + explanation */}
        <div>
          <h4 className="text-lg font-semibold">1) Pertumbuhan Populasi (harian)</h4>
          <p className="text-sm text-gray-600 mb-2">Menampilkan jumlah sapi, kambing, dan domba per hari.</p>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer>
            <LineChart data={main}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sapi" stroke={COLORS[0]} />
              <Line type="monotone" dataKey="kambing" stroke={COLORS[1]} />
              <Line type="monotone" dataKey="domba" stroke={COLORS[2]} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-lg font-semibold mt-4">2) Lahir • Mati • Terjual (per hari, per species)</h4>
          <p className="text-sm text-gray-600 mb-2">Perbandingan jumlah kejadian harian untuk setiap species.</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer>
            <BarChart data={breakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* sapi group */}
              <Bar dataKey="sapi_lahir" stackId="sapi" name="Sapi Lahir" fill={COLORS[0]} />
              <Bar dataKey="sapi_mati" stackId="sapi" name="Sapi Mati" fill={COLORS[3]} />
              <Bar dataKey="sapi_terjual" stackId="sapi" name="Sapi Terjual" fill={COLORS[2]} />
              {/* kambing group */}
              <Bar dataKey="kambing_lahir" stackId="kambing" name="Kambing Lahir" fill="#C6E2FF" />
              <Bar dataKey="kambing_mati" stackId="kambing" name="Kambing Mati" fill="#FF9F80" />
              <Bar dataKey="kambing_terjual" stackId="kambing" name="Kambing Terjual" fill="#FFD86E" />
              {/* domba group */}
              <Bar dataKey="domba_lahir" stackId="domba" name="Domba Lahir" fill="#B6E3C4" />
              <Bar dataKey="domba_mati" stackId="domba" name="Domba Mati" fill="#FF6B6B" />
              <Bar dataKey="domba_terjual" stackId="domba" name="Domba Terjual" fill="#9D7CE0" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-lg font-semibold mt-4">3) Distribusi Umur (agregat periode)</h4>
          <p className="text-sm text-gray-600 mb-2">Persentase rata-rata umur per species selama periode.</p>
        </div>
        <div className="h-[260px] flex justify-center">
          <ResponsiveContainer width="60%">
            <PieChart>
              <Pie data={summary} dataKey="value" nameKey="name" outerRadius={100} label>
                {summary.map((_:any, i:any) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  };

  const renderKesehatanCharts = (dataObj: any) => {
    const main = dataObj.main || [];
    const breakdown = dataObj.breakdown || [];
    const summary = dataObj.summary || [];
    return (
      <>
        <div>
          <h4 className="text-lg font-semibold">1) Jumlah Hewan Sakit per Jenis (harian)</h4>
          <p className="text-sm text-gray-600 mb-2">Menunjukkan berapa banyak hewan sakit tiap hari per species.</p>
        </div>
        <div className="h-[260px]">
          <BarChartWrapper data={main} keys={["sapi","kambing","domba"]} />
        </div>

        <div>
          <h4 className="text-lg font-semibold mt-4">2) Penanganan (vaksin / obat / rawat inap)</h4>
          <p className="text-sm text-gray-600 mb-2">Jumlah tindakan medis yang dilakukan tiap hari.</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer>
            <AreaChart data={breakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="vaksin" stroke={COLORS[0]} fill={COLORS[0]} opacity={0.6} />
              <Area type="monotone" dataKey="obat" stroke={COLORS[2]} fill={COLORS[2]} opacity={0.6} />
              <Area type="monotone" dataKey="rawatInap" stroke={COLORS[3]} fill={COLORS[3]} opacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-lg font-semibold mt-4">3) Outcome: Sembuh vs Mati (agregat)</h4>
          <p className="text-sm text-gray-600 mb-2">Ringkasan hasil pengobatan selama periode.</p>
        </div>
        <div className="h-[260px] flex justify-center">
          <ResponsiveContainer width="50%">
            <PieChart>
              <Pie data={summary} dataKey="value" nameKey="name" outerRadius={90} label>
                {summary.map((_:any, i:any) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  };

  const renderPenjualanCharts = (dataObj: any) => {
    const main = dataObj.main || [];
    // const breakdown = dataObj.breakdown || [];
    const summary = dataObj.summary || [];
    const summary2 = dataObj.summary2 || [];

    return (
      <>
        <div>
          <h4 className="text-lg font-semibold">1) Fluktuasi Penjualan per Jenis (harian)</h4>
          <p className="text-sm text-gray-600 mb-2">Tren jumlah hewan terjual tiap hari per jenis.</p>
        </div>
        <div className="h-[260px]">
          <LineChartWrapper data={main} keys={["sapi","kambing","domba"]} />
        </div>

        <div>
          <h4 className="text-lg font-semibold mt-4">2) Kanal Transaksi (agregat periode)</h4>
          <p className="text-sm text-gray-600 mb-2">Distribusi penjualan berdasarkan kanal.</p>
        </div>
        <div className="h-[260px] flex justify-center">
          <ResponsiveContainer width="50%">
            <PieChart>
              <Pie data={summary} dataKey="value" nameKey="name" outerRadius={90} label>
                {summary.map((_: any, i: any) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-lg font-semibold mt-4">3) Metode Pembayaran (agregat)</h4>
          <p className="text-sm text-gray-600 mb-2">Jumlah transaksi per metode pembayaran.</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer>
            <BarChart data={summary2}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  };

  const renderStokCharts = (dataObj: any) => {
    const main = dataObj.main || [];
    // const breakdown = dataObj.breakdown || [];
    const summary = dataObj.summary || [];
    const currentStock = dataObj.currentStock || {};

    return (
      <>
        <div>
          <h4 className="text-lg font-semibold">1) Fluktuasi Masuk vs Dipakai (Konsentrat & Hay)</h4>
          <p className="text-sm text-gray-600 mb-2">Menampilkan barang masuk dan pemakaian harian.</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer>
            <AreaChart data={main}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="masuk_konsentrat" stroke={COLORS[0]} fill={COLORS[0]} opacity={0.5}/>
              <Area type="monotone" dataKey="dipakai_konsentrat" stroke={COLORS[3]} fill={COLORS[3]} opacity={0.45}/>
              <Area type="monotone" dataKey="masuk_hay" stroke={COLORS[1]} fill={COLORS[1]} opacity={0.45}/>
              <Area type="monotone" dataKey="dipakai_hay" stroke={COLORS[2]} fill={COLORS[2]} opacity={0.4}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-lg font-semibold mt-4">2) Stok Saat Ini (snapshot terakhir)</h4>
          <p className="text-sm text-gray-600 mb-2">Jumlah stok terakhir per jenis pakan/obat.</p>
        </div>
        <div className="h-[300px]">
          {/* breakdown is array of objects with {date, konsentrat, hay, vitamin, antibiotik}, we take last snapshot */}
          <ResponsiveContainer>
            <BarChart data={[currentStock]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={() => "Current"} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="konsentrat" name="Konsentrat" fill={COLORS[0]} />
              <Bar dataKey="hay" name="Hay" fill={COLORS[1]} />
              <Bar dataKey="vitamin" name="Vitamin" fill={COLORS[2]} />
              <Bar dataKey="antibiotik" name="Antibiotik" fill={COLORS[3]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-lg font-semibold mt-4">3) Asal Pakan (Pengadaan Sendiri vs Beli)</h4>
          <p className="text-sm text-gray-600 mb-2">Perbandingan sumber pengadaan selama periode.</p>
        </div>
        <div className="h-[260px] flex justify-center">
          <ResponsiveContainer width="50%">
            <PieChart>
              <Pie data={summary} dataKey="value" nameKey="name" outerRadius={90} label>
                {summary.map((_:any, i:any) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  };

  const renderJadwalCharts = (dataObj: any) => {
    const main = dataObj.main || [];
    const breakdown = dataObj.breakdown || [];
    const summary = dataObj.summary || [];

    return (
      <>
        <div>
          <h4 className="text-lg font-semibold">1) Aktivitas Harian (jumlah tugas per kategori)</h4>
          <p className="text-sm text-gray-600 mb-2">Menunjukkan pembersihan, pemberian pakan, kontrol kesehatan per hari.</p>
        </div>
        <div className="h-[260px]">
          <BarChartWrapper data={main} keys={["pembersihan","pemberianPakan","kontrolKesehatan"]} />
        </div>

        <div>
          <h4 className="text-lg font-semibold mt-4">2) Per Petugas (total tugas selama periode)</h4>
          <p className="text-sm text-gray-600 mb-2">Total beban kerja per petugas (aggregated).</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer>
            <BarChart data={breakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill={COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-lg font-semibold mt-4">3) Distribusi Aktivitas (agregat)</h4>
          <p className="text-sm text-gray-600 mb-2">Persentase distribusi ketiga jenis aktivitas selama periode.</p>
        </div>
        <div className="h-[260px] flex justify-center">
          <ResponsiveContainer width="50%">
            <PieChart>
              <Pie data={summary} dataKey="value" nameKey="name" outerRadius={90} label>
                {summary.map((_:any, i:any) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  };

  // small wrappers to reduce repeated code:
  const BarChartWrapper = ({ data, keys }: { data: any[], keys: string[] }) => (
    <ResponsiveContainer>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {keys.map((k, i) => <Bar key={k} dataKey={k} fill={COLORS[i % COLORS.length]} />)}
      </BarChart>
    </ResponsiveContainer>
  );

  const LineChartWrapper = ({ data, keys }: { data: any[], keys: string[] }) => (
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {keys.map((k, i) => <Line key={k} dataKey={k} stroke={COLORS[i % COLORS.length]} />)}
      </LineChart>
    </ResponsiveContainer>
  );

  // const LineChartWrapperShort = ({ data, keys }: { data: any[], keys: string[] }) => (
  //   <LineChartWrapper data={data} keys={keys} />
  // );

  // Export renderers mapping
  const renderers: Record<string, (d: any) => JSX.Element> = {
    "Populasi Hewan Ternak": renderPopulasiCharts,
    "Kesehatan": renderKesehatanCharts,
    "Penjualan": renderPenjualanCharts,
    "Stok Makanan": renderStokCharts,
    "Jadwal Petugas": renderJadwalCharts,
  };

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <section className="pt-16 flex flex-col items-center mb-20 mx-4" style={{ paddingLeft: "80px" }}>
      <MainPanel>
        <WhiteSection>
          <div className="p-8 bg-[#fffdf9]/90 rounded-2xl shadow-lg border border-gray-100">

            {/* HEADER */}
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <AiTwotonePieChart className="text-6xl text-farmdarkestbrown" />
              <div>
                <h2 className="text-2xl font-extrabold text-farmdarkestbrown">Generate Laporan</h2>
                <p className="text-sm text-[#724e3a]">Pilih periode dan jenis laporan yang ingin dibuat.</p>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <InputElement
                  inputPlaceholder="Masukkan Tanggal Awal"
                  forwhat="startDate"
                  labelMessage="Tanggal Awal"
                  typeInput="date"
                  format={"DD-MM-YYYY"}
                  inputName="startDate"
                  value={formData.startDate ? dayjs(formData.startDate) : null}
                  onChange={(d: Dayjs | null) => setFormData((prev) => ({ ...prev, startDate: d ? d.format("YYYY-MM-DD") : "" }))}
                />
                <InputElement
                  inputPlaceholder="Masukkan Tanggal Akhir"
                  forwhat="endDate"
                  labelMessage="Tanggal Akhir"
                  typeInput="date"
                  inputName="endDate"
                  format={"DD-MM-YYYY"}
                  value={formData.endDate ? dayjs(formData.endDate) : null}
                  onChange={(d: Dayjs | null) => setFormData((prev) => ({ ...prev, endDate: d ? d.format("YYYY-MM-DD") : "" }))}
                />

                <SearchableSelect
                  forwhat="reportType"
                  labelMessage="Jenis Laporan"
                  placeholder="Pilih jenis laporan"
                  options={[
                    { value: "Populasi Hewan Ternak", label: "Populasi Hewan Ternak" },
                    { value: "Kesehatan", label: "Kesehatan" },
                    { value: "Penjualan", label: "Penjualan" },
                    { value: "Stok Makanan", label: "Stok Makanan" },
                    { value: "Jadwal Petugas", label: "Jadwal Petugas" },
                  ]}
                  value={formData.reportType}
                  onChange={(opt) => setFormData((prev) => ({ ...prev, reportType: opt?.value || "" }))}
                />

                <SearchableSelect
                  forwhat="format"
                  labelMessage="Format File"
                  placeholder="Pilih format"
                  options={[
                    { value: "pdf", label: "PDF" },
                    { value: "excel", label: "Excel" },
                  ]}
                  value={formData.format}
                  onChange={(opt) => setFormData((prev) => ({ ...prev, format: opt?.value || "" }))}
                />
              </div>

              <div className="flex justify-end mt-8">
                <Button type="submit" variant="bg-farmbrown hover:bg-farmdarkestbrown text-white px-8 py-3 rounded-full w-full">Generate</Button>
              </div>
            </form>

            {/* CHARTS */}
            {chartData && (
              
              <div className="mt-12 space-y-8">
                <h3 className="text-xl font-bold text-center">{formData.reportType}, Periode {dayjs(formData.startDate).format("DD-MM-YYYY")} s.d. {dayjs(formData.endDate).format("DD-MM-YYYY")}</h3>

                {/* render the corresponding charts for selected report */}
                <div className="space-y-6">
                  {renderers[formData.reportType] ? renderers[formData.reportType](chartData) : (
                    <p className="text-sm text-gray-600">Pilih jenis laporan lalu klik Generate untuk melihat chart.</p>
                  )}
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
