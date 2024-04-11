export interface ListingInput {
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
