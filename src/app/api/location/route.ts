import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/utils/dbconnect'; // Import the connection function
import RideModel from '@/model/model'; // Assuming you have a Ride model set up

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get the request body
    const reqBody = await request.json();
    const { roomCode, latitude, longitude } = reqBody;

    // Validate the request data
    if (!roomCode || !latitude || !longitude) {
      return NextResponse.json(
        { error: 'Room code, latitude, and longitude are required.' },
        { status: 400 }
      );
    }

    // Create a new location entry
    const newRide = new RideModel({
      roomCode,
      latitude,
      longitude,
      timestamp: new Date(),
    });

    // Save the location data in the database
    await newRide.save();

    return NextResponse.json(
      { message: 'Location saved successfully.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving location:', error);
    return NextResponse.json(
      { error: 'Failed to save location. Please try again.' },
      { status: 500 }
    );
  }
}
