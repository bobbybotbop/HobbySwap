import mongoose, { Document, Schema, model } from "mongoose";

// First define the interface
export interface IUserInteraction {
  netid: string;
  timestamp?: Date;
  location?: string;
}

export interface IUser extends Document {
  personalInformation: {
    netid: string;
    name: string;
    image?: string;
    location?: string;
    age: string;
    instagram?: string;
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