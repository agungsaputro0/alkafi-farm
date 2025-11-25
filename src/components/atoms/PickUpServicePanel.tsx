import React, { useState } from "react";
import { Switch, Input, Checkbox, TimePicker, DatePicker, Table, Button } from "antd";
import dayjs from "dayjs";

interface PickupServicePanelProps {
  initialMeetingPoint?: boolean;
  initialDoorToDoor?: boolean;
}

interface MeetingPoint {
  key: number;
  location: string;
  openingTime: string;
  closingTime: string;
  scheduleType: "byDate" | "byDay";
  scheduleValue: string;
  notes: string;
}

const PickupServicePanel: React.FC<PickupServicePanelProps> = ({
  initialMeetingPoint = false,
  initialDoorToDoor = false,
}) => {
  const [meetingPoint, setMeetingPoint] = useState(initialMeetingPoint);
  const [doorToDoor, setDoorToDoor] = useState(initialDoorToDoor);
  const [doorNotes, setDoorNotes] = useState("Administrator wants pick up door to door if waste >= X kg");

  const [meetingPoints, setMeetingPoints] = useState<MeetingPoint[]>([]);
  const [newMeeting, setNewMeeting] = useState<Partial<MeetingPoint>>({
    key: 0,
    location: "",
    openingTime: "",
    closingTime: "",
    scheduleType: "byDate",
    scheduleValue: "",
    notes: "",
  });
  const [useForRoutine, setUseForRoutine] = useState(false);

  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleAddMeetingPoint = () => {
    if (!newMeeting.location) return;
    setMeetingPoints([...meetingPoints, { ...newMeeting, key: meetingPoints.length } as MeetingPoint]);
    setNewMeeting({ key: meetingPoints.length + 1, location: "", openingTime: "", closingTime: "", scheduleType: "byDate", scheduleValue: "", notes: "" });
    setSelectedDays([]);
  };

  const columns = [
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Opening Time", dataIndex: "openingTime", key: "openingTime" },
    { title: "Closing Time", dataIndex: "closingTime", key: "closingTime" },
    { title: "Schedule", key: "schedule", render: (_: any, record: MeetingPoint) => `${record.scheduleType}: ${record.scheduleValue}` },
    { title: "Notes", dataIndex: "notes", key: "notes" },
  ];

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="bg-white/10 rounded-xl p-5 shadow-md flex flex-col space-y-4 text-cyan-100">

      <div className="flex items-center border-b border-white pb-4">
        <h2 className="text-3xl font-semibold text-white">Pick Up Service</h2>
      </div>

      <p className="text-gray-300 text-sm mb-6">
        Configure whether the waste bank offers pickup services.
      </p>

      {/* Opsi Pick Up */}
      <div className="flex flex-col gap-4">
        {/* Meeting Point */}
        <div
          className="flex items-center justify-between bg-white/10 p-4 rounded-lg cursor-pointer hover:bg-white/20 transition"
          onClick={() => setMeetingPoint(!meetingPoint)}
        >
          <span className="text-white">Meeting Point Based</span>
          <Switch
            checked={meetingPoint}
            onChange={(val) => setMeetingPoint(val)}
            onClick={(_, e) => e.stopPropagation()}
          />
        </div>

        {/* Form Meeting Point */}
        {meetingPoint && (
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-4 mt-2 flex flex-col gap-4 text-gray-100">
            <h3 className="font-semibold mb-2 border-b borer-white pb-2">Add Meeting Point</h3>
            
            <div className="flex flex-col gap-1">
              <label className="font-bold">Location</label>
              <Input
              placeholder="Location"
              value={newMeeting.location}
              onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
              className="
                bg-white/10
                backdrop-blur-md
                border border-white/20
                p-2
                text-white
                placeholder-gray-400
                focus:bg-white/10
                focus:border-white/20
                focus:text-white
                focus:outline-none
                focus:ring-0
              "
            />
            </div>

            <div className="flex gap-2">
              <div className="flex-1 flex flex-col gap-1">
                <label className="font-bold">Opening Time</label>
                <TimePicker
                  format="HH:mm"
                  placeholder="Opening Time"
                  value={newMeeting.openingTime ? dayjs(newMeeting.openingTime, "HH:mm") : null}
                  onChange={(_, timeString) =>
                    setNewMeeting({ ...newMeeting, openingTime: Array.isArray(timeString) ? timeString[0] : timeString || "" })
                  }
                  className="
                    bg-white/10
                    backdrop-blur-md
                    border border-white/20
                    text-white
                    placeholder-gray-400
                    focus:bg-white/10
                    focus:border-white/20
                    focus:text-white
                    focus:outline-none
                    focus:ring-0
                  "
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className="font-bold">Closing Time</label>
                <TimePicker
                  format="HH:mm"
                  placeholder="Closing Time"
                  value={newMeeting.closingTime ? dayjs(newMeeting.closingTime, "HH:mm") : null}
                  onChange={(_, timeString) =>
                    setNewMeeting({ ...newMeeting, closingTime: Array.isArray(timeString) ? timeString[0] : timeString || "" })
                  }
                  className="
                    bg-white/10
                    backdrop-blur-md
                    border border-white/20
                    text-white
                    placeholder-gray-400
                    focus:bg-white/10
                    focus:border-white/20
                    focus:text-white
                    focus:outline-none
                    focus:ring-0
                  "
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold">Schedule</label>
              <div className="flex gap-2 mt-2 mb-2">
                <div
                  className="bg-white/10 backdrop-blur-md border border-white/20  p-2 flex-1 cursor-pointer hover:bg-white/20 transition"
                  onClick={() => setNewMeeting({ ...newMeeting, scheduleType: "byDate" })}
                >
                  <Checkbox
                    checked={newMeeting.scheduleType === "byDate"}
                    onChange={() => setNewMeeting({ ...newMeeting, scheduleType: "byDate" })}
                    onClick={(e) => e.stopPropagation()} // agar checkbox klik sendiri tidak memicu div
                  >
                    By Date
                  </Checkbox>
                </div>

                <div
                  className="bg-white/10 backdrop-blur-md border border-white/20  p-2 flex-1 cursor-pointer hover:bg-white/20 transition"
                  onClick={() => setNewMeeting({ ...newMeeting, scheduleType: "byDay" })}
                >
                  <Checkbox
                    checked={newMeeting.scheduleType === "byDay"}
                    onChange={() => setNewMeeting({ ...newMeeting, scheduleType: "byDay" })}
                    onClick={(e) => e.stopPropagation()}
                  >
                    By Day
                  </Checkbox>
                </div>
              </div>


              {newMeeting.scheduleType === "byDate" ? (
                <DatePicker
                  onChange={(_, dateString) =>
                    setNewMeeting({ ...newMeeting, scheduleValue: Array.isArray(dateString) ? dateString[0] : dateString || "" })
                  }
                   className="
                      bg-white/10
                      backdrop-blur-md
                      border border-white/20
                      text-white
                      placeholder-gray-400
                      focus:bg-white/10
                      focus:border-white/20
                      focus:text-white
                      focus:outline-none
                      focus:ring-0
                    "
                />
              ) : (
                <div className="flex gap-1 flex-wrap">
                  <div className="grid grid-cols-2 gap-3">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="flex items-center justify-between bg-white/10 p-3 rounded-md cursor-pointer hover:bg-white/20 transition text-sm"
                      onClick={() => {
                        // toggle day saat container diklik
                        const updatedDays = selectedDays.includes(day)
                          ? selectedDays.filter(d => d !== day)
                          : [...selectedDays, day];
                        setSelectedDays(updatedDays);
                        setNewMeeting({ ...newMeeting, scheduleValue: updatedDays.join(", ") });
                      }}
                    >
                      <span className="truncate">{day}&nbsp;&nbsp;</span>
                      <Switch
                        size="small"
                        checked={selectedDays.includes(day)}
                        onChange={(_val) => {
                          // toggle juga saat switch diklik
                          const updatedDays = selectedDays.includes(day)
                            ? selectedDays.filter(d => d !== day)
                            : [...selectedDays, day];
                          setSelectedDays(updatedDays);
                          setNewMeeting({ ...newMeeting, scheduleValue: updatedDays.join(", ") });
                        }}
                        onClick={(_, e) => e.stopPropagation()} // agar tidak memicu onClick parent
                      />
                    </div>
                  ))}
                </div>

                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold">Notes</label>
              <Input.TextArea
                  placeholder="Notes"
                  value={newMeeting.notes}
                  onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                  className="
                    bg-white/10
                    backdrop-blur-md
                    border border-white/20
                    p-2
                    text-white
                    placeholder-gray-400
                    focus:bg-white/10
                    focus:border-white/20
                    focus:text-white
                    focus:outline-none
                    focus:ring-0
                  "
                />
            </div>

            <Checkbox checked={useForRoutine} onChange={(e) => setUseForRoutine(e.target.checked)}>
              Use this input for pick up service routine
            </Checkbox>

            <Button type="primary" onClick={handleAddMeetingPoint}>
              Add Meeting Point
            </Button>

            <Table
              columns={columns}
              dataSource={meetingPoints}
              pagination={false}
              className="mt-4 text-gray-100"
            />

            <Button type="primary" className="mt-4">
              Save Total
            </Button>
          </div>
        )}

        {/* Door to Door */}
        <div
          className="flex items-center justify-between bg-white/10 p-4 rounded-lg cursor-pointer hover:bg-white/20 transition"
          onClick={() => setDoorToDoor(!doorToDoor)}
        >
          <span className="text-white">Door to Door Based</span>
          <Switch
            checked={doorToDoor}
            onChange={(val) => setDoorToDoor(val)}
            onClick={(_, e) => e.stopPropagation()}
          />
        </div>

        {/* Form Door to Door */}
        {doorToDoor && (
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-4 mt-2 flex flex-col gap-4 text-gray-100">
            <h3 className="font-semibold mb-2 pb-2 border-b border-white">Door to Door Notes</h3>
            <Input.TextArea
              value={doorNotes}
              onChange={(e) => setDoorNotes(e.target.value)}
              placeholder="Enter notes for door to door pickup"
              className="
                    bg-white/10
                    backdrop-blur-md
                    border border-white/20
                    p-2
                    text-white
                    placeholder-gray-400
                    focus:bg-white/10
                    focus:border-white/20
                    focus:text-white
                    focus:outline-none
                    focus:ring-0
                  "
            />
            <Button type="primary">Save Notes</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickupServicePanel;
