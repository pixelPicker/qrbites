import { MdOutlineInfo } from "react-icons/md";
import { InputLabel } from "@/components/custom/InputLabel";
import { PhoneInput } from "@/components/custom/PhoneInput";
import SpacingDiv from "@/components/custom/SpacingDiv";
import { Input } from "@/components/ui/input";
import { useAuthStoreContext } from "@/store/authContext";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import { PiChefHat } from "react-icons/pi";
import { GiHotMeal } from "react-icons/gi";
import { BiFoodMenu } from "react-icons/bi";
import { IoQrCodeOutline } from "react-icons/io5";
import { useRestaurantStoreContext } from "@/store/restaurantContext";
import { restaurantCreation } from "@/api/mutations/restaurantCreation";

export const Route = createFileRoute("/restaurant/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStoreContext((state) => state);
  const { restaurant } = useRestaurantStoreContext((state) => state);

  // useEffect(() => {
  //   async function refetch() {
  //     await Promise.allSettled([
  //       queryClient.refetchQueries({
  //         queryKey: ["fetch-user"],
  //         exact: true,
  //       }),
  //       queryClient.refetchQueries({
  //         queryKey: ["fetch-restaurant"],
  //         exact: true,
  //       }),
  //     ]);
  //     const user = queryClient.getQueryData(["fetch-user"]);
  //     const restaurant = queryClient.getQueryData(["fetch-restaurant"]);

  //     if (!user) {
  //       navigate({ to: "/auth/login" });
  //       return;
  //     }
  //     if (restaurant) {
  //       navigate({ to: "/" });
  //       return;
  //     }
  //   }
  //   refetch();
  // }, [navigate]);

  if (!user) {
    navigate({ to: "/auth/login" });
    return;
  }

  return (
    <div className="w-screen h-screen bg-linear-to-tr from-light-green via-light-green/75">
      <div className="grid place-items-center min-h-screen">
        <section className="bg-woo-white/70 font-Aeonik-Regular min-w-[280px] text-center shadow-xl/20 rounded-2xl !py-16 !px-20">
          <h1 className="text-4xl flex justify-center font-Aeonik-Bold">
            Register Your Restaurant
          </h1>
          <SpacingDiv measure="h-4" />
          <p>Fill in the details below to register your restaurant with us</p>
          <SpacingDiv measure="h-8" />
          <div className="w-4/5 mx-auto">
            <Form userEmail={user.email} />
          </div>
        </section>
      </div>
      <HangingIcons />
    </div>
  );
}
const formData = new FormData();

function Form({ userEmail }: { userEmail: string }) {
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState(userEmail);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const mutation = restaurantCreation();

  useEffect(() => {
    if (phoneNumberError === "" && emailError === "") {
      return;
    }
    const phoneNumberTimeout = setTimeout(() => {
      setPhoneNumberError("");
    }, 2000);
    const emailErrorTimeout = setTimeout(() => {
      setEmailError("");
    }, 2000);

    return () => {
      clearTimeout(phoneNumberTimeout);
      clearTimeout(emailErrorTimeout);
    };
  }, [emailError, phoneNumberError]);

  function checkValidity(): boolean {
    if (emailInputRef.current === null) {
      console.error("Atleast one of the refs is null");
      return false;
    }

    const emailInput = emailInputRef.current;

    if (emailInput.value.length === 0) {
      console.log("Email is required");
      setEmailError("Email is required");
      return false;
    } else if (!emailInput.checkValidity()) {
      console.log("Invalid email format");
      setEmailError("Invalid email format");
      return false;
    }
    const number = phoneNumber;
    if (!isValidPhoneNumber(number)) {
      console.log("Invalid phone number.", number);
      setPhoneNumberError("Invalid phone number.");
      return false;
    }
    return true;
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailInputRef.current) {
      console.log("Email ref is empty");
      return;
    }
    if (!logoInputRef.current) {
      console.log("Logo ref is empty");
      return;
    }

    if (!checkValidity()) {
      return;
    }
    mutation.mutate({
      email: emailInputRef.current.value,
      phoneNumber: phoneNumber,
      file: logoInputRef.current.files ? logoInputRef.current.files[0] : null,
    });
  };

  return (
    <form onSubmit={handleOnSubmit} method="POST" encType="multipart/form-data">
      <InputLabel for="email" hasAsterisk={true} text="Email" />
      <input
        className="font-Aeonik-Regular flex-1 g-light-green/50 placeholder:font-Aeonik-Regular outline-none border-[2px] border-hmm-black/50 focus-within:border-hmm-black !px-3 flex justify-between items-center !py-2 rounded-lg w-full max-w-[450px]"
        ref={emailInputRef}
        name="email"
        value={email}
        placeholder="eg: goomy@gmail.com"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      {emailError && (
        <p className="text-xs text-red-500 w-full text-left">{emailError}</p>
      )}
      <SpacingDiv measure="h-2" />

      <InputLabel for="phoneNumber" hasAsterisk={true} text="Phone Number" />
      <PhoneInput
        onChange={(value) => {
          setPhoneNumber(value);
        }}
      />
      {phoneNumberError && (
        <p className="text-xs text-red-500 w-full text-left">
          {phoneNumberError}
        </p>
      )}
      <SpacingDiv measure="h-2" />

      <div className="grid w-full max-w-sm items-center">
        <InputLabel for="logo" hasAsterisk={false} text="Your Logo" />
        <Input
          className="!font-Aeonik-Regular flex-1 !text-base h-9/10 !placeholder:font-Aeonik-Regular outline-none border-[2px] border-hmm-black/50 focus-within:border-hmm-black !px-3 flex justify-between items-center !py-2 rounded-lg w-full max-w-[450px] cursor-pointer"
          id="logo"
          ref={logoInputRef}
          type="file"
        />
      </div>
      <SpacingDiv measure="h-4" />

      <div className="flex justify-end items-center gap-1 text-sm text-hmm-black/60">
        <MdOutlineInfo />
        <p>You can change these later anytime</p>
      </div>
      <SpacingDiv measure="h-2" />

      <button
        type="submit"
        ref={submitButtonRef}
        className="w-full cursor-pointer rounded-lg !px-3 !py-2 bg-the-green bg-linear-to-r from-woo-white/0 via-woo-white/80 to-woo-white/0 transition-all shadow-sm"
      >
        Submit
      </button>
    </form>
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
