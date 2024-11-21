// /api/polling.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/utils/dbconnect'; // Import the connection function
import RideModel from '@/model/model'; // Assuming you have a Ride model set up

export async function POST(request: NextRequest) {
  try {
    // Get the request body (POST request contains the body)
    const reqBody = await request.json();
    const { roomCode } = reqBody;

    // Validate the request data
    if (!roomCode) {
      return NextResponse.json(
        { error: 'Room code is required.' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the most recent location based on the roomCode
    const location = await RideModel.findOne({ roomCode }).sort({ timestamp: -1 });

    if (!location) {
      return NextResponse.json(
        { error: 'Location with the given room code not found.' },
        { status: 404 }
      );
    }

    // Return the location data
    return NextResponse.json({
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: location.timestamp,
    });
  } catch (error) {
    console.error('Error fetching location:', error);
    return NextResponse.json(
      { error: 'Failed to fetch location. Please try again.' },
      { status: 500 }
    );
  }
}
