import Head from "next/head";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify-next</title>
        <link rel="icon" href="/spotify.png" />
      </Head>

      <main className="">
        <Sidebar />

        {/* center  */}
      </main>

      <div>{/* player */}</div>
    </div>
  );
}
