import { Request, Response } from "express";
import { SwapRequest } from "../models/swapRequestModel";
import { User } from "../models/userModel";

// Send a swap request
export const sendSwapRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { senderId, receiverId, selectedDate, selectedTime, duration, message, location } = req.body;

    // Validate required fields
    if (!senderId || !receiverId || !selectedDate || !selectedTime || !duration || !message || !location) {
      res.status(400).json({ 
        message: "All fields are required: senderId, receiverId, selectedDate, selectedTime, duration, message, location" 
      });
      return;
    }

    // Check if sender and receiver exist
    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId)
    ]);

    if (!sender) {
      res.status(404).json({ message: "Sender not found" });
      return;
    }

    if (!receiver) {
      res.status(404).json({ message: "Receiver not found" });
      return;
    }

    // Check if user is trying to send request to themselves
    if (senderId === receiverId) {
      res.status(400).json({ message: "Cannot send swap request to yourself" });
      return;
    }

    // Check if there's already a pending request between these users
    const existingRequest = await SwapRequest.findOne({
      senderId,
      receiverId,
      status: 'pending'
    });

    if (existingRequest) {
      res.status(400).json({ message: "A pending swap request already exists between these users" });
      return;
    }

    // Create the swap request
    const swapRequest = new SwapRequest({
      senderId,
      receiverId,
      selectedDate,
      selectedTime,
      duration,
      message,
      location,
      status: 'pending'
    });

    await swapRequest.save();

    // Populate sender and receiver details for response
    const populatedRequest = await SwapRequest.findById(swapRequest._id)
      .populate('senderId', 'personalInformation.name personalInformation.image')
      .populate('receiverId', 'personalInformation.name personalInformation.image');

    res.status(201).json({
      message: "Swap request sent successfully",
      swapRequest: populatedRequest
    });

  } catch (error: any) {
    console.error("❌ Error sending swap request:", error);
    res.status(500).json({
      message: "Failed to send swap request",
      error: error.message,
    });
  }
};

// Get sent swap requests for a user
export const getSentSwapRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    const sentRequests = await SwapRequest.find({ senderId: userId })
      .populate('receiverId', 'personalInformation.name personalInformation.image personalInformation.location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Sent swap requests fetched successfully",
      swapRequests: sentRequests,
      totalRequests: sentRequests.length
    });

  } catch (error: any) {
    console.error("❌ Error fetching sent swap requests:", error);
    res.status(500).json({
      message: "Failed to fetch sent swap requests",
      error: error.message,
    });
  }
};

// Get received swap requests for a user
export const getReceivedSwapRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    const receivedRequests = await SwapRequest.find({ receiverId: userId })
      .populate('senderId', 'personalInformation.name personalInformation.image personalInformation.location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Received swap requests fetched successfully",
      swapRequests: receivedRequests,
      totalRequests: receivedRequests.length
    });

  } catch (error: any) {
    console.error("❌ Error fetching received swap requests:", error);
    res.status(500).json({
      message: "Failed to fetch received swap requests",
      error: error.message,
    });
  }
};

// Update swap request status (accept/decline/cancel)
export const updateSwapRequestStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!requestId || !status) {
      res.status(400).json({ message: "Request ID and status are required" });
      return;
    }

    if (!['accepted', 'declined', 'cancelled'].includes(status)) {
      res.status(400).json({ message: "Invalid status. Must be 'accepted', 'declined', or 'cancelled'" });
      return;
    }

    const swapRequest = await SwapRequest.findById(requestId);

    if (!swapRequest) {
      res.status(404).json({ message: "Swap request not found" });
      return;
    }

    swapRequest.status = status as 'accepted' | 'declined' | 'cancelled';
    await swapRequest.save();

    const populatedRequest = await SwapRequest.findById(swapRequest._id)
      .populate('senderId', 'personalInformation.name personalInformation.image')
      .populate('receiverId', 'personalInformation.name personalInformation.image');

    res.status(200).json({
      message: `Swap request ${status} successfully`,
      swapRequest: populatedRequest
    });

  } catch (error: any) {
    console.error("❌ Error updating swap request status:", error);
    res.status(500).json({
      message: "Failed to update swap request status",
      error: error.message,
    });
  }
};
