import React from "react";

const LightButton = ({ children, isScrolled, setOpen }) => {
  return (
    <div>
      <button
        onClick={() => setOpen(false)}
        className={`font-bold py-4 px-8 rounded-3xl hover:text-yellow md:text-sm md:py-3 md:px-4 transition-all duration-200 bg-white text-maroon ${
          isScrolled
            ? "lg:bg-white lg:text-black lg:border-white lg:border-2 lg:hover:bg-maroon"
            : "lg:bg-maroon lg:text-white lg:border-maroon lg:border-2 lg:hover:bg-gray lg:hover:text-black"
        }`}
      >
        {children}
      </button>
    </div>
  );
};

export default LightButton;
