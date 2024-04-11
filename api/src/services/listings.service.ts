import { NextFunction } from "express";
import { QueryParams } from "../interfaces/QueryParams";
import Listing from "../models/listing.model";
import { errorHandler } from "../utlis/error";
import { ListingInput } from "../interfaces/ListingInput";

export const getListings = async (query: QueryParams) => {
  const limit: number = parseInt(query.limit ?? "0") || 9;
  const startIndex: number = parseInt(query.startIndex ?? "0") || 0;
  let offer = query.offer;

  if (offer === undefined || offer === "false") {
    offer = { $in: [false, true] };
  }

  let furnished = query.furnished;

  if (furnished === undefined || furnished === "false") {
    furnished = { $in: [false, true] };
  }

  let parking = query.parking;

  if (parking === undefined || parking === "false") {
    parking = { $in: [false, true] };
  }

  let type = query.type;

  if (type === undefined || type === "all") {
    type = { $in: ["sale", "rent"] };
  }

  const searchTerm = query.searchTerm || "";

  const sort = query.sort || "createdAt";

  const order = query.order || "desc";

  const sortCriteria: { [key: string]: "asc" | "desc" } = {};
  sortCriteria[sort] = order as "asc" | "desc";

  const listings = await Listing.find({
    name: { $regex: searchTerm, $options: "i" },
    offer,
    furnished,
    parking,
    type,
  })
    .sort(sortCriteria)
    .limit(limit)
    .skip(startIndex);

  return listings;
};

export const getListing = async (id: string, next: NextFunction) => {
  const listing = await Listing.findById(id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  return listing;
};

export const updateListing = async (
  id: string,
  userId: string | undefined,
  listingInput: ListingInput,
  next: NextFunction
) => {
  const listing = await Listing.findById(id);
  console.log({ listing });
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (userId !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(id, listingInput, {
      new: true,
    });

    return updatedListing;
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (
  id: string,
  userId: string | undefined,
  next: NextFunction
) => {
  const listing = await Listing.findById(id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (userId !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(id);
  } catch (error) {
    next(error);
  }
};

export const createListing = async (
  listingInput: ListingInput,
  next: NextFunction
) => {
  try {
    const listing = await Listing.create(listingInput);
    return listing;
  } catch (error) {
    next(error);
  }
};
