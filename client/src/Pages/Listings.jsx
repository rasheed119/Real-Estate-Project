import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../Config/Config";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { EffectCreative } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../Components/Contact";

function Listings() {
  SwiperCore.use([Navigation]);
  const { _id } = useParams();
  const [loading, setloading] = useState(false);
  const [listing, setlisting] = useState(null);
  const [copy, setcopy] = useState(false);
  const [error, seterror] = useState(false);
  const [contact, setcontact] = useState(false);
  const { currentUser } = useSelector((state) => state.user.user);
  useEffect(() => {
    setloading(true);
    seterror(false);
    const fetch_data = async () => {
      try {
        const response = await axios.get(`${api}/listings/${_id}`);
        setlisting(response.data.listing);
        setloading(false);
      } catch (error) {
        setloading(false);
        seterror(true);
      }
    };
    fetch_data();
  }, [_id]);
  console.log(listing);
  return (
    <div className="mt-20">
      {loading && (
        <div className="w-full flex justify-center items-center h-screen">
          <div className="dot-spinner">
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
          </div>
        </div>
      )}
      {error && (
        <div className="h-screen flex justify-center items-center font-bold text-3xl text-red-700">
          <h1>Something Went Wrong...</h1>
        </div>
      )}
      {listing && !loading && !error && (
        <>
          <Swiper navigation modules={[EffectCreative]} effect="creative">
            {listing.imageurls.map((url, index) => (
              <SwiperSlide key={index}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-700"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setcopy(true);
                setTimeout(() => {
                  setcopy(false);
                }, 2000);
              }}
            />
          </div>
          {copy && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - $
              {listing.offer
                ? (
                    +listing.regular_price - +listing.discounted_price
                  ).toLocaleString("en-US")
                : listing.regular_price.toLocaleString("en-US")}
              {listing.type === "rent" && "/ month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${listing.discounted_price} OFF
                </p>
              )}
            </div>
            <p className="text-slate-700">
              <span className="text-black font-semibold">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-800 font-semibold text-sm flex flex-wrap gap-2 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap text-green-800 font-semibold text-sm">
                <FaBed className="text-lg" />
                {listing.bedroom > 1
                  ? `${listing.bedroom} bedrooms`
                  : `${listing.bedroom} bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap text-green-800 font-semibold text-sm">
                <FaBed className="text-lg" />
                {listing.bathroom > 1
                  ? `${listing.bathroom} bathrooms`
                  : `${listing.bathroom} bathroom`}
              </li>
              <li
                className={`flex items-center gap-1 whitespace-nowrap ${
                  listing.parking ? `text-green-800` : `text-red-800`
                } font-semibold text-sm`}
              >
                <FaParking className="text-lg" />
                {listing.parking ? "Parking" : "No Parking"}
              </li>
              <li
                className={`flex items-center gap-1 whitespace-nowrap ${
                  listing.furnished ? `text-green-800` : `text-red-800`
                } font-semibold text-sm`}
              >
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "UnFurnished"}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setcontact(true)}
                className="p-3 bg-slate-700 text-white rounded-lg hover:opacity-80 uppercase"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </>
      )}
    </div>
  );
}

export default Listings;
