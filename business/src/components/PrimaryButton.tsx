import { Link } from "@tanstack/react-router";
import React from "react";

interface PrimaryButtonProps{
  path: string | null,
  name: string,
  onClickFunction: () => void,
}

function PrimaryButton({path, name, onClickFunction}: PrimaryButtonProps) {
  if (path) {
    return (
      <Link to={path} onClick={onClickFunction} className="text-center">
        <button className="rounded-full shadow-lg hover:text-woo-white !px-4 !py-2 bg-the-green bg-linear-to-r from-woo-white/0 via-woo-white/40 to-woo-white/0 transition-all duration-200 cursor-pointer">
          {name}
        </button>
      </Link>
    );
  } else {
    return (
      <button
        onClick={onClickFunction}
        className="rounded-full shadow-lg hover:text-woo-white !px-4 !py-2 bg-the-green bg-linear-to-r from-woo-white/0 via-woo-white/40 to-woo-white/0 transition-all duration-200 cursor-pointer"
      >
        {name}
      </button>
    );
  }
}

export default PrimaryButton;
