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

    // Find the existing location by roomCode
    const existingLocation = await RideModel.findOne({ roomCode });

    if (!existingLocation) {
      return NextResponse.json(
        { error: 'Location with the given room code not found.' },
        { status: 404 }
      );
    }

    // Update the location data
    existingLocation.latitude = latitude;
    existingLocation.longitude = longitude;
    existingLocation.timestamp = new Date(); // Update the timestamp

    // Save the updated location
    await existingLocation.save();

    return NextResponse.json(
      { message: 'Location updated successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { error: 'Failed to update location. Please try again.' },
      { status: 500 }
    );
  }
}


