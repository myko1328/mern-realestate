export type CreateListingForm = {
  imageUrls: string[];
  name: string;
  description: string;
  address: string;
  type: "rent" | "sale";
  bedrooms: number;
  bathrooms: number;
  regularPrice: number;
  discountPrice: number;
  offer: boolean;
  parking: boolean;
  furnished: boolean;
};
