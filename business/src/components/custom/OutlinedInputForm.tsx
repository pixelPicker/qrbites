import { useState } from "react";

interface FormInputProps {
  type: React.HTMLInputTypeAttribute;
  name: string;
  ref: React.Ref<HTMLInputElement>;
  value?: string
  cssClasses?: string;
  placeholder: string;
}

export function FormInput({
  type,
  name,
  ref,
  cssClasses,
  placeholder,
}: FormInputProps) {
  
  return (
    <input
      className={cssClasses + "font-Aeonik-Regular flex-1 g-light-green/50 placeholder:font-Aeonik-Regular outline-none border-[2px] border-hmm-black/50 focus-within:border-hmm-black !px-3 flex justify-between items-center !py-2 rounded-lg w-full max-w-[450px]"}
      name={name}
      type={type}
      ref={ref}
      placeholder={placeholder}
    />
  );
}
