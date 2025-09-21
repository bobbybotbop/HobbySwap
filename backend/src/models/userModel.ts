import mongoose, { Document, Schema, model } from "mongoose";

// First define the interface
export interface IUserInteraction {
  netid: string;
  timestamp?: Date;
  location?: string;
  // Additional fields for swap requests
  date?: string;
  time?: string;
  duration?: number;
  message?: string;
  status?: string;
  updatedAt?: Date;
}

export interface IUser extends Document {
  personalInformation: {
    netid: string;
    name: string;
    image?: string;
    location?: string;
    age: string;
    instagram?: string;
    bio?: string;
    encryptedPassword: string;
  };
  hobbies: string[];
  hobbiesWantToLearn: string[];
  usersSent: IUserInteraction[];
  usersFavorited: string[];
  usersReceived: IUserInteraction[];
}

const InteractedUserSchemea: Schema<IUserInteraction> = new Schema({
  netid: { type: String, required: true },
  timestamp: { type: Date, required: false },
  location: { type: String, required: false },
  // Additional fields for swap requests
  date: { type: String, required: false },
  time: { type: String, required: false },
  duration: { type: Number, required: false },
  message: { type: String, required: false },
  status: { type: String, required: false, default: 'pending' },
  updatedAt: { type: Date, required: false },
});

// 2️⃣ Define the schema
const UserSchema: Schema<IUser> = new Schema(
  {
    personalInformation: {
      netid: { type: String, required: true },
      name: { type: String, required: true },
      image: { type: String, required: false },
      location: { type: String, required: false },
      age: { type: String, required: true },
      instagram: { type: String, required: false },
      bio: { type: String, required: false },
      encryptedPassword: { type: String, required: false },
    },
    hobbies: [{ type: String }],
    hobbiesWantToLearn: [{ type: String }],
    usersSent: [{ type: InteractedUserSchemea, required: false }],
    usersFavorited: [{ type: String, required: false }],
    usersReceived: [{ type: InteractedUserSchemea, required: false }],
  },
  { timestamps: false }
);

// Create models
export const InteractedUser = mongoose.model<IUserInteraction>(
  "InteractedUser",
  InteractedUserSchemea
);
export const User = mongoose.model<IUser>("User", UserSchema);
