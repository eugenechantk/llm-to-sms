import Image from "next/image";
import { Inter } from "next/font/google";
import React from "react";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import Button from "@/common/components/Button";
import axios from "axios";
import Logo from "../public/logo.svg";
import NoWifiIcon from "../public/nowifi.svg";
const inter = Inter({ subsets: ["latin"] });

interface ISecret {
  key: string;
  value: string;
}

interface IPayload {
  key: string;
  value: string;
}

interface IErrMsg {
  statusCode: string;
  msg: string;
}

const baseUrl = process.env.VERCEL_URL
  ? "https://" + process.env.VERCEL_URL
  : "http://localhost:3000";

export default function Home() {
  const [secrets, setSecrets] = React.useState<ISecret[]>([]);
  const [payloads, setPayload] = React.useState<IPayload[]>([]);
  const [errMsg, setErrMsg] = React.useState<IErrMsg[]>([]);
  const [phoneNum, setPhoneNum] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false)

  const handlePhoneNumberProvision = async () => {
    setLoading(true)
    try {
      let service = (
        await axios.post(`${baseUrl}/api/twilio/setup/start`, {
          SERVER: "https://llm-to-sms.vercel.app",
          uuid: "a1-10",
        })
      ).data;
      console.log(service.number);
     setPhoneNum(service.number)
     setLoading(false)
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    console.log(secrets);
  }, [secrets]);
  return (
    <main
      className={`flex min-h-screen flex-col items-center p-6 ${inter.className}`}
    >
      {/* LOGO & HERO */}
      <div className="mt-12 mb-16 relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px] flex-col gap-10">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
          src={NoWifiIcon}
          alt="Offline SMS logo"
          width={120}
          height={37}
          priority
        />
        <div className="flex flex-col gap-6 items-center">
          <div className="flex flex-col gap-6 items-center">
            <h3 className="text-gray-100 text-5xl">Offline GPT</h3>
            <p className="text-3xl text-gray-200 text-center">
              A gateway framework to reaching an extra 2.9 billion people
            </p>
            <p className="text-3xl text-gray-500 text-center">
              Deploy your LLM product and serve your chat model via SMS
            </p>
          </div>
        </div>
      </div>
      {/* PHONE NUMBER */}
      {phoneNum && (
        <div className="flex flex-col gap-2 items-center justify-center w-full lg:max-w-[640px] lg:w-full border border-gray-700 rounded-3xl mb-12 p-12">
          <h4 className="text-gray-300 text-center">
            Here&apos;s the SMS number to chat with your model
          </h4>
          <h1>{phoneNum}</h1>
        </div>
      )}
      {/* API FORM */}
      <div className="flex flex-col gap-12 w-full lg:w-1/2 items-center">
        <div className="w-full flex flex-col gap-6 items-center">
          <input
            type="text"
            placeholder="Your API route"
            className="w-full bg-transparent border-2 border-gray-800 text-3xl font-medium tracking-tight px-6 py-4 rounded-2xl"
          ></input>
          <button
            onClick={() => handlePhoneNumberProvision()}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: "16px 20px",
              gap: "4px",
              background: "linear-gradient(0deg, #262626 63.89%, #333333 100%)",
              border: "0.75px solid #595959",
              width: "fit-content",
            }}
            className="rounded-full text-sm font-semibold hover:!bg-gradient-to-b hover:!from-theme-15 hover:!from-[64%] hover:!to-theme-25 hover:!to-[100%]"
          >
            <h3>Create SMS Number</h3>
          </button>
        </div>

        {/* REQUEST HEADERS */}
        <div className="w-full flex flex-col gap-4">
          <h3>Request Parameters</h3>
          <p className="text-lg text-gray-400">
            Set up your headers, body and custom error messages to expose the
            API to an SMS service
          </p>
          <textarea
            className="w-full bg-transparent border-2 border-gray-800 text-xl font-medium tracking-tight px-6 py-4 rounded-2xl h-[280px]"
            placeholder="Specify your request headers, body and other settings"
          ></textarea>
        </div>
      </div>
    </main>
  );
}
