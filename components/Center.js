import { ChevronDownIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function Center() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const playlistsId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  }, [playlistsId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistsId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.log("someting wont wrong", err));
  }, [spotifyApi, playlistsId]);

  return (
    <div className=" flex-grow text-white h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute  top-5 right-8">
        <div
          className="flex items-center  bg-black space-x-3 cursor-pointer rounded-full opacity-90 hover:opacity-80 p-1 pr-2"
          onClick={() => signOut()}
        >
          <img
            className="rounded-full w-10 h-10 p-1"
            src={session?.user?.image || "/user.png"}
            alt=""
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-2 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
      >
        <img
          className="h-40 w-40 rounded-md shadow-2xl"
          src={playlist?.images?.[0]?.url}
        />
        <div className="px-2">
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-4xl">{playlist?.name}</h1>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
}

export default Center;
