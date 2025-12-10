import React, { useState } from "react";
import { Layout } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { GiGoat } from "react-icons/gi";
import { MdGrass, MdOutlineEditCalendar } from "react-icons/md";
import { FaSuitcaseMedical } from "react-icons/fa6";
import { BiTask } from "react-icons/bi";


const { Sider } = Layout;

type MenuItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: { key: string; label: string; path: string }[];
};

const PortalSidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [openKeys, setOpenKeys] = useState<string | null>(null);
  const { userRole } = useAuth();
  const navigate = useNavigate();

  const handleRedirect = (path: string) => navigate(path);

  // Misal userRole sudah didefinisikan sebelumnya
let menuItems: MenuItem[] = [];

if (userRole === 2) {
  menuItems = [
    {
      key: "dashboard",
      label: "Home",
      icon: <HomeOutlined />,
      path: "/Portal",
    },
    {
      key: "hewan_ternak",
      label: "Hewan Ternak",
      icon: <GiGoat />,
      children: [
        { key: "ternak-repository", label: "Repository Ternak", path: "/ternak/repository" },
        { key: "ternak-penimbangan", label: "Penimbangan", path: "/ternak/penimbangan" },
        { key: "ternak-kesehatan", label: "Kesehatan Ternak", path: "/ternak/kesehatan" },
        { key: "ternak-monitoring", label: "Monitoring Siklus", path: "/ternak/monitoring" },
      ],
    },
    {
      key: "stok_pakan",
      label: "Stok Pakan",
      icon: <MdGrass />,
      path: "/StokPakan",
    },
    {
      key: "gudang_obat",
      label: "Gudang Obat",
      icon: <FaSuitcaseMedical />,
      path: "/GudangObat",
    },
    {
      key: "jadwal",
      label: "Jadwal Tugas",
      icon: <MdOutlineEditCalendar />,
      children: [
        { key: "jadwal-kandang", label: "Bersih Kandang", path: "/jadwal/kandang" },
        { key: "jadwal-pakan", label: "Pemberian Pakan", path: "/jadwal/pakan" },
      ],
    },
  ];
} else if (userRole === 3) {
  menuItems = [
    {
      key: "dashboard",
      label: "Home",
      icon: <HomeOutlined />,
      path: "/Portal",
    },
    {
      key: "task_list",
      label: "Task List",
      icon: <BiTask />,
      path: "/TaskList",
    },
  ];
}
  return (
    <Sider
      width={expanded ? 210 : 80}
      collapsedWidth={80}
      className={`transition-all duration-300 ease-in-out sidebar bg-white/10 backdrop-blur-md backdrop-saturate-150 border border-white/20 shadow-lg ring-1 ring-white/10 ${
        expanded ? "sidebar-expanded" : ""
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => {
        setExpanded(false);
        setOpenKeys(null);
      }}
    >
      {/* Logo */}
      <div
        onClick={() => navigate("/portal")}
        className="flex items-center mt-4 px-4 ml-[3px] h-12 overflow-hidden cursor-pointer"
      >
        <img src="/assets/img/alkafi-farm-icon.png" alt="RCE Logo" className="h-10 w-10" />
        {expanded && (
          <span className="ml-2 font-spring font-semibold text-white whitespace-nowrap mt-2 text-[1.4em] transition-all duration-200 align-middle">
            <span className="border-kemenkeuyellow"></span>&nbsp;Alkafi Farm
          </span>
        )}
      </div>

      {/* Menu */}
      <div className="mt-6">
        {menuItems.map((item) => (
          <div key={item.key} className="text-white">
            <div
              className={`flex items-center h-12 ml-2 mr-2 rounded-lg cursor-pointer sidebar-menu-item transition-all duration-300 hover:bg-white/20 ${
                expanded ? "px-4 justify-start" : "justify-center"
              }`}
              onClick={() =>
                item.children
                  ? setOpenKeys(openKeys === item.key ? null : item.key)
                  : item.path && handleRedirect(item.path)
              }
            >
              <div className="text-white text-xl">{item.icon}</div>
              {expanded && <span className="ml-3 text-white whitespace-nowrap">{item.label}</span>}
            </div>

            {/* Submenu */}
            {item.children && (
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openKeys === item.key && expanded ? "max-h-96" : "max-h-0"
                }`}
              >
                {item.children.map((child) => (
                  <div
                    key={child.key}
                    onClick={() => handleRedirect(child.path)}
                    className="mx-2 h-12 flex items-center cursor-pointer rounded-lg hover:bg-white/20"
                  >
                    {/* Label dengan margin-left khusus */}
                    <span className="ml-[52px] text-sm text-white/90 hover:text-white hover:font-bold whitespace-nowrap">
                      {child.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Sider>
  );
};

export default PortalSidebar;
