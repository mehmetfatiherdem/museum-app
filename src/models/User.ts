import { model, Model, Schema, Types } from 'mongoose';
import { userEndpointReturnVal, userLoginReturnVal } from '../helpers/type';
import bcrypt from 'bcrypt';
const saltRounds = 10;

export interface IUser {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  provider: string;
  providerId: string;
  favoriteMuseums: [Types.ObjectId];
  comments: [Types.ObjectId];
}

interface IUserMethods {
  serializedForLogin(): userLoginReturnVal;
  serializedForUserEndpoints(): userEndpointReturnVal;
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
  provider: {
    type: String,
    default: 'local',
  },
  providerId: {
    type: String,
    default: '',
  },
  favoriteMuseums: [{ type: Schema.Types.ObjectId, ref: 'museum' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'comment', default: [] }],
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // check requirements first
    const passwordRules =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRules.test(this.password)) {
      throw new Error(
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
      );
    }
    const passwordHash = await bcrypt.hash(this.password, saltRounds);
    this.password = passwordHash;
  } else {
    next();
  }
});

userSchema.path('email').validate(function (email) {
  // eslint-disable-next-line no-useless-escape
  const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email);
}, 'Invalid email');

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

userSchema.method(
  'serializedForUserEndpoints',
  function serializedForUserEndpoints() {
    const info = {
      message: `User info for ${this.name} retrieved successfully`,
      data: {
        name: this.name,
        lastName: this.lastName,
        email: this.email,
        role: this.role,
        favMuseums: this.favoriteMuseums,
        comments: this.comments,
      },
    };
    return info;
  }
);

const User = model<IUser, UserModel>(process.env.USER_MODEL_NAME, userSchema);

export default User;
