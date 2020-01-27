import { useRouter } from "next/router";

import Nav from "../components/nav";

const greetings = ["hello", "saluton", "hei", "bonjour", "guten tag", "aloha"];

export default function HomePage() {
  const router = useRouter();
  const { path = [] } = router.query;
  const [greeting] = path;
  const next = greetings[(greetings.indexOf(greeting) + 1) % greetings.length];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Nav />
      <div className="bg-black text-white text-center text-5xl shadow-lg py-12">
        <h1 className="tracking-wider">
          <a href={`/${next}`}>
            {greeting && (
              <strong className="capitalize">{greeting},&nbsp;</strong>
            )}
            Next.js + Tailwind CSS
          </a>
        </h1>
      </div>
    </div>
  );
}
