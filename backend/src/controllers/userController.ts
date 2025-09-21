import { Request, Response } from "express";
import { User, InteractedUser } from "../models/userModel";
import bcrypt from "bcrypt";

// GET all users EXCEPT for encrypted password
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("🔍 Fetching all users from database...");
    const users = await User.find({}).select(
      "-personalInformation.encryptedPassword"
    );

    console.log(`📊 Found ${users.length} users in database`);

    // Debug each user's image
    users.forEach((user, index) => {
      console.log(`👤 User ${index + 1}:`);
      console.log(`   📝 Name: ${user.personalInformation.name}`);
      console.log(`   🆔 NetID: ${user.personalInformation.netid}`);
      console.log(
        `   🖼️ Image: ${user.personalInformation.image || "NO IMAGE"}`
      );
      console.log(
        `   📍 Location: ${user.personalInformation.location || "NO LOCATION"}`
      );
    });

    res.status(200).json(users);
  } catch (error: any) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET user
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Validate user credientials
export const verifyPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { netid, password } = req.body; // client provides netid + password

    const user = await User.findOne({
      "personalInformation.netid": netid,
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(
      password,
      user.personalInformation.encryptedPassword
    ); // compare input with hashed password
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    res.status(200).json({ message: "Password verified successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE password of user
export const updatePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      res.status(404).json({ message: "New Password is required" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { "personalInformation.encryptedPassword": hashedPassword },
      { new: true }
    ).select("-personalInformation.encryptedPassword");

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE new user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { personalInformation, hobbies, hobbiesWantToLearn } = req.body;

    // Debug logging
    console.log("🔍 Creating user with data:");
    console.log("📝 Name:", personalInformation.name);
    console.log("🆔 NetID:", personalInformation.netid);
    console.log("🖼️ Image URL:", personalInformation.image);
    console.log("📍 Location:", personalInformation.location);
    console.log("🎯 Hobbies:", hobbies);
    console.log("📚 Hobbies to learn:", hobbiesWantToLearn);

    // Check if user already exists
    const existingUser = await User.findOne({
      "personalInformation.netid": personalInformation.netid,
    }).select("-personalInformation.encryptedPassword");

    if (existingUser) {
      console.log("❌ User already exists:", personalInformation.netid);
      res.status(409).json({
        message: "User with this email already exists",
      });
      return;
    }

    // Hash password
    personalInformation.encryptedPassword = await bcrypt.hash(
      personalInformation.encryptedPassword,
      10
    );

    // Create new user
    const newUser = new User({
      personalInformation,
      hobbies,
      hobbiesWantToLearn,
    });

    console.log("💾 Saving user to database...");
    const savedUser = await newUser.save();

    console.log("✅ User saved successfully!");
    console.log("🆔 Saved user ID:", savedUser._id);
    console.log("🖼️ Saved image URL:", savedUser.personalInformation.image);

    res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    console.error("❌ Error creating user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Send swap request (enhanced sendUser function)
export const sendSwapRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { senderId, receiverId, selectedDate, selectedTime, duration, message, location } = req.body;

    // Basic validation
    if (!senderId || !receiverId || !selectedDate || !selectedTime || !duration || !message || !location) {
      res.status(400).json({ message: 'All fields are required: senderId, receiverId, selectedDate, selectedTime, duration, message, location' });
      return;
    }

    if (senderId === receiverId) {
      res.status(400).json({ message: 'Cannot send a swap request to yourself' });
      return;
    }

    // 1. Get sender user first
    const senderUser = await User.findById(senderId);
    if (!senderUser) {
      res.status(404).json({ message: "Sender user not found" });
      return;
    }

    // 2. Check if target user exists
    const targetUser = await User.findById(receiverId);
    if (!targetUser) {
      res.status(404).json({ message: "Target user not found" });
      return;
    }

    // 3. Check if already sent to this person (prevent duplicates)
    const alreadySent = senderUser.usersSent.some(
      (user: any) => user.netid === targetUser.personalInformation.netid
    );

    if (alreadySent) {
      res.status(409).json({ message: "Swap request already sent to this person" });
      return;
    }

    // 4. Create swap request data
    const swapRequestData = {
      netid: targetUser.personalInformation.netid || "unknown_user",
      location: location,
      date: selectedDate,
      time: selectedTime,
      duration: duration,
      message: message,
      timestamp: new Date(),
      status: 'pending'
    };

    // 5. Update the sender's usersSent array
    const updatedSender = await User.findByIdAndUpdate(
      senderId,
      {
        $push: {
          usersSent: swapRequestData,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-personalInformation.encryptedPassword");

    if (!updatedSender) {
      res.status(404).json({ message: "Sender user not found during update" });
      return;
    }

    // 6. Update the receiver's usersReceived array (simplified)
    try {
      await User.findOneAndUpdate(
        { _id: receiverId },
        {
          $push: {
            usersReceived: {
              netid: senderUser.personalInformation.netid || "unknown_sender",
              location: location,
              date: selectedDate,
              time: selectedTime,
              duration: duration,
              message: message,
              timestamp: new Date(),
              status: 'pending'
            },
          },
        },
        { new: true }
      );
    } catch (error) {
      console.log("⚠️ Could not update receiver (non-critical):", error);
      // Continue anyway - the main swap request was sent
    }

    // 7. Return success response
    res.status(200).json({
      message: "Swap request sent successfully",
      swapRequest: {
        senderId: senderId,
        receiverId: receiverId,
        selectedDate: selectedDate,
        selectedTime: selectedTime,
        duration: duration,
        message: message,
        location: location,
        status: 'pending',
        timestamp: new Date()
      }
    });
  } catch (error: any) {
    console.error('❌ Error sending swap request:', error);
    res.status(500).json({ message: error.message });
  }
};

// Legacy sendUser function (kept for backward compatibility)
export const sendUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // This should be the sender's ID
    const { netid, location, date } = req.body;

    // 1. Get sender user first
    const senderUser = await User.findById(id);
    if (!senderUser) {
      res.status(404).json({ message: "Sender user not found" });
      return;
    }

    // 2. Check if sending to yourself
    if (netid === senderUser.personalInformation.netid) {
      res.status(400).json({ message: "Cannot send to yourself" });
      return;
    }

    // 3. Check if target user exists
    const targetUser = await User.findOne({
      "personalInformation.netid": netid,
    }).select("-personalInformation.encryptedPassword");

    if (!targetUser) {
      res.status(404).json({ message: "Target user does not exist" });
      return;
    }

    // 4. Check if already sent to this person
    const alreadySent = senderUser.usersSent.some(
      (user: any) => user.netid === netid
    );

    if (alreadySent) {
      res
        .status(409)
        .json({ message: "User has already been sent to this person" });
      return;
    }

    // 5. Update the sender's usersSent array
    const updatedUser = await User.findByIdAndUpdate(
      id, // Use the ID from params
      {
        $push: {
          usersSent: {
            netid: netid,
            location: location || "",
            date: date || new Date(),
            timestamp: new Date(), // Always add timestamp
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-personalInformation.encryptedPassword");

    if (!updatedUser) {
      res.status(404).json({ message: "User not found during update" });
      return;
    }

    const sentUser = await User.findOneAndUpdate(
      { "personalInformation.netid": netid },
      {
        $push: {
          usersReceived: {
            // ✅ Fixed spelling: "usersReceived" not "usersRecieved"
            netid: senderUser.personalInformation.netid,
            location: location || "",
            date: date || new Date(),
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    // 6. Return correct response
    res.status(200).json({
      message: "User sent successfully",
      usersSent: updatedUser.usersSent,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserByNetId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { netid } = req.params; // ✅ Get netid from URL params
    const user = await User.findOne({
      "personalInformation.netid": netid, // ✅ Correct field path
    }).select("-personalInformation.encryptedPassword"); // ✅ Exclude password

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserPersonalInformation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { personalInformation } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { personalInformation: personalInformation },
      { new: true }
    ).select("-personalInformation.encryptedPassword");

    res.status(200).json("Successfully updated personal information");
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserHobbies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { hobbies } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { hobbies: hobbies },
      { new: true }
    ).select("-personalInformation.encryptedPassword");

    res.status(200).json("Successfully updated user hobbies");
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserHobbiesWant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { hobbiesWantToLearn } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { hobbiesWantToLearn: hobbiesWantToLearn },
      { new: true }
    ).select("-personalInformation.encryptedPassword");

    res.status(200).json("Successfully updated user new hobbies to learn");
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get sent swap requests for a user
export const getSentSwapRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-personalInformation.encryptedPassword");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Get detailed information about each sent request
    const sentRequests = await Promise.all(
      user.usersSent.map(async (request: any) => {
        // Find the receiver user to get their details
        const receiver = await User.findOne({ 
          "personalInformation.netid": request.netid 
        }).select("personalInformation.name personalInformation.image personalInformation.location");
        
        return {
          _id: request._id,
          receiverId: {
            _id: receiver?._id,
            personalInformation: {
              name: receiver?.personalInformation.name || "Unknown User",
              image: receiver?.personalInformation.image,
              location: receiver?.personalInformation.location
            }
          },
          selectedDate: request.date,
          selectedTime: request.time,
          duration: request.duration,
          message: request.message,
          location: request.location,
          status: request.status || 'pending',
          createdAt: request.timestamp,
          updatedAt: request.timestamp
        };
      })
    );

    res.status(200).json({
      message: "Sent swap requests fetched successfully",
      swapRequests: sentRequests,
      totalRequests: sentRequests.length
    });
  } catch (error: any) {
    console.error('❌ Error fetching sent swap requests:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get received swap requests for a user
export const getReceivedSwapRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-personalInformation.encryptedPassword");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Get detailed information about each received request
    const receivedRequests = await Promise.all(
      user.usersReceived.map(async (request: any) => {
        // Find the sender user to get their details
        const sender = await User.findOne({ 
          "personalInformation.netid": request.netid 
        }).select("personalInformation.name personalInformation.image personalInformation.location");
        
        return {
          _id: request._id,
          senderId: {
            _id: sender?._id,
            personalInformation: {
              name: sender?.personalInformation.name || "Unknown User",
              image: sender?.personalInformation.image,
              location: sender?.personalInformation.location
            }
          },
          selectedDate: request.date,
          selectedTime: request.time,
          duration: request.duration,
          message: request.message,
          location: request.location,
          status: request.status || 'pending',
          createdAt: request.timestamp,
          updatedAt: request.timestamp
        };
      })
    );

    res.status(200).json({
      message: "Received swap requests fetched successfully",
      swapRequests: receivedRequests,
      totalRequests: receivedRequests.length
    });
  } catch (error: any) {
    console.error('❌ Error fetching received swap requests:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update swap request status (accept/decline/cancel)
export const updateSwapRequestStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { requestId } = req.params;
    const { status, userId } = req.body; // userId to identify which user is updating

    if (!['accepted', 'declined', 'cancelled'].includes(status)) {
      res.status(400).json({ message: 'Invalid status provided. Must be "accepted", "declined", or "cancelled".' });
      return;
    }

    // Find the user and update the specific request
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Update the request in usersReceived array
    const updatedUser = await User.findOneAndUpdate(
      { 
        _id: userId,
        "usersReceived._id": requestId 
      },
      {
        $set: {
          "usersReceived.$.status": status,
          "usersReceived.$.updatedAt": new Date()
        }
      },
      { new: true }
    ).select("-personalInformation.encryptedPassword");

    if (!updatedUser) {
      res.status(404).json({ message: "Swap request not found" });
      return;
    }

    // Also update the corresponding request in the sender's usersSent array
    const request = user.usersReceived.find((req: any) => req._id.toString() === requestId);
    if (request) {
      await User.findOneAndUpdate(
        { 
          "personalInformation.netid": request.netid,
          "usersSent.netid": user.personalInformation.netid
        },
        {
          $set: {
            "usersSent.$.status": status,
            "usersSent.$.updatedAt": new Date()
          }
        }
      );
    }

    res.status(200).json({
      message: `Swap request status updated to ${status}`,
      swapRequest: {
        _id: requestId,
        status: status,
        updatedAt: new Date()
      }
    });
  } catch (error: any) {
    console.error('❌ Error updating swap request status:', error);
    res.status(500).json({ message: error.message });
  }
};
