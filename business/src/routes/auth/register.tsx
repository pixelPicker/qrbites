import { BiFoodMenu } from "react-icons/bi";
import { PiChefHat } from "react-icons/pi";
import { GiHotMeal } from "react-icons/gi";
import { FcGoogle } from "react-icons/fc";
import { IoQrCodeOutline } from "react-icons/io5";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import SpacingDiv from "@/components/SpacingDiv";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/auth/register")({
  component: RegisterComponent,
});

function RegisterComponent() {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (usernameError === "" && emailError === "") {
      return;
    }
    const timeout =
      usernameError != ""
        ? setTimeout(() => setUsernameError(""), 2000)
        : setTimeout(() => setEmailError(""), 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [usernameError, emailError]);

  const checkValidity = (): boolean => {
    if (usernameInputRef.current === null || emailInputRef.current === null) {
      console.error("Alleast one of the refs is null");
      return false;
    }
    const usernameInput = usernameInputRef.current;
    const emailInput = emailInputRef.current;

    if (usernameInput.value.length < 3 || usernameInput.value.length > 30) {
      console.log("Username must be between 3 to 30 characters");
      setUsernameError("Username must be between 3 to 30 characters");
      return false;
    }
    if (emailInput.value.length === 0) {
      console.log("Email is required");
      setEmailError("Email is required");
      return false;
    } else if (!emailInput.checkValidity()) {
      console.log("Invalid email format");
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

    console.log(
      `Username: ${usernameInputRef.current!.value}\nEmail: ${emailInputRef.current!.value}`
    );
  };

  return (
    <div className="w-screen h-screen bg-linear-to-tr from-light-green via-light-green/75">
      <div className="grid place-items-center min-h-screen">
        <section className="bg-woo-white/70 font-Aeonik-Regular min-w-[280px] text-center shadow-xl/20 rounded-2xl !py-16 !px-20">
          
          <h2 className="text-4xl flex justify-center font-semibold">Create an Account</h2>

          <SpacingDiv measure="h-4" />

          <p>Let’s get your restaurant running on QRBites.</p>

          <SpacingDiv measure="h-12" />

          <form
            onSubmit={handleFormSubmit}
            className="w-full flex flex-col items-center "
          >
            <h4 className="w-full text-left font-medium">Username</h4>
            <input
              type="text"
              name="username"
              ref={usernameInputRef}
              placeholder="eg: goomysweeps"
              className="font-Aeonik-Regular flex-1 g-light-green/50 placeholder:font-Aeonik-Regular outline-none border-[2px] border-hmm-black/50 focus-within:border-hmm-black !px-3 flex justify-between items-center gap-4 !py-2 rounded-lg w-full max-w-[450px]"
            />
            {usernameError && (
              <p className="text-xs text-red-500 w-full text-left">
                {usernameError}
              </p>
            )}

            <SpacingDiv measure="h-2" />

            <h4 className="w-full text-left font-medium">Email</h4>
            <input
              type="email"
              name="email"
              ref={emailInputRef}
              placeholder="eg: abc@gmail.com"
              className="font-Aeonik-Regular flex-1 g-light-green/50 placeholder:font-Aeonik-Regular outline-none border-[2px] border-hmm-black/50 focus-within:border-hmm-black !px-3 flex justify-between items-center gap-4 !py-2 rounded-lg w-full max-w-[450px]"
            />
            {emailError && (
              <p className="text-xs text-red-500 w-full text-left">
                {emailError}
              </p>
            )}

            <SpacingDiv measure="h-4" />

            <div className="flex justify-between w-full items-center">
              <div className="flex w-full items-center gap-2">
                <Checkbox
                  id="rememberBox"
                  className="data-[state=checked]:bg-the-green data-[state=checked]:text-woo-white data-[state=checked]:border-the-green  border-the-green "
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="rememberBox"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
              </div>

              <Link to={"/auth/login"} className="w-full text-right text-sm">
                Already signed in? <span className="text-blue-400">Login</span>
              </Link>
            </div>
            <SpacingDiv measure="h-4" />

            <button
              type="submit"
              className="w-full rounded-lg !px-3 !py-2 bg-the-green hover:bg-the-green/80 active:bg-the-green/70 transition-all shadow-sm"
            >
              Submit
            </button>
          </form>

          <SpacingDiv measure="h-4" />

          <p className="underline underline-offset-1">OR</p>

          <SpacingDiv measure="h-4" />

          <button
            type="button"
            className="flex justify-center items-center gap-4 w-full rounded-lg !px-3 !py-2 border-[2px] border-the-green bg-the-green/20 shadow-sm cursor-pointer hover:bg-the-green/40 active:bg-the-green/50 transition-all"
          >
            <FcGoogle className="text-2xl" />
            Google
          </button>

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
        </section>

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
      </div>
    </div>
  );
}
