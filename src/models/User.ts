import { model, Model, Schema, Types } from 'mongoose';
import { userLoginReturnVal } from '../helpers/type';
import bcrypt from 'bcrypt';
const saltRounds = 10;

export interface IUser {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  favoriteMuseums: [Types.ObjectId];
}

interface IUserMethods {
  serializedForLogin(): userLoginReturnVal;
}

type UserModel = Model<IUser, unknown, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: {
      values: ['normal', 'admin'],
      message: "user role should be equal to one of these 'normal', 'admin'",
    },
    default: 'normal',
  },
  favoriteMuseums: [{ type: Schema.Types.ObjectId, ref: 'Museum' }],
});
userSchema.pre('save', async function () {
  const passwordHash = await bcrypt.hash(this.password, saltRounds);
  this.password = passwordHash;
});
userSchema.method('serializedForLogin', function serializedForLogin() {
  const info = {
    message: `Welcome to the museum app ${this.name}`,
    data: {
      name: this.name,
      lastName: this.lastName,
      email: this.email,
    },
  };
  return info;
});

const User = model<IUser, UserModel>(process.env.USER_MODEL_NAME, userSchema);

export default User;
