import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxLength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false,
    validate: [
      {
        validator: function(password) {
          // Check all password requirements in one validator
          const hasMinLength = password.length >= 8;
          const hasUpperCase = /[A-Z]/.test(password);
          const hasLowerCase = /[a-z]/.test(password);
          const hasNumber = /\d/.test(password);
          
          return hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
        },
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
      }
    ]
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  tokens: [{
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Clear login attempts on password change
    this.loginAttempts = 0;
    this.lockUntil = undefined;
    
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  try {
    return await bcrypt.compare(candidatePassword, userPassword);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

// Check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
userSchema.methods.incrementLoginAttempts = async function() {
  // Reset attempts if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }

  // Otherwise increment
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock the account if we've reached max attempts (5)
  if (this.loginAttempts + 1 >= 5) {
    updates.$set = { lockUntil: Date.now() + 1800000 }; // Lock for 30 minutes
  }

  return await this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

// Check if password changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Add token to user's tokens array
userSchema.methods.addToken = async function(token) {
  this.tokens = this.tokens.concat({ token });
  await this.save();
};

// Remove token from user's tokens array
userSchema.methods.removeToken = async function(token) {
  this.tokens = this.tokens.filter(t => t.token !== token);
  await this.save();
};

const User = mongoose.model('User', userSchema);

export default User;
