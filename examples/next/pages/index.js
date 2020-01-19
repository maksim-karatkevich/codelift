import Nav from "../components/nav";

export default function HomePage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Nav />
      <div className="bg-black text-white text-center text-5xl shadow-lg py-12">
        <h1 className="tracking-wider">Next.js + Tailwind css</h1>
      </div>
    </div>
  );
}
