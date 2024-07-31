"use client";

import { useEffect } from "react";

export const FlowbiteClient = () => {
  useEffect(() => {
    require("flowbite/dist/flowbite.min.js");
  }, []);
  return null;
};

export const NavbarClient = () => {
  useEffect(() => {
    const toggleDropdown = () => {
      const dropdown = document.getElementById("user-dropdown");
      dropdown.classList.toggle("hidden");
    };

    const button = document.getElementById("user-menu-button");
    button.addEventListener("click", toggleDropdown);

    return () => {
      button.removeEventListener("click", toggleDropdown);
    };
  }, []);
  return null;
};
