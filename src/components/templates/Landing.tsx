import Button from "../atoms/Button";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from "react-router-dom";
import { GrCatalog } from "react-icons/gr";
import { RiCustomerService2Line } from "react-icons/ri";
import { useState } from "react";
import useIsMobile from "../hooks/UseIsMobile";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import useScreenSize from '../hooks/UseScreenSize';

type LandingProps = {
  layoutMessage: string;
  layoutTitle: string;
  layoutSubtitle: string;
};

const sampleImages = [
  { 
    src: "/assets/img/farm-gallery1.jpg", 
    title: "Kandang Kambing", 
    desc: "Area kandang kambing yang tertata rapi dengan ventilasi alami untuk menjaga kesehatan ternak." 
  },
  { 
    src: "/assets/img/farm-gallery2.jpg", 
    title: "Kandang Sapi Jantan", 
    desc: "Sapi jantan di area perawatan dengan pengawasan langsung dari peternak Alkafi Farm." 
  },
  { 
    src: "/assets/img/farm-gallery3.jpg", 
    title: "Penimbangan Ternak", 
    desc: "Proses penimbangan ternak untuk memantau pertumbuhan dan kesehatan hewan." 
  },
  { 
    src: "/assets/img/farm-gallery4.jpg", 
    title: "Kandang Domba", 
    desc: "Area kandang domba dengan sistem pemeliharaan yang bersih dan nyaman." 
  },
  { 
    src: "/assets/img/farm-gallery5.jpg", 
    title: "Proses Fattening", 
    desc: "Sapi menjalani proses penggemukan dengan pakan berkualitas di kandang utama." 
  },
];


const LandingLayouts = (props: LandingProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { layoutTitle, layoutSubtitle,  layoutMessage } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const width = useScreenSize();
  const width1350 = width <= 1350 && width > 1200;
  const width1200 = width <= 1200;
  const centeredSlides = width <= 1024; 

  return (
    <div className="min-h-screen-default mt-16 w-full py-10 flex flex-col lg:flex-row relative bg-cover bg-center">
      {/* Overlay hitam transparan */}
      <div className="absolute inset-0 bg-black/10 z-0"></div>

      {/* Konten Kiri */}
      <div className="flex items-center justify-center w-full lg:w-1/2 px-6 sm:px-12 lg:px-16 z-10 order-1 lg:order-none">
        <div className="max-w-lg text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-spring text-farmgrassgreen leading-tight drop-shadow-lg font-light">
            {layoutTitle}
          </h1>
          <h2 className="mt-1 text-xl sm:text-xl lg:text-xl font-spring text-farmgreen drop-shadow-md font-extralight">
            {layoutSubtitle}
          </h2>
          <p className="mt-4 text-md sm:text-md text-rajutGray text-justify lg:text-justify drop-shadow-md">
            {layoutMessage}
          </p>

          {/* Tombol */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
           <Button
                message=""
                onClick={() => navigate("/Katalog")}
                variant="flex items-center justify-center gap-2 min-h-10 bg-farmgrassgreen hover:bg-farmgreen text-white px-6 rounded-full font-poppins"
                >
                <GrCatalog className="text-lg" />
                <span>Lihat Katalog</span>
            </Button>

            <Button
              message=""
              onClick={() => navigate("/AboutUs", { state: { scrollTo: "ContactUs" } })}
              variant="flex items-center justify-center gap-2 min-h-10 bg-transparent border-[0.22em] border-farmgrassgreen text-farmgrassgreen hover:bg-farmgreen hover:text-white px-6 rounded-full font-poppins"
            >
              <RiCustomerService2Line className="text-lg" />
              Hubungi Kami
            </Button>
          </div>
        </div>
      </div>

      {/* Konten Kanan: Gambar */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center px-4 my-8 lg:mt-0 `}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={12} 
          slidesPerView={isMobile ? 1 : width1350 ? 2 : width1200 ? 1.6 : 2.6}
          pagination={{ clickable: true }}
          autoplay={{ delay: 1800 }}
          className={`${
            isMobile ? 'w-[90vw]' : 'w-[85%]'
          } max-w-5xl`} // perlebar container Swiper-nya
          centeredSlides={centeredSlides}
          loop
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        >
          {sampleImages.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                className={`relative rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ease-in-out
                ${index === activeIndex ? 'scale-110 z-20 mr-[12px]' : 'scale-95 opacity-90'}
              `}
                style={{ transformOrigin: 'bottom center' }}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-[22rem] md:h-[26rem] object-cover" // perbesar tinggi gambar
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white p-5">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm opacity-80 line-clamp-2">{item.desc}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </div>
  );
};

export default LandingLayouts;
