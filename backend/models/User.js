import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  // Profile fields
  age: {
    type: Number,
    min: 1,
  },
  weight: {
    type: Number,
    min: 1,
  },
  height: {
    type: Number,
    min: 1,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  goal: {
    type: String,
    enum: ['Lose Weight', 'Maintain Weight', 'Gain Muscle'],
  }
}, {
  timestamps: true,
});

// Compare entered password with stored plain text password
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log('Comparing passwords...');
  console.log('Entered password:', enteredPassword);
  console.log('Stored password:', this.password);
  return enteredPassword === this.password;
};

// Generate JWT token
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET || 'default_secret_key',
    { expiresIn: '7d' }
  );
};

const User = mongoose.model('User', userSchema);
export default User;
