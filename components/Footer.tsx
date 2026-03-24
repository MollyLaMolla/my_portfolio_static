"use client";
import React from "react";
import Image from "next/image";
import MagicBtn from "./ui/magicBtn";
import ContactWindow from "./ui/contact-window";
import { FaLocationArrow } from "react-icons/fa";
import { socialMedia } from "@/data";

const Footer = () => {
  const [openContact, setOpenContact] = React.useState(false);
  return (
    <footer
      className="w-full h-[100vh] mt-20 relative flex items-center justify-center flex-col"
      id="contact">
      <div className="absolute bottom-0 h-[100vh] w-[100vw] pointer-events-none left-1/2 -translate-x-1/2">
        <Image
          src="/footer-grid.svg"
          alt="Footer grid background"
          fill
          className="object-cover object-center opacity-40 pointer-events-none"
          sizes="100vw"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col items-center">
        <h1 className="heading lg:max-w-[45vw]">
          Ready to take <span className="text-purple">your</span> digital
          presence to the next level?
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-center">
          Reach out to me today and let&apos;s discuss how I can help you
          achieve your goals.
        </p>
        <MagicBtn
          title="let's get in touch"
          icon={<FaLocationArrow />}
          position="right"
          otherClasses="py-4 px-12 gap-3 text-lg"
          handleClick={() => setOpenContact(true)}
        />
      </div>

      <div className="mt-36 w-full absolute bottom-6 flex md:flex-row flex-col-reverse items-center lg:justify-evenly justify-center gap-6">
        <p className="text-center text-white-200 md:text-base text-sm md:font-normal font-light">
          &copy; {new Date().getFullYear()} Alessandro. All rights reserved.
        </p>

        <div className="flex items-center md:gap-3 gap-6">
          {socialMedia.map((profile) => (
            <div
              key={profile.id}
              className="w-10 h-10 cursor-pointer opacity-90 hover:opacity-100 flex justify-center items-center backdrop-filter backdrop-blur-lg saturation-180 bg-opacity-75 bg-black-200 rounded-lg border-black-300 border hover:bg-black-300 transition-all duration-300"
              onClick={() => window.open(profile.link, "_blank")}>
              <Image
                src={profile.img}
                alt={String(profile.id)}
                width={20}
                height={20}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Contact modal window */}
      <ContactWindow
        open={openContact}
        onClose={() => setOpenContact(false)}
        email="alessandro.slyusar22@gmail.com"
        githubUrl={socialMedia.find((s) => s.id === 1)?.link}
        linkedinUrl={socialMedia.find((s) => s.id === 2)?.link}
        phone={"+39 3202688765"}
      />
    </footer>
  );
};

export default Footer;
