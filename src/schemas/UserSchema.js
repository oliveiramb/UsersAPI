import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 8);
};

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      set: hashPassword,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.comparePassword = function (password) {
  console.log('req', password);
  console.log('this', this);

  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('User', UserSchema);
