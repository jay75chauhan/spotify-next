import React from "react";
import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import logo from "../public/spotify.png";
function login({ providers }) {
  return (
    <div className=" bg-gradient-to-b from-black to-gray-700 flex h-screen items-center justify-center">
      <Head>
        <title>Spotify Login </title>
        <meta name="description" content="login " />
        <link rel="icon" href="/spotify.png" />
      </Head>

      <div className="flex flex-col items-center ">
        <div className="h-3/6 w-3/6 mb-10 ">
          <Image src={logo} />
        </div>

        {Object.values(providers).map((provider) => (
          <button
            key={provider.name}
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            className=" p-4 bg-[#2ec969]  shadow-2xl text-xl  font-bold text-black rounded-2xl active:scale-95  hover:scale-110 transition-all transform ease-out text-center cursor-pointer"
          >
            Login with {provider.name}
          </button>
        ))}
        <a
          className=" mt-4  pl-32 text-gray-200 hover:text-gray-300 hover:underline no-underline md:hover:underline text-xs"
          href="https://github.com/jay75chauhan"
          target="_blank"
        >
          @jayChauhan
        </a>
      </div>
    </div>
  );
}

export default login;

export async function getServerSideProps(context) {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
