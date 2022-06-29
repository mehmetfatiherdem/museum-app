import { model, Model, Schema, Types } from 'mongoose';
import { userLoginReturnVal } from '../helpers/type';

interface IUser {
  name: string;
  lastName: string;
  email: string;
  passwordHash: string;
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
  passwordHash: { type: String, required: true },
  favoriteMuseums: [{ type: Schema.Types.ObjectId, ref: 'Museum' }],
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
