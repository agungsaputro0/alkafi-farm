import { FC, useMemo, useState } from "react";
import katalogData from "../pseudo_db/ekatalog.json";
import PromoKatalogCard from "../atoms/PromoKatalogCard";
import { unformatNumber } from "../utils/FormatNumberWithDelimiter";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import useIsMobile from "../hooks/UseIsMobile";
import useScreenSize from "../hooks/UseScreenSize";

const MAX_PROMO = 5;

const EventPromoSection: FC = () => {
  const isMobile = useIsMobile();
  const width = useScreenSize();
  const [_activeIndex, setActiveIndex] = useState(0);

  const width1350 = width <= 1350 && width > 1200;
  const width1200 = width <= 1200;
  const centeredSlides = width <= 1024;

  // pilih maksimal 5 produk secara acak
  const promoItems = useMemo(() => {
    const shuffled = [...katalogData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, MAX_PROMO);
  }, []);

  return (
    <section className="bg-gray-200 py-16 px-6 md:px-20">
      <h2 className="text-2xl font-bold text-center mb-10">
        Penawaran Spesial Hari Ini!
      </h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={
          isMobile ? 1 : width1350 ? 2 : width1200 ? 3 : 4
        }
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        centeredSlides={centeredSlides}
        loop
        className={`${isMobile ? "w-[90vw]" : "w-[95%]"} mx-auto`}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {promoItems.map((item) => (
          <SwiperSlide key={item.idKatalog} className="flex justify-center">
            <PromoKatalogCard
              foto={item.foto[0]}
              namaProduk={item.namaProduk}
              kategori={item.kategori}
              stok={item.stok}
              harga={unformatNumber(item.harga)}
              deskripsi={item.deskripsi}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default EventPromoSection;
