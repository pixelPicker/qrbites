import { PiForkKnife } from "react-icons/pi";
import PrimaryButton from "@/components/custom/PrimaryButton";
import Logo from "../components/custom/logo";
import { createFileRoute } from "@tanstack/react-router";
import { SecondaryButton } from "@/components/custom/SecondaryButton";
import SpacingDiv from "@/components/custom/SpacingDiv";

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {

  return (
    <>
      <Header />
      <main>
        <Hero />
      </main>
    </>
  );
}

function Header() {
  return (
    <div>
      <header className="flex fixed top-0 left-0 justify-between items-center font-Aeonik-Regular !p-5  md:!px-16 w-full">
        <Logo size="medium" />
        <SpacingDiv measure="w-28" />
        <nav>
          <ul className="flex gap-4">
            <li className="!py-1 !px-3 hover:bg-the-green hover:text-woo-white transition-all duration-200 rounded-full">
              Home
            </li>
            <li className="!py-1 !px-3 hover:bg-the-green hover:text-woo-white transition-all duration-200 rounded-full">
              Pricing
            </li>
            <li className="!py-1 !px-3 hover:bg-the-green hover:text-woo-white transition-all duration-200 rounded-full">
              Guides
            </li>
            <li className="!py-1 !px-3 hover:bg-the-green hover:text-woo-white transition-all duration-200 rounded-full">
              About
            </li>
          </ul>
        </nav>
        <div className="flex gap-4">
          <PrimaryButton
            name="Register"
            path={"/auth/register"}
            onClickFunction={() => {}}
          />
          <SecondaryButton
            name="Request a demo"
            path={"/"}
            onClickFunction={() => {}}
          />
        </div>
      </header>
    </div>
  );
}

function Hero() {
  return (
    <div className="!mt-8 font-Aeonik-Regular !px-4 md:!px-16 grid items-center justify-center md:justify-start min-h-screen md:grid-cols-2">
      <section>
        <h1 className="text-5xl/snug">
          Automated <span className="font-bold">QR Ordering</span> <br />
          for your Resturant
        </h1>
        <SpacingDiv measure="h-12" />
        <ul>
          <li>
            <div className="flex justify-start items-center gap-4">
              <PiForkKnife className="text-2xl" />
              <p className="text-lg ">
                Instant menu access by scanning the table QR.
              </p>
            </div>
          </li>
          <li>
            <div className="flex justify-start items-center gap-4">
              <PiForkKnife className="text-2xl" />
              <p className="text-lg ">
                Easily update items, prices, and availability.
              </p>
            </div>
          </li>
          <li>
            <div className="flex justify-start items-center gap-4">
              <PiForkKnife className="text-2xl" />
              <p className="text-lg ">
                Keep customers informed about order status.
              </p>
            </div>
          </li>
        </ul>
        <SpacingDiv measure="h-8" />
        <div className="flex justify-start items-center gap-4">
          <PrimaryButton
            name="Get Started Now"
            path={null}
            onClickFunction={() => {}}
          />
          <SecondaryButton
            name="Request a demo"
            path={null}
            onClickFunction={() => {}}
          />
        </div>
      </section>
      <div className="lg:w-108 md:w-4/5 hidden md:block h-2/3 justify-self-end float-end rounded-full bg-[url('/images/young-woman-scanning-qr-code.jpg')] bg-cover bg-center"></div>
    </div>
  );
}
