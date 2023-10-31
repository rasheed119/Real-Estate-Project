import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg overflow-hidden rounded-lg w-[330px] relative">
      {listing.type === "sell" && (
        <p className="bg-green-600 absolute top-2 right-2 z-10 text-white rounded-lg p-1">
          For Sale
        </p>
      )}
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageurls[0]}
          alt={listing.name}
          className="w-full h-[220px] sm:h-[220px] object-cover hover:scale-105  duration-300"
        />
        <div className="p-3 flex flex-col gap-2">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="text-green-700 w-4 h-4" />
            <p className="text-sm text-slate-600">{listing.address}</p>
          </div>
          <p className="line-clamp-2 text-sm text-gray-600">
            {listing.description}
          </p>
          <p className=" mt-2 font-semibold text-slate-500">
            ${" "}
            {listing.offer
              ? (
                  +listing.regular_price - +listing.discounted_price
                ).toLocaleString("en-US")
              : listing.regular_price.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="text-slate-700 flex gap-5">
            <div className="font-bold text-xs">
              {listing.bedroom > 1
                ? `${listing.bedroom} Beds`
                : `${listing.bedroom} Bed`}
            </div>
            <div className="font-bold text-xs">
              {listing.bathroom > 1
                ? `${listing.bathroom} Baths`
                : `${listing.bathroom} Bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

ListingItem.propTypes = {
  listing: PropTypes.object,
};

export default ListingItem;
