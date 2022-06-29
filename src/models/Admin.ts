import { Schema, model, Model } from 'mongoose';

interface IAdmin {
  username: string;
  passwordHash: string;
}

interface IAdminMethods {
  confirmLogin(): string;
}

type AdminModel = Model<IAdmin, unknown, IAdminMethods>;

const adminSchema = new Schema<IAdmin, AdminModel, IAdminMethods>({
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },
});
adminSchema.method('confirmLogin', function confirmLogin() {
  return `Admin user ${this.username} logged in!`;
});

const Admin = model<IAdmin, AdminModel>(
  process.env.ADMIN_MODEL_NAME,
  adminSchema
);

export default Admin;
