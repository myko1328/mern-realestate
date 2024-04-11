export type Listing = {
  length: number;
  address: string;
  bathrooms: number;
  bedrooms: number;
  createdAt: string;
  description: string;
  discountPrice: number;
  furnished: boolean;
  imageUrls: string[];
  name: string;
  offer: boolean;
  parking: boolean;
  regularPrice: number;
  type: "rent" | "sale";
  updatedAt: string;
  userRef: string;
  __v: number;
  _id: string;
};