import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent multiple admins - ensure only one admin exists
userSchema.pre('save', async function (next) {
  if (this.role === 'admin') {
    const existingAdmin = await mongoose.model<IUser>('User').findOne({ role: 'admin' }) as IUser | null;
    if (existingAdmin && existingAdmin._id.toString() !== this._id.toString()) {
      throw new Error('Only one admin user is allowed');
    }
  }
  next();
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User; 