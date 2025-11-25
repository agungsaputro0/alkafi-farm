import React, { useState } from "react";
import { TimePicker, Switch, Button, Input } from "antd";
import dayjs from "dayjs";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const SchedulePanel: React.FC = () => {
  const [openTime, setOpenTime] = useState(dayjs("08:00", "HH:mm"));
  const [closeTime, setCloseTime] = useState(dayjs("17:00", "HH:mm"));
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleAllDays = () => {
    if (selectedDays.length === daysOfWeek.length) {
      setSelectedDays([]);
    } else {
      setSelectedDays([...daysOfWeek]);
    }
  };

  const saveSettings = () => {
    console.log("Saved schedule:", { openTime, closeTime, selectedDays, note });
    // implement save logic here
  };

  return (
    <div className="bg-white/10 rounded-xl p-5 shadow-md text-cyan-100">
      {/* Judul */}
      <div className="flex items-center border-b border-white pb-4 mb-4">
        <h2 className="text-3xl font-semibold text-white">Operating Schedule Panel</h2>
      </div>

      {/* Jam Buka & Tutup */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-md p-3">
          <label className="text-white text-sm">Opening Time</label>
          <TimePicker
            value={openTime}
            onChange={(time) => time && setOpenTime(time)}
            format="HH:mm"
            className="w-full mt-1"
          />
        </div>
        <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-md p-3">
          <label className="text-white text-sm">Closing Time</label>
          <TimePicker
            value={closeTime}
            onChange={(time) => time && setCloseTime(time)}
            format="HH:mm"
            className="w-full mt-1"
          />
        </div>
      </div>

      {/* Pilih Hari */}
      <div className="mb-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-md p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-semibold">Select Days</span>
          <Button size="small" onClick={toggleAllDays}>
            {selectedDays.length === daysOfWeek.length ? "Deselect All" : "Select All"}
          </Button>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3">
  {daysOfWeek.map((day) => (
    <div
      key={day}
      className="flex items-center justify-between bg-white/10 p-3 rounded-md cursor-pointer hover:bg-white/20 transition text-sm"
      onClick={() => toggleDay(day)}
    >
      <span className="truncate">{day}</span>
      <Switch
        size="small"
        checked={selectedDays.includes(day)}
        onChange={(_val) => toggleDay(day)}
        onClick={(_, e) => e.stopPropagation()}
      />
    </div>
  ))}
</div>

      </div>

      {/* Catatan */}
      <div className="mb-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-md p-3">
        <label className="text-white text-sm mb-1 block">Notes</label>
        <Input.TextArea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add any notes about the schedule..."
        />
      </div>

      {/* Tombol Save */}
      <div className="flex justify-end">
        <Button type="primary" onClick={saveSettings}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SchedulePanel;
