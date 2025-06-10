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
import { restaurantCreation } from "@/api/restaurant/restaurantCreation";

export const Route = createFileRoute("/restaurant/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStoreContext((state) => state);
  const { restaurant } = useRestaurantStoreContext((state) => state);

  useEffect(() => {
    async function refetch() {
      await Promise.allSettled([
        queryClient.refetchQueries({
          queryKey: ["fetch-user"],
          exact: true,
        }),
        queryClient.refetchQueries({
          queryKey: ["fetch-restaurant"],
          exact: true,
        }),
      ]);
      const user = queryClient.getQueryData(["fetch-user"]);
      const restaurant = queryClient.getQueryData(["fetch-restaurant"]);

      if (!user) {
        navigate({ to: "/auth/login" });
        return;
      }
      if (restaurant) {
        navigate({ to: "/" });
        return;
      }
    }
    refetch();
  }, [navigate]);

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
            <Form userEmail={user?.email ?? ""} />
          </div>
        </section>
      </div>
      <HangingIcons />
    </div>
  );
}

function Form({ userEmail }: { userEmail: string }) {
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState(userEmail);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [fileError, setFileError] = useState("");
  const [nameError, setNameError] = useState("");

  const mutation = restaurantCreation(useNavigate());

  useEffect(() => {
    if (!emailError) {
      return;
    }
    const emailErrorTimeout = setTimeout(() => {
      setEmailError("");
    }, 2000);
    return () => {
      clearTimeout(emailErrorTimeout);
    };
  }, [emailError]);

  useEffect(() => {
    if (!phoneNumberError) {
      return;
    }
    const phoneNumberTimeout = setTimeout(() => {
      setPhoneNumberError("");
    }, 2000);
    return () => {
      clearTimeout(phoneNumberTimeout);
    };
  }, [phoneNumberError]);

  useEffect(() => {
    if (!fileError) {
      return;
    }
    const fileErrorTimeout = setTimeout(() => {
      setFileError("");
    }, 2000);
    return () => {
      clearTimeout(fileErrorTimeout);
    };
  }, [fileError]);

  useEffect(() => {
    if (!nameError) {
      return;
    }
    const nameErrorTimeout = setTimeout(() => {
      setNameError("");
    }, 2000);
    return () => {
      clearTimeout(nameErrorTimeout);
    };
  }, [nameError]);

  function checkValidity(): boolean {
    const emailInput = emailInputRef.current;

    if (emailInput!.value.length === 0) {
      setEmailError("Email is required");
      return false;
    } else if (!emailInput!.checkValidity()) {
      setEmailError("Invalid email format");
      return false;
    }

    const number = phoneNumber;
    if (!isValidPhoneNumber(number)) {
      setPhoneNumberError("Invalid phone number.");
      return false;
    }

    if (logoInputRef.current!.files?.length === 0) {
      return true;
    }
    const fileSize = logoInputRef.current!.files![0].size;
    if (fileSize > 1024 * 1024) {
      setFileError("File size exceeds 1MB");
      return false;
    }

    return true;
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nameInputRef.current) {
      return;
    }
    if (!emailInputRef.current) {
      return;
    }
    if (!logoInputRef.current) {
      return;
    }

    if (!checkValidity()) {
      return;
    }
    mutation.mutate({
      name: nameInputRef.current.value,
      email: emailInputRef.current.value,
      phoneNumber: phoneNumber,
      file: logoInputRef.current.files ? logoInputRef.current.files[0] : null,
    });
  };

  return (
    <form onSubmit={handleOnSubmit} method="POST" encType="multipart/form-data">
      <InputLabel for="name" hasAsterisk={true} text="Name" />
      <input
        className="font-Aeonik-Regular flex-1 g-light-green/50 placeholder:font-Aeonik-Regular outline-none border-[2px] border-hmm-black/50 focus-within:border-hmm-black !px-3 flex justify-between items-center !py-2 rounded-lg w-full max-w-[450px]"
        ref={nameInputRef}
        name="name"
        placeholder="eg: goomy eateris"
        type="text"
        required
        maxLength={100}
        minLength={1}
      />
      {nameError && (
        <p className="text-xs text-red-500 w-full text-left">{nameError}</p>
      )}
      <SpacingDiv measure="h-2" />

      <InputLabel for="email" hasAsterisk={true} text="Email" />
      <input
        className="font-Aeonik-Regular flex-1 g-light-green/50 placeholder:font-Aeonik-Regular outline-none border-[2px] border-hmm-black/50 focus-within:border-hmm-black !px-3 flex justify-between items-center !py-2 rounded-lg w-full max-w-[450px]"
        ref={emailInputRef}
        name="email"
        required
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
      {fileError && (
        <p className="text-xs text-red-500 w-full text-left">{fileError}</p>
      )}
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
