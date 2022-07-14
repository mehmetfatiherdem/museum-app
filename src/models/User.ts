import { model, Model, Schema, Types } from 'mongoose';
import { userLoginReturnVal } from '../helpers/type';
import bcrypt from 'bcrypt';
const saltRounds = 10;

interface IUser {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  favoriteMuseums: [Types.ObjectId];
  comments: [Types.ObjectId];
}

interface IUserMethods {
  serializedForLogin(): userLoginReturnVal;
}

type UserModel = Model<IUser, unknown, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  name: { type: String, required: [true, 'Name is required'] },
  lastName: { type: String, required: [true, 'LastName is required'] },
  email: { type: String, required: [true, 'Email is required'], unique: true },
  password: { type: String, required: [true, 'Password is required'] },
  role: {
    type: String,
    enum: {
      values: ['normal', 'admin'],
      message: "user role should be equal to one of these 'normal', 'admin'",
    },
    default: 'normal',
  },
  favoriteMuseums: [{ type: Schema.Types.ObjectId, ref: 'Museum' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: [] }],
});
userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    const passwordHash = await bcrypt.hash(this.password, saltRounds);
    this.password = passwordHash;
  }
});
userSchema.method('serializedForLogin', function serializedForLogin() {
  const info = {
    message: `Welcome to the museum app ${this.name}`,
    data: {
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      favMuseums: this.favoriteMuseums,
    },
  };
  return info;
});

const User = model<IUser, UserModel>(process.env.USER_MODEL_NAME, userSchema);

export default User;
