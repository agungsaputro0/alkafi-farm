import { FC } from "react";
import EventPromoSection from "./EventPromoSection";
import EventSection from "./EventSection";

const EventPromoPage: FC = () => {
  return (
    <>
    <section className="pt-[65px] flex justify-center">
        <div className="w-full">
          <div className="w-full max-w-full">
      {/* Hero Promo */}
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
                <span className="text-farmdarkestbrown">
                    Promo Spesial Akhir Tahun!
                </span>
                </h1>

                <p
                style={{ marginLeft: "10px", marginRight: "10px" }}
                className="text-xl font-spring mt-4 text-farmgrassgreen"
                >
                Rayakan akhir tahun dengan penawaran terbaik untuk produk unggulan Alkafi Farm.
                </p>

                <button
                className="mt-6 px-8 py-4 bg-farmdarkgreen text-white font-semibold rounded-full 
                            hover:bg-farmgrassgreen transition-all duration-300"
                >
                Lihat Promo Sekarang
                </button>

            </div>

      {/* Event & Promo */}
      <EventSection />
      <EventPromoSection />
      </div>
      </div>
      </section>
    </>
  );
};

export default EventPromoPage;
