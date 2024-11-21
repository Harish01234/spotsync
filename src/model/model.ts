import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the Location document
interface ILocation extends Document {
  roomCode: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
}

// Define the Location schema
const locationSchema: Schema = new Schema(
  {
    roomCode: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Check if the model is already defined
const Location = mongoose.models.Location || mongoose.model<ILocation>('Location', locationSchema);

export default Location;
