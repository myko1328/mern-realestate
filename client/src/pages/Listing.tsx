import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";

import ListingView from "../features/Listing";

import "swiper/css/bundle";

export default function Listing() {
  SwiperCore.use([Navigation]);

  return (
    <main>
      <ListingView />
    </main>
  );
}
