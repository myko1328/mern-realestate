import { Request, Response, NextFunction } from "express";
import { QueryParams } from "../interfaces/QueryParams";
import * as ListingService from "../services/listings.service";

interface User {
  id: string;
}

interface AuthenticatedRequest extends Request {
  user?: User;
}

export const createListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listing = await ListingService.createListing(req.body, next);

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await ListingService.deleteListing(req.params.id, req.user?.id, next);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const listing = await ListingService.updateListing(
    req.params.id,
    req.user?.id,
    req.body,
    next
  );

  try {
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listing = await ListingService.getListing(req.params.id, next);
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (
  req: Request<{}, {}, {}, QueryParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const listings = await ListingService.getListings(req.query);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
