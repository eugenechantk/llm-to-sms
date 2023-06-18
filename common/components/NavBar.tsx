import React from "react";
import logo from "../../public/logo_navbar.svg";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/router";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Bars3Icon } from "@heroicons/react/24/solid";

export default function NavBar() {
  const router = useRouter();
  return (
    <div
      style={{
        background: "rgba(20, 20, 20, 0.95)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        boxShadow: "0px 18px 36px rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(15px)",
        padding: "8px 8px 8px 12px",
        zIndex: 100,
      }}
      className="flex flex-row items-center rounded-full gap-8 sticky top-6 md:mx-auto mx-4 md:w-fit"
    >
      <Link href="/">
        <Image src={logo} width={32} height={32} alt="logo" />
      </Link>
      <Link href="/convert" className="hidden md:block">
        <button
          className={clsx(
            router.pathname.startsWith("/convert") &&
              "!font-semibold text-theme-95",
            "text-theme-85 hover:text-theme-95 text-sm leading-6"
          )}
        >
          Convert your Mutatnt Ape
        </button>
      </Link>
      <Link href="/redeem" className="hidden md:block">
        <button
          className={clsx(
            router.pathname.startsWith("/redeem") &&
              "!font-semibold text-theme-95",
            "text-theme-85 hover:text-theme-95 text-sm leading-6"
          )}
        >
          Redeem your Mutatnt Ape
        </button>
      </Link>
      <div className="flex flex-row gap-2 grow justify-end">
        <Link href="/">
          <button
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: "8px 16px",
              gap: "4px",
              background: "linear-gradient(0deg, #262626 63.89%, #333333 100%)",
              border: "0.75px solid #595959",
            }}
            className="rounded-full text-sm font-semibold hover:!bg-gradient-to-b hover:!from-theme-15 hover:!from-[64%] hover:!to-theme-25 hover:!to-[100%]"
          >
            Invest now
          </button>
        </Link>
        <Collapsible.Root className="md:hidden">
          <Collapsible.Trigger asChild>
            <button
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: "6px 16px",
                gap: "4px",
                background:
                  "linear-gradient(0deg, #262626 63.89%, #333333 100%)",
                border: "0.75px solid #595959",
              }}
              className="rounded-full text-sm font-semibold hover:!bg-gradient-to-b hover:!from-theme-15 hover:!from-[64%] hover:!to-theme-25 hover:!to-[100%]"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </Collapsible.Trigger>
          <Collapsible.Content
            className="absolute top-[60px] right-0 w-fit rounded-[20px] px-4 py-2"
            style={{
              background: "rgba(20, 20, 20, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              boxShadow: "0px 18px 36px rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(15px)",
              zIndex: 100,
            }}
          >
            <div className="pt-2 pb-3 border-b border-b-theme-15">
              <Link href="/convert">
                <button
                  className={clsx(
                    router.pathname.startsWith("/convert") &&
                      "!font-semibold text-theme-95",
                    "text-theme-85 hover:text-theme-95 text-base leading-6"
                  )}
                >
                  Convert your Mutatnt Ape
                </button>
              </Link>
            </div>
            <div className="py-2">
              <Link href="/redeem">
                <button
                  className={clsx(
                    router.pathname.startsWith("/redeem") &&
                      "!font-semibold text-theme-95",
                    "text-theme-85 hover:text-theme-95 text-base leading-6"
                  )}
                >
                  Redeem your Mutatnt Ape
                </button>
              </Link>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    </div>
  );
}
