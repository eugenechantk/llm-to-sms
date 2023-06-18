import Image from "next/image";
import { Inter } from "next/font/google";
import React from "react";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import Button from "@/common/components/Button";

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

export default function Home() {
  const [secrets, setSecrets] = React.useState<ISecret[]>([]);
  const [payloads, setPayload] = React.useState<IPayload[]>([]);
  const [errMsg, setErrMsg] = React.useState<IErrMsg[]>([]);
  const [phoneNum, setPhoneNum] = React.useState<string>("");

  React.useEffect(() => {
    console.log(secrets);
  }, [secrets]);
  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      {/* LOGO & HERO */}
      <div className="mt-24 mb-24 relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
      {/* PHONE NUMBER */}
      {phoneNum && (
        <div className="flex flex-col gap-2 items-center justify-center w-1/2 border border-gray-700 py-12 rounded-3xl mb-12">
          <h4 className="text-gray-300">
            Here's the SMS number to chat with your model
          </h4>
          <h1>(504) 761-3416</h1>
        </div>
      )}
      {/* API FORM */}
      <div className="flex flex-col gap-12 w-1/2 items-center">
        <input
          type="text"
          placeholder="Your API route"
          className="w-full bg-transparent border-2 border-gray-800 text-3xl font-medium tracking-tight px-6 py-4 rounded-2xl"
        ></input>
        <p className="text-lg text-gray-400">
          Set up your headers, body and custom error messages to expose the API
          to an SMS service
        </p>
        {/* REQUEST HEADERS */}
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-row justify-between items-center">
            <h3>Request Headers</h3>
            <button
              onClick={() => {
                const updatedSecrets = [...secrets, { key: "", value: "" }];
                setSecrets(updatedSecrets);
              }}
            >
              <PlusCircleIcon className="w-10 h-10 text-gray-500" />
            </button>
          </div>
          <div className="w-full flex flex-col gap-3">
            {secrets.map((secret, index) => {
              return (
                <div
                  className="w-full flex flex-row items-center gap-2"
                  key={index}
                >
                  <input
                    type="text"
                    placeholder="Key"
                    defaultValue={secret.key}
                    onChange={(e) => {
                      const updatedSecrets = [...secrets];
                      updatedSecrets[index] = {
                        ...updatedSecrets[index],
                        key: e.target.value,
                      };
                      setSecrets(updatedSecrets);
                    }}
                    className="w-2/5 bg-transparent border-2 border-gray-800 text-2xl font-numeric tracking-tight px-5 py-3 rounded-xl"
                  ></input>
                  <input
                    type="Value"
                    placeholder="value"
                    defaultValue={secret.value}
                    className="grow bg-transparent border-2 border-gray-800 text-2xl font-numeric tracking-tight px-5 py-3 rounded-xl"
                    onChange={(e) => {
                      const updatedSecrets = [...secrets];
                      updatedSecrets[index] = {
                        ...updatedSecrets[index],
                        value: e.target.value,
                      };
                      setSecrets(updatedSecrets);
                    }}
                  ></input>
                  <button
                    onClick={() => {
                      const updatedSecrets = [...secrets]; // Create a copy of the original array
                      updatedSecrets.splice(index, 1); // Remove the element at the specified index
                      setSecrets(updatedSecrets); // Update the state with the new array
                    }}
                  >
                    <MinusCircleIcon className="w-8 h-8 text-gray-500" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* REQUEST BODY */}
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-row justify-between items-center">
            <h3>Request Body</h3>
            <button
              onClick={() => {
                const updatedPayload = [...payloads, { key: "", value: "" }];
                setPayload(updatedPayload);
              }}
            >
              <PlusCircleIcon className="w-10 h-10 text-gray-500" />
            </button>
          </div>
          <div className="w-full flex flex-col gap-3">
            {payloads.map((payload, index) => {
              return (
                <div
                  className="w-full flex flex-row items-center gap-2"
                  key={index}
                >
                  <input
                    type="text"
                    placeholder="Key"
                    defaultValue={payload.key}
                    onChange={(e) => {
                      const updatedPayload = [...payloads];
                      updatedPayload[index] = {
                        ...updatedPayload[index],
                        key: e.target.value,
                      };
                      setPayload(updatedPayload);
                    }}
                    className="w-2/5 bg-transparent border-2 border-gray-800 text-2xl font-numeric tracking-tight px-5 py-3 rounded-xl"
                  ></input>
                  <input
                    type="Value"
                    placeholder="value"
                    defaultValue={payload.value}
                    className="grow bg-transparent border-2 border-gray-800 text-2xl font-numeric tracking-tight px-5 py-3 rounded-xl"
                    onChange={(e) => {
                      const updatedPayload = [...payloads];
                      updatedPayload[index] = {
                        ...updatedPayload[index],
                        value: e.target.value,
                      };
                      setPayload(updatedPayload);
                    }}
                  ></input>
                  <button
                    onClick={() => {
                      const updatedPayload = [...payloads]; // Create a copy of the original array
                      updatedPayload.splice(index, 1); // Remove the element at the specified index
                      setPayload(updatedPayload); // Update the state with the new array
                    }}
                  >
                    <MinusCircleIcon className="w-8 h-8 text-gray-500" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ERROR MESSAGE */}
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-row justify-between items-center">
            <h3>Error Message</h3>
            <button
              onClick={() => {
                const updatedErrMsg = [...errMsg, { statusCode: "", msg: "" }];
                setErrMsg(updatedErrMsg);
              }}
            >
              <PlusCircleIcon className="w-10 h-10 text-gray-500" />
            </button>
          </div>
          <div className="w-full flex flex-col gap-3">
            {errMsg.map((err, index) => {
              return (
                <div
                  className="w-full flex flex-row items-center gap-2"
                  key={index}
                >
                  <input
                    type="text"
                    placeholder="Status Code"
                    defaultValue={err.statusCode}
                    onChange={(e) => {
                      const updatedErrMsg = [...errMsg];
                      updatedErrMsg[index] = {
                        ...updatedErrMsg[index],
                        statusCode: e.target.value,
                      };
                      setErrMsg(updatedErrMsg);
                    }}
                    className="w-2/5 bg-transparent border-2 border-gray-800 text-2xl font-numeric tracking-tight px-5 py-3 rounded-xl"
                  ></input>
                  <input
                    type="Value"
                    placeholder="value"
                    defaultValue={err.msg}
                    className="grow bg-transparent border-2 border-gray-800 text-2xl font-numeric tracking-tight px-5 py-3 rounded-xl"
                    onChange={(e) => {
                      const updatedErrMsg = [...errMsg];
                      updatedErrMsg[index] = {
                        ...updatedErrMsg[index],
                        msg: e.target.value,
                      };
                      setErrMsg(updatedErrMsg);
                    }}
                  ></input>
                  <button
                    onClick={() => {
                      const updatedErrMsg = [...errMsg]; // Create a copy of the original array
                      updatedErrMsg.splice(index, 1); // Remove the element at the specified index
                      setErrMsg(updatedErrMsg); // Update the state with the new array
                    }}
                  >
                    <MinusCircleIcon className="w-8 h-8 text-gray-500" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <Button>
          <h3>Create SMS Number</h3>
        </Button>
      </div>
    </main>
  );
}
