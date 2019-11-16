import React, { FunctionComponent, useEffect, useState } from "react";

import { observer, useStore } from "../Store";

export const Sidebar: FunctionComponent = observer(({ children }) => {
  const store = useStore();

  // useEffect(() => {
  //   const html = document.documentElement;

  //   html.style.transition = "margin-left 0.2s";

  //   if (store.isOpen) {
  //     html.classList.add("ml-64");
  //   } else {
  //     html.classList.remove("ml-64");
  //   }
  // }, [store.isOpen]);

  return (
    <aside
      className="flex flex-col h-screen bg-gray-900 shadow-inner justify-center tracking-widest"
      style={{
        // left: store.isOpen ? 0 : "-16em",
        textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)"
        // transition: "left 0.02s"
      }}
    >
      {children}
    </aside>
  );
});
