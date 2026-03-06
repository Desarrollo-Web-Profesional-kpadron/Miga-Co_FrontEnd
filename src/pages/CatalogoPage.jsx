import Navbar from "../pages/Navbar";
import Catalog from "../components.Modulo2/Catalog";
import ChatButton from "../pages/ChatButton";

export default function CatalogoPage() {
  return (
    <>
      <Navbar />
      <main>
        <Catalog />
      </main>
      <ChatButton />
    </>
  );
}
