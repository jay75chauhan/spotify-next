import React, { useEffect, useState, useCallback } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSonginfo from "../hooks/useSonginfo";
import useSpotify from "../hooks/useSpotify";

import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";

import {
  RewindIcon,
  SwitchHorizontalIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";

function Player() {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(20);

  const songInfo = useSonginfo();

  const fetchCurrentTrack = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now Playing", data.body?.item);
        setCurrentTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentTrack();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi]);

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume);
    }, 500)
  );

  useEffect(() => {
    if (volume > 0 && volume < 100) {
       debouncedAdjustVolume(volume);
    }
  }, [volume]);

  return (
    <div className="grid md:grid-cols-3 text-xs md:text-base h-24 px-2 md:px-8 bg-gradient-to-b from-black to-gray-900 text-white ">
      {/* left */}
      <div className=" items-center space-x-4 hidden md:inline-flex">
        <img
          className="hidden md:inline h-10 w-10 rounded-xl"
          src={songInfo?.album.images?.[0]?.url}
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* center */}

      <div className="flex flex-1 items-center justify-evenly ">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          className="button"

          // onClick={() => spotifyApi.skipToPrevious()} the APT is not working
        />
        {isPlaying ? (
          <PauseIcon
            className="button w-10 h-10"
            onClick={() => handlePlayPause}
          />
        ) : (
          <PlayIcon
            className="button  w-10 h-10"
            onClick={() => handlePlayPause}
          />
        )}
        <FastForwardIcon
          className="button"
          // onClick={() => spotifyApi.skipToNext()} the APT i
        />
        <ReplyIcon className="button" />
      </div>

      {/* right */}

      <div className="hidden md:inline-flex items-center space-x-3 md:space-x-4 justify-end">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />

        <input
          type="range"
          value={volume}
          min={0}
          max={100}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  );
}

export default Player;
