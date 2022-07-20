import { model, Schema, Types } from 'mongoose';

interface IComment {
  text: string;
  user: Types.ObjectId;
  museum: Types.ObjectId;
}

const commentSchema = new Schema<IComment>(
  {
    text: {
      type: String,
      required: [true, 'You cannot leave comment text empty'],
      maxlength: [140, 'Comment length cannot be more than 140 characters'],
    },
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    museum: { type: Schema.Types.ObjectId, ref: 'museum' },
  },
  { timestamps: true }
);

const Comment = model<IComment>(process.env.COMMENT_MODEL_NAME, commentSchema);

export default Comment;
