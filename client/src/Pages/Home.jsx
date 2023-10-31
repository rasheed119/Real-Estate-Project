import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { api } from "../Config/Config";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../Components/ListingItem";

function Home() {
  const [offerListing, SetofferListing] = useState([]);
  const [sellListing, setsellListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchofferdata = async () => {
      try {
        const response = await axios.get(
          `${api}/listings/search/get?offer=true&limit=4`
        );
        SetofferListing(response.data);
        fetchSellListing();
      } catch (error) {
        console.error(error.message);
      }
    };
    const fetchSellListing = async () => {
      try {
        const response = await axios.get(
          `${api}/listings/search/get?type=sell&limit=4`
        );
        setsellListing(response.data);
        fetchRentListing();
      } catch (error) {
        console.error(error.message);
      }
    };
    const fetchRentListing = async () => {
      try {
        const response = await axios.get(
          `${api}/listings/search/get?type=rent&limit=4`
        );
        setRentListing(response.data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchofferdata();
  }, []);
  return (
    <div className="mt-20">
      <div className="flex flex-col gap-6 p-28 px-3 mx-auto max-w-6xl">
        <h1 className="font-bold text-3xl text-slate-700 lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-600 text-xs sm:text-sm">
          Rasheed Estate will help you find your home fast, easy and
          comfortable.
          <br />
          Our expert support are always available.
        </div>
        <Link
          to="/search"
          className="text-blue-700 hover:underline font-bold text-xs sm:text-sm"
        >
          Lets get started...
        </Link>
      </div>
      <Swiper navigation>
        {sellListing &&
          sellListing.length > 0 &&
          sellListing.map((listing, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  background: `url(${listing.imageurls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListing && offerListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to="/search?offer=true"
              >
                Show More Offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-10">
              {offerListing.map((listings, index) => (
                <ListingItem listing={listings} key={index} />
              ))}
            </div>
          </div>
        )}
        {sellListing && sellListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Places for sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to="/search?type=sell"
              >
                Show More Place for Sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-10">
              {sellListing.map((listings, index) => (
                <ListingItem listing={listings} key={index} />
              ))}
            </div>
          </div>
        )}
        {rentListing && rentListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Places for rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to="/search?type=rent"
              >
                Show More Places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-10">
              {rentListing.map((listings, index) => (
                <ListingItem listing={listings} key={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
