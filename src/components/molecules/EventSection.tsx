import { FC } from "react";
import EventCard from "../atoms/EventCard";
import eventData from "../pseudo_db/event.json";

const EventSection: FC = () => {
  return (
    <section className="bg-farmlightbrown py-16 px-6 md:px-20">
      
      <h2 className="text-2xl font-bold text-center text-farmdarkgreen mb-10">
        Kegiatan & Acara Alkafi Farm
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
        {eventData.map((event) => (
          <EventCard
            key={event.idEvent}
            foto={event.foto}
            judul={event.judul}
            deskripsi={event.deskripsi}
            ctaLabel={event.ctaLabel}
          />
        ))}
      </div>
    </section>
  );
};

export default EventSection;
