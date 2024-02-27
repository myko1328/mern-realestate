import { useCallback, useEffect, useMemo, useState } from "react";

export const useGetHomepageListings = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  const fetchOfferListings = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/listing/get?offer=true&limit=4");
      const data = await res.json();
      setOfferListings(data);
      fetchRentListings();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchRentListings = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/listing/get?type=rent&limit=4");
      const data = await res.json();
      setRentListings(data);
      fetchSaleListings();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchSaleListings = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/listing/get?type=sale&limit=4");
      const data = await res.json();
      setSaleListings(data);
    } catch (error) {
      console.log({ error });
    }
  }, []);

  useEffect(() => {
    fetchOfferListings();
  }, [fetchOfferListings]);

  // Memoize the state variables
  const memoizedOfferListings = useMemo(() => offerListings, [offerListings]);
  const memoizedSaleListings = useMemo(() => saleListings, [saleListings]);
  const memoizedRentListings = useMemo(() => rentListings, [rentListings]);

  return {
    memoizedOfferListings,
    memoizedSaleListings,
    memoizedRentListings,
  };
};
