import mongoose, { Document, Schema } from "mongoose";

export interface ISwapRequest extends Document {
  senderId: string;
  receiverId: string;
  selectedDate: string;
  selectedTime: string;
  duration: number; // in minutes
  message: string;
  location: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const swapRequestSchema = new Schema<ISwapRequest>({
  senderId: {
    type: String,
    required: true,
    ref: 'User'
  },
  receiverId: {
    type: String,
    required: true,
    ref: 'User'
  },
  selectedDate: {
    type: String,
    required: true
  },
  selectedTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 30,
    max: 300 // 5 hours max
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  location: {
    type: String,
    required: true,
    enum: ['North Campus', 'West Campus', 'Central Campus', 'Off Campus']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for efficient queries
swapRequestSchema.index({ senderId: 1, status: 1 });
swapRequestSchema.index({ receiverId: 1, status: 1 });

export const SwapRequest = mongoose.model<ISwapRequest>('SwapRequest', swapRequestSchema);
