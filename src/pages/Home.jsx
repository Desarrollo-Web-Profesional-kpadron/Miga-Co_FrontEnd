import Navbar from "../pages/Navbar";
import Hero from "../pages/Hero";
import ChatButton from "../pages/ChatButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
      </main>
      <ChatButton />
    </>
  );
}
