import { AiOutlineSend } from "react-icons/ai";
import { Link } from "@tanstack/react-router";
import React, { JSX } from "react";

interface SecondaryButtonProps{
  path: string | null,
  name: string,
  onClickFunction: () => void,
}

export const  SecondaryButton = ({path, name, onClickFunction}: SecondaryButtonProps) => {
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

interface SecondaryButtonProps{
  path: string | null,
  name: string,
  onClickFunction: () => void,
}


export const SecondaryButtonWithSendIcon = (): JSX.Element => 
  (
    <div className="flex items-center !p-1 border-the-green shadow-lg border-[2px] rounded-full">
      <p className="flex-1 text-center">Enter a code</p>
      <button className="bg-the-green h-full !p-4 aspect-square rounded-full">
        <AiOutlineSend className="-rotate-45 text-2xl translate-x-0.5" />
      </button>
    </div>
  )
