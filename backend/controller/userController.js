import User from '../models/User.js';

// 🚀 Sign In User
export const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordMatch = await user.matchPassword(cleanPassword);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateToken();

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Error signing in user' });
  }
};

// 🚀 Sign Up User
export const signUpUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check if user already exists
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user - password will be hashed by the pre-save middleware
    const user = await User.create({
      firstName,
      lastName,
      email: cleanEmail,
      password: cleanPassword,
    });

    if (user) {
      const token = user.generateToken();
      res.status(201).json({
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token,
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// 🚀 Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      profile: {
        age: user.age,
        weight: user.weight,
        height: user.height,
        gender: user.gender,
        goal: user.goal
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// 🚀 Save User Profile
export const saveUserProfile = async (req, res) => {
  try {
    const { age, weight, height, gender, goal } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if any profile data already exists
    if (user.age || user.weight || user.height || user.gender || user.goal) {
      return res.status(400).json({ 
        message: 'Profile data already exists. Cannot update existing profile.',
        profile: {
          age: user.age,
          weight: user.weight,
          height: user.height,
          gender: user.gender,
          goal: user.goal
        }
      });
    }

    // Set profile fields
    user.age = age;
    user.weight = weight;
    user.height = height;
    user.gender = gender;
    user.goal = goal;

    await user.save();

    res.status(200).json({
      message: 'Profile created successfully',
      profile: {
        age: user.age,
        weight: user.weight,
        height: user.height,
        gender: user.gender,
        goal: user.goal
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};
