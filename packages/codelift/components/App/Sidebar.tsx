import { FunctionComponent } from "react";

export const Sidebar: FunctionComponent = ({ children }) => (
  <aside className="bg-gray-900 flex flex-col justify-start h-screen overflow-auto shadow-inner">
    {children}
  </aside>
);
