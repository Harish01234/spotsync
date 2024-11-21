'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SendLocation: React.FC = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Get the user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          setError('Failed to get location.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  // Generate a random room code
  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
  };

  // Handle sending location and long polling
  const sendLocation = async () => {
    if (latitude && longitude && roomCode) {
      setIsLoading(true);
      try {
        // Send a POST request to save the location in MongoDB
        const response = await fetch('/api/location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomCode,
            latitude,
            longitude,
          }),
        });

        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          // Start long-polling for updates
          longPolling(roomCode);
        }
      } catch (err) {
        setError('Error sending location.');
      }
    } else {
      setError('Location and room code are required.');
    }
  };

  // Long polling to continuously fetch location updates from /polling
  const longPolling = (roomCode: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/polling', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ roomCode, latitude, longitude }),
        });
        
        const data = await response.json();
        if (data.latitude && data.longitude) {
          setLatitude(data.latitude);
          setLongitude(data.longitude);
        }
      } catch (err) {
        clearInterval(interval);
        setError('Error polling location updates.');
      }
    }, 5000); // Fetch updates every 5 seconds
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode).then(() => {
        alert('Room code copied!');
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6 text-white">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold">Send Your Location</h1>
        <p className="mt-2 text-lg">Share your location with others using a room code.</p>
      </header>
      <main className="w-full max-w-md space-y-6 text-center">
        <button
          className="w-full rounded-lg bg-gradient-to-r from-green-400 to-teal-500 px-6 py-4 text-lg font-medium shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
          onClick={generateRoomCode}
        >
          Generate Room Code
        </button>

        {roomCode && (
          <div className="mt-4">
            <p className="text-xl">Room Code: {roomCode}</p>
            <button
              className="mt-2 rounded-lg bg-gradient-to-r from-purple-400 to-pink-500 px-6 py-2 text-lg font-medium hover:scale-105 transition-all"
              onClick={handleCopyCode}
            >
              Copy Code
            </button>
          </div>
        )}

        {error && <p className="mt-4 text-red-500">{error}</p>}

        {latitude && longitude && roomCode && !isLoading && (
          <button
            className="w-full rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-4 text-lg font-medium shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
            onClick={sendLocation}
          >
            Send Location
          </button>
        )}

        {isLoading && <p className="text-lg">Sending location...</p>}
      </main>
      <footer className="mt-12 text-sm opacity-80">
        &copy; 2024 SpotSync. All rights reserved.
      </footer>
    </div>
  );
};

export default SendLocation;
