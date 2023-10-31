import mongoose from "mongoose";

const Listing_Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      requied: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regular_price: {
      type: Number,
      required: true,
    },
    discounted_price: {
      type: Number,
      required: true,
    },
    bedroom: {
      type: Number,
      required: true,
    },
    bathroom: {
      type: Number,
      requied: true,
    },
    furnished: {
      type: Boolean,
      required: true,
      default: false,
    },
    parking: {
      type: Boolean,
      required: true,
      default: false,
    },
    type: {
      type: String,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
      default: false,
    },
    imageurls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ListingModel = mongoose.model("Listings", Listing_Schema);

export default ListingModel;
