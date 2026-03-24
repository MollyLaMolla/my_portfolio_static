"use client";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaPhone,
  FaTimes,
} from "react-icons/fa";

type ContactWindowProps = {
  open: boolean;
  onClose: () => void;
  email: string;
  githubUrl?: string;
  linkedinUrl?: string;
  phone?: string;
};

const ContactWindow: React.FC<ContactWindowProps> = ({
  open,
  onClose,
  email,
  githubUrl,
  linkedinUrl,
  phone,
}) => {
  const handleWriteEmail = () => {
    const to = email;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      to
    )}`;
    const win = window.open(gmailUrl, "_blank");
    if (!win) {
      window.location.href = `mailto:${to}`;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[6000] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Window with spinning LED border */}
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 34 }}
            className="relative inline-flex overflow-hidden rounded-2xl p-[1px] focus:outline-none w-[92vw] max-w-md"
            aria-label="Contact window">
            {/* spinning border */}
            <span className="absolute inset-[-1000%] z-0 pointer-events-none animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            {/* content card */}
            <div className="relative z-10 rounded-2xl bg-[#0b0f1a] text-white backdrop-blur-3xl p-4 sm:p-6 w-full shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Get in touch
                </h3>
                <button
                  aria-label="Close"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-md border border-white/20 hover:border-white/40 text-white/80 hover:text-white p-2 transition">
                  <FaTimes />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3">
                {/* Email */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-white/15 bg-white/5 px-3 py-2 order-1">
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="opacity-80" />
                    <div>
                      <p className="text-sm opacity-80">Email</p>
                      <p className="text-sm font-medium">{email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleWriteEmail}
                    className="relative inline-flex overflow-hidden rounded-md p-[1px] focus:outline-none">
                    <span className="absolute inset-[-1000%] z-0 pointer-events-none animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="relative z-10 inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-slate-950 text-white px-3 py-1 text-sm">
                      Write
                    </span>
                  </button>
                </div>

                {/* Phone */}
                {phone && (
                  <div className="flex sm:items-center sm:justify-between justify-center sm:flex-row flex-col gap-3 rounded-lg border border-white/15 bg-white/5 px-3 py-2 sm:order-5 order-2">
                    <div className="flex items-center gap-3">
                      <FaPhone className="opacity-80" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm opacity-80">{phone}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Call phone"
                      onClick={() => {
                        if (phone) {
                          window.location.href = `tel:${phone}`;
                        }
                      }}
                      className="relative inline-flex overflow-hidden rounded-md p-[1px] focus:outline-none">
                      <span className="absolute inset-[-1000%] z-0 pointer-events-none animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                      <span className="relative z-10 inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-slate-950 text-white px-3 py-1 text-sm">
                        Call
                      </span>
                    </button>
                  </div>
                )}

                {/* GitHub */}
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg border border-white/15 bg-white/5 px-3 py-2 hover:bg-white/10 transition order-3"
                    )}>
                    <div className="flex items-center gap-3">
                      <FaGithub className="opacity-80" />
                      <div>
                        <p className="text-sm font-medium">GitHub</p>
                        <p className="text-xs opacity-70">Open profile</p>
                      </div>
                    </div>
                    <span className="text-xs opacity-70">External</span>
                  </a>
                )}

                {/* LinkedIn */}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg border border-white/15 bg-white/5 px-3 py-2 hover:bg-white/10 transition order-4"
                    )}>
                    <div className="flex items-center gap-3">
                      <FaLinkedin className="opacity-80" />
                      <div>
                        <p className="text-sm font-medium">LinkedIn</p>
                        <p className="text-xs opacity-70">Open profile</p>
                      </div>
                    </div>
                    <span className="text-xs opacity-70">External</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactWindow;
