'use client';

import { useState, useEffect } from 'react';

const GetLocation = () => {
  const [roomCode, setRoomCode] = useState('');
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
    timestamp: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Handle input change for roomCode
  const handleRoomCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomCode(event.target.value);
  };

  // Function to send the room code and get initial data
  const sendRoomCode = async () => {
    if (!roomCode) {
      setError('Room code is required');
      return;
    }

    setIsPolling(true);
    setError(null);

    try {
      console.log('Sending room code for initial data:', roomCode);

      // POST request to get initial location data
      const response = await fetch('/api/getlocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomCode }),
      });

      const data = await response.json();
      console.log('Received initial data:', data);  // Log the response

      if (data.error) {
        setError(data.error);
        setIsPolling(false);
      } else {
        setLocationData({
          latitude: data.latitude,
          longitude: data.longitude,
          timestamp: data.timestamp,
        });
      }
    } catch (error) {
      setError('Error fetching location data');
      setIsPolling(false);
    }
  };

  // Long polling to get updated location data using request body
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const startPolling = async () => {
      try {
        interval = setInterval(async () => {
          if (!isPolling || !roomCode) return; // Ensure roomCode is set before polling

          // Poll with the roomCode in the request body (not URL)
          const response = await fetch('/api/getlocation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomCode }), // Sending roomCode in the request body
          });
          const data = await response.json();

          console.log('Polling data received:', data);  // Log polling data to check

          if (data.error) {
            setError(data.error);
            setIsPolling(false); // Stop polling on error
            clearInterval(interval);
          } else {
            setLocationData({
              latitude: data.latitude,
              longitude: data.longitude,
              timestamp: data.timestamp,
            });
          }
        }, 3000); // Poll every 3 seconds
      } catch (error) {
        setError('Error fetching location data');
        setIsPolling(false); // Stop polling on error
      }
    };

    if (isPolling && roomCode) {
      startPolling();
    }

    // Clean up the interval on component unmount
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPolling, roomCode]); // Trigger polling when isPolling or roomCode changes

  // Stop polling when the user enters the room code and starts the polling
  useEffect(() => {
    if (!roomCode) setIsPolling(false); // Stop polling if roomCode is cleared
  }, [roomCode]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-4xl font-extrabold text-center mb-6 text-indigo-600">Get Location</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendRoomCode();
          }}
          className="space-y-6"
        >
          <div>
            <label htmlFor="roomCode" className="block text-xl font-medium text-gray-700">
              Enter Room Code
            </label>
            <input
              id="roomCode"
              type="text"
              value={roomCode}
              onChange={handleRoomCodeChange}
              required
              className="mt-2 p-4 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-transparent text-gray-700 placeholder-gray-500 transition-all duration-300"
              placeholder="Room code"
            />
          </div>
          <button
            type="submit"
            disabled={isPolling}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {isPolling ? 'Polling...' : 'Get Location'}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-red-500 text-center">
            <p>{error}</p>
          </div>
        )}

        {(
          <div className="mt-6 text-center bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-medium text-indigo-600">Location Data (Live Update):</h3>
            <p className="mt-2 text-lg text-gray-800">
              <strong className="text-xl">Latitude:</strong> {locationData.latitude}
            </p>
            <p className="mt-2 text-lg text-gray-800">
              <strong className="text-xl">Longitude:</strong> {locationData.longitude}
            </p>
            {locationData.timestamp && (
              <p className="mt-2 text-lg text-gray-800">
                <strong className="text-xl">Timestamp:</strong>{' '}
                {new Date(locationData.timestamp).toLocaleString()}
              </p>
            )}
            <div className="mt-4 text-sm text-gray-500">Updating every 3 seconds...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetLocation;
