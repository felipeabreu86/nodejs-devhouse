import { Schema, model } from 'mongoose';

const HouseSchema = new Schema(
  {
    thumbnail: String,
    description: String,
    price: Number,
    location: String,
    status: Boolean,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

function getThumbnail() {
  return `http://localhost:3333/files/${this.thumbnail}`;
}

HouseSchema.virtual('thumbnail_url').get(getThumbnail);

export default model('House', HouseSchema);
