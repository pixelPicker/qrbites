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
        <button className="flex items-center !px-4 !py-2 cursor-pointer outline-the-green shadow-lg outline-[2px] rounded-full">
          {name}
        </button>
      </Link>
    );
  } else {
    return (
      <button
        onClick={onClickFunction}
        className="flex items-center !px-4 !py-2 cursor-pointer outline-the-green shadow-lg outline-[2px] rounded-full"
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
