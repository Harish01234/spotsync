'use client';
import React from "react";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
  const router = useRouter();

  const handleSendLocation = () => {
    router.push("/sendlocation");
  };

  const handleGetLocation = () => {
    router.push("/getlocation");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6 text-white">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold">Welcome to SpotSync</h1>
        <p className="mt-2 text-lg">Easily sync and share locations with your friends.</p>
      </header>
      <main className="w-full max-w-md space-y-6">
        {/* Send Location Button */}
        <button
          className="w-full rounded-lg bg-gradient-to-r from-green-400 to-teal-500 px-6 py-4 text-lg font-medium shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
          onClick={handleSendLocation}
        >
          Send Location
        </button>
        {/* Get Location Button */}
        <button
          className="w-full rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-4 text-lg font-medium shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
          onClick={handleGetLocation}
        >
          Get Location
        </button>
      </main>
      <footer className="mt-12 text-sm opacity-80">
        &copy; 2024 SpotSync. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
