import { SpinningCircles } from "react-loading-icons";
import { BiFoodMenu } from "react-icons/bi";
import { PiChefHat } from "react-icons/pi";
import { GiHotMeal } from "react-icons/gi";
import { FcGoogle } from "react-icons/fc";
import { IoQrCodeOutline } from "react-icons/io5";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";
import SpacingDiv from "@/components/custom/SpacingDiv";
import { signupGoogle } from "@/api/auth/signupMutation";
import { Toaster } from "sonner";
import { signinMagicLink } from "@/api/auth/signinMutation";
import { RequiredRedAsterisk } from "@/components/custom/RequiredAsterisk";

type ChildProps = {
  handleIsFetching: (isFetching: boolean) => void;
};

export const Route = createFileRoute("/auth/login")({
  component: RegisterComponent,
});

function RegisterComponent() {
  const [isFetching, setIsFetching] = useState(false);

  const handleIsFetching = (isFetching: boolean) => {
    setIsFetching(isFetching);
  };

  return (
    <div className="w-screen h-screen bg-linear-to-tr from-light-green via-light-green/75">
      <div className="grid place-items-center min-h-screen">
        <section className="bg-woo-white/70 font-Aeonik-Regular min-w-[280px] text-center shadow-xl/20 rounded-2xl !py-16 !px-20">
          <h2 className="text-4xl flex justify-center font-Aeonik-Bold">
            Welcome Back
          </h2>

          <SpacingDiv measure="h-4" />

          <p>Log in to manage your business on QRBites.</p>

          <SpacingDiv measure="h-8" />

          <Form
            handleIsFetching={(isFetching: boolean) =>
              handleIsFetching(isFetching)
            }
          />

          <SpacingDiv measure="h-4" />

          <p className="underline underline-offset-1">OR</p>

          <SpacingDiv measure="h-4" />

          <GoogleLoginButton
            handleIsFetching={(isFetching) => handleIsFetching(isFetching)}
          />

          <SpacingDiv measure="h-12" />
          <p className="text-xs">
            By continuing, you agree to our{" "}
            <Link className="text-blue-400" to={"/"}>
              terms
            </Link>{" "}
            and{" "}
            <Link className="text-blue-400" to={"/"}>
              sevices
            </Link>
          </p>
          <Toaster />
        </section>

        <HangingIcons />

        {isFetching && (
          <div className="w-screen h-screen bg-hmm-black/50 absolute top-0 left-0 grid place-items-center">
            <SpinningCircles speed={0.7} />
          </div>
        )}
      </div>
    </div>
  );
}

function Form({ handleIsFetching }: ChildProps) {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const signupButtonRef = useRef<HTMLButtonElement>(null);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  // * Replace with signin function
  const mutation = signinMagicLink(emailInputRef, navigate);

  useEffect(() => {
    handleIsFetching(mutation.isPending);
  }, [mutation.isPending]);

  useEffect(() => {
    if (emailError === "") {
      return;
    }
    const timeout = setTimeout(() => setEmailError(""), 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [emailError]);

  const checkValidity = (): boolean => {
    if (emailInputRef.current === null || signupButtonRef.current === null) {
      console.error("Atleast one of the refs is null");
      return false;
    }

    const emailInput = emailInputRef.current;

    if (emailInput.value.length === 0) {
      setEmailError("Email is required");
      return false;
    } else if (!emailInput.checkValidity()) {
      setEmailError("Invalid email format");
      return false;
    }
    return true;
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!checkValidity()) {
      return;
    }

    signupButtonRef.current!.disabled = true;
    mutation.mutate();

    signupButtonRef.current!.disabled = false;
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="w-full flex flex-col items-center "
    >
      <label htmlFor="email" className="w-full text-left font-medium">
        Email
        <RequiredRedAsterisk />
      </label>
      <input
        type="email"
        name="email"
        ref={emailInputRef}
        placeholder="eg: abc@gmail.com"
        className="font-Aeonik-Regular flex-1 g-light-green/50 placeholder:font-Aeonik-Regular outline-none border-[2px] border-hmm-black/50 focus-within:border-hmm-black !px-3 flex justify-between items-center gap-4 !py-2 rounded-lg w-full max-w-[450px]"
      />
      {emailError && (
        <p className="text-xs text-red-500 w-full text-left">{emailError}</p>
      )}

      <SpacingDiv measure="h-4" />

      <div className="flex justify-between w-full items-center">
        <Link to={"/auth/register"} className="w-full text-right text-sm">
          Don't have an account? <span className="text-blue-400">Signup</span>
        </Link>
      </div>
      <SpacingDiv measure="h-4" />

      <button
        type="submit"
        ref={signupButtonRef}
        className="w-full cursor-pointer rounded-lg !px-3 !py-2 bg-the-green bg-linear-to-r from-woo-white/0 via-woo-white/80 to-woo-white/0 transition-all shadow-sm"
      >
        Signup
      </button>
    </form>
  );
}

function GoogleLoginButton({ handleIsFetching }: ChildProps) {
  const navigate = useNavigate();
  const mutation = signupGoogle(navigate);

  const handleLoginButtonClick = () => {

    mutation.mutate();
  };

  handleIsFetching(mutation.isPending);

  return (
    <button
      type="button"
      onClick={handleLoginButtonClick}
      className="flex justify-center items-center gap-4 w-full rounded-lg !px-3 !py-2 border-[2px] border-b-4 border-the-green bg-the-green/20 shadow-sm cursor-pointer hover:bg-the-green/40 active:border-b-[2px] active:bg-the-green/50 active:mb-[2px] transition-all"
    >
      <FcGoogle className="text-2xl" />
      Google
    </button>
  );
}

function HangingIcons() {
  return (
    <>
      <div className="hidden fixed top-2/10 left-1/10 -translate-1/2 lg:flex items-center justify-center">
        <div className="absolute  rounded-full bg-green-400 blur-xl opacity-50"></div>
        <div className="z-10 bg-woo-white/70 hover:bg-woo-white/90 transition-all duration-300 p-4 rounded-xl shadow-the-green shadow-2xl/50">
          <PiChefHat className="text-7xl text-the-green  transition-all" />
        </div>
      </div>

      <div className="hidden fixed top-5/10 left-2/10 -translate-1/2 lg:flex items-center justify-center">
        <div className="absolute  rounded-full bg-green-400 blur-xl opacity-50"></div>
        <div className="z-10 bg-woo-white/70 hover:bg-woo-white/90 transition-all duration-300 p-4 rounded-xl shadow-the-green shadow-2xl/50">
          <GiHotMeal className="text-7xl text-the-green  transition-all" />
        </div>
      </div>

      <div className="hidden fixed top-8/10 left-8/10 -translate-1/2 lg:flex items-center justify-center">
        <div className="absolute  rounded-full bg-green-400 blur-xl opacity-50"></div>
        <div className="z-10 bg-woo-white/70 hover:bg-woo-white/90 transition-all duration-300 p-4 rounded-xl shadow-the-green shadow-2xl/50">
          <BiFoodMenu className="text-7xl text-the-green  transition-all" />
        </div>
      </div>

      <div className="hidden fixed top-3/10 left-9/10 -translate-1/2 lg:flex items-center justify-center">
        <div className="absolute  rounded-full bg-green-400 blur-xl opacity-50"></div>
        <div className="z-10 bg-woo-white/70 hover:bg-woo-white/90 transition-all duration-300 p-4 rounded-xl shadow-the-green shadow-2xl/50">
          <IoQrCodeOutline className="text-7xl text-the-green  transition-all" />
        </div>
      </div>
    </>
  );
}
