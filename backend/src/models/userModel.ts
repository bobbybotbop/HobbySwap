import mongoose, { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  personalInformation: {
    netid: string;
    name: string;
    image?: string;
    location?: string;
    age: string;
    instagram?: string;
  };
  hobbies: string[];
  hobbiesWantToLearn: string[];
  encryptedPassword: string;
}

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
  },
  { timestamps: false }
);

// 3️⃣ Create and export the model
const User = model<IUser>("User", UserSchema);

export default User;