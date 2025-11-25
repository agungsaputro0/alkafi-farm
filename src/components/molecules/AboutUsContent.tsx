import { FC } from "react";
import OurFocus from "../molecules/OurFocus";
import AlkafiFarmRole from "../molecules/AlkafiFarmRole";
import ContactUs from "./ContactUs";

const teamMembers = [
  { name: "Agung Budi Saputro", img: "/assets/img/teams/agung.jpeg", role: "2702389631" },
  { name: "Ahmad Saefudin Zuhri", img: "/assets/img/teams/zuhri.jpg", role: "2702389650" },
  { name: "Beby Omy Sion Saragih", img: "/assets/img/teams/beby.jpeg", role: "2702389612" },
  { name: "Muhammad Henggargalih", img: "/assets/img/teams/henggar.jpeg", role: "2702389796" },
  { name: "Tiara Febriana Yosephine", img: "/assets/img/teams/yoshi.jpeg", role: "2702389846" },
];

const AboutUsContent: FC = () => {
  return (
    <>
      <section className="pt-[65px] flex justify-center">
        <div className="w-full">
          <div className="w-full max-w-full">
            {/* Hero Section */}
            <div
              style={{
                backgroundImage: "url('/assets/img/about-us-hero.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                color: "white",
                paddingTop: "7rem",
                paddingBottom: "7rem",
                textAlign: "center",
              }}
            >
              <h1
                style={{ marginLeft: "10px", marginRight: "10px" }}
                className="text-3xl font-bold font-spring tracking-widest uppercase"
              >
                <span className="text-farmdarkestbrown">Alkafi Farm</span>
              </h1>
              <p
                style={{ marginLeft: "10px", marginRight: "10px" }}
                className="text-xl font-spring mt-4 text-farmgrassgreen"
              >
                Gathering Moments, Growing Dreams
              </p>
            </div>

            {/* About Us Section */}
            <section className="bg-farmlightbrown py-16 px-4 md:px-32 text-center">
              {/* Ikon pemisah */}
              <div className="flex justify-center items-center mb-2 pt-2">
                <div className="w-16 h-px bg-gray-300"></div>
                <div className="mx-4 text-yellow-500 text-2xl">
                  <img src="/assets/img/alkafi-farm-icon.png" className="w-20 h-20" />
                </div>
                <div className="w-16 h-px bg-gray-300"></div>
              </div>
              <h2 className="text-gray-800 mb-4 text-3xl font-spring mt-8 font-semibold">
                Tentang Alkafi Farm
              </h2>
              <p
                style={{ fontSize: "1.02em" }}
                className="text-gray-600 w-full pb-2 text-justify"
              >
                Alkafi Farm merupakan inisiatif di bidang peternakan terpadu yang berfokus pada pengembangan ternak secara berkelanjutan dan berbasis data. Kami berkomitmen untuk menghadirkan sistem pemeliharaan modern yang menekankan kesejahteraan hewan, efisiensi produksi, dan keberlanjutan lingkungan.
              </p>
              <p className="text-gray-600 w-full pt-4 text-justify">
                Melalui penerapan manajemen yang terukur serta kolaborasi dengan berbagai pihak, Alkafi Farm tidak hanya berperan sebagai tempat produksi, tetapi juga sebagai mitra strategis dalam pengembangan sektor peternakan daerah. Kami berupaya mendukung ketahanan pangan, peningkatan ekonomi lokal, dan penyediaan produk ternak berkualitas bagi masyarakat.
              </p>
            </section>
            <OurFocus />
            <AlkafiFarmRole />
            {/* Meet the Team Section */}
            <section className="bg-farmdarkgreen py-2 px-4 md:px-20 text-center">
              <h3 className="text-kemenkeuyellow mb-4 text-2xl font-bold pt-8 pb-2">
                Tim Pengembang
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 pb-8 md:grid-cols-5 gap-8 justify-items-center">
                {teamMembers.map((person, index) => (
                  <div
                    key={index}
                    className="hover:scale-105 transition-transform duration-300"
                  >
                    <div
                      style={{
                        width: "128px",
                        height: "128px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "2px solid #ccc",
                        backgroundColor: "#f0f0f0",
                        margin: "0 auto",
                      }}
                    >
                      <img
                        src={person.img}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="mt-4 font-medium text-amber-400">
                      {person.name}
                    </p>
                    <p className="text-sm text-gray-100">{person.role}</p>
                  </div>
                ))}
              </div>
            </section>
            <ContactUs />
            {/* Mission and Vision Section */}
            
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUsContent;
