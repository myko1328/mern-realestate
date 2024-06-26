import mongoose from "mongoose";

export interface ListingInput {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  address: string;
  regularPrice: number;
  discountPrice: number;
  bathrooms: number;
  bedrooms: number;
  furnished: boolean;
  parking: boolean;
  type: "rent" | "sale";
  offer: boolean;
  imageUrls: string[];
  userRef: string;
}

export interface ICreateListing {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  address: string;
  regularPrice: number;
  discountPrice: number;
  bathrooms: number;
  bedrooms: number;
  furnished: boolean;
  parking: boolean;
  type: string;
  offer: boolean;
  imageUrls: string[];
  userRef: string;
}
