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
        <button className="w-full rounded-full shadow-lg !py-4 text-lg bg-the-green bg-linear-to-r from-woo-white/0 via-woo-white/40 to-woo-white/0">
          {name}
        </button>
      </Link>
    );
  } else {
    return (
      <button
        onClick={onClickFunction}
        className="w-full text-center rounded-full shadow-lg !py-4 text-lg bg-the-green bg-linear-to-r from-woo-white/0 via-woo-white/40 to-woo-white/0"
      >
        {name}
      </button>
    );
  }
}

export default PrimaryButton;
