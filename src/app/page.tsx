import Image from "next/image";
import Hero from "./components/HeroSection";
import EventsNear from "./components/EventsNear";
import UpcomingOnlineEvents from "./components/Upcoming";
import SpotlightSection from "./components/Spotlight";

export default function Home() {
  return (
    <>
      <Hero />
      <EventsNear />
      <UpcomingOnlineEvents />
      <SpotlightSection />
    </>
  );
}
