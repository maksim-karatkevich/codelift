import React, { FunctionComponent, useEffect, useState } from "react";

export const Panel: FunctionComponent = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const html = document.documentElement;

    html.style.transition = "margin-left 0.2s";
    html.classList.add("ml-64");

    setIsOpen(true);

    return () => {
      html.classList.remove("ml-64");

      setIsOpen(false);
    };
  }, [isOpen]);

  return (
    <div
      className="flex flex-col w-64 z-50 fixed top-0 shadow-lg h-full bg-gray-800 text-white"
      style={{
        left: isOpen ? 0 : "-16em",
        transition: "left 0.2s"
      }}
    >
      {children}
    </div>
  );
};
