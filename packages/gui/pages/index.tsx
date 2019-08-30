import dynamic from "next/dynamic";

import "tailwindcss/dist/tailwind.css";

const AppClient = dynamic(
  async () => {
    const { App } = await import("../components/App");

    return App;
  },
  {
    ssr: false
  }
);

export default () => <AppClient />;
