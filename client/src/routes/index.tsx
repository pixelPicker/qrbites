import { FiUser } from "react-icons/fi";
import { createFileRoute } from "@tanstack/react-router";
import { FaBars } from "react-icons/fa6";
import PrimaryButton from "@/components/PrimaryButton";
import {SecondaryButtonWithSendIcon} from "@/components/SecondaryButton";
import SpacingDiv from "@/components/SpacingDiv";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen">
      <header className="flex w-full font-Aeonik-Regular justify-between items-center !p-5 !md:m-10">
        <img
          src="/logo/logo_small.png"
          className="w-16 aspect-square"
          alt="Qrbites logo"
        />
        <div>
          <button className="bg-gray-what bg-radial-[at_50%_75%] from-hmm-black/40 to-gray-what to-90% rounded-full !p-3 !mr-2">
            <FiUser className="text-xl"/>
          </button>
          <button className="bg-gray-what bg-radial-[at_50%_75%] from-hmm-black/40 to-gray-what to-90% rounded-full !p-3">
            <FaBars className="text-xl"/>
          </button>
        </div>
      </header>
      <main className="font-Aeonik-Regular !mx-6">
        <h1 className="text-center text-3xl !mb-8">
          Welcome to <br />{" "}
          <span className="font-extrabold text-5xl">QRBites</span>
        </h1>
        <p className="text-center text-lg !mb-4">
          Order your meal with a quick scan or enter your table code.
        </p>
        <PrimaryButton path="/scan" name="Scan QR" onClickFunction={() => {}} />
        <SpacingDiv height="min-h-2"/>
        <p className="text-center underline w-full">OR</p>
        <SpacingDiv height="min-h-2"/>
        <SecondaryButtonWithSendIcon />

      </main>
      <button></button>
    </div>
  );
}
