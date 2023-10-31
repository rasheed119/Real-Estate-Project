/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../Config/Config";
import ListingItem from "../Components/ListingItem";

function Search() {
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [Listing, setListing] = useState([]);
  const [showmore, setshowmore] = useState(false);
  const [sidebarData, setsidebarData] = useState({
    searchTerm: "",
    type: "all",
    furnished: false,
    parking: false,
    offer: false,
    sort: "createdAt",
    order: -1,
  });
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermfromURL = urlParams.get("searchTerm");
    const offerfromURL = urlParams.get("offer");
    const furnishedfromURL = urlParams.get("furnished");
    const parkingfromURL = urlParams.get("parking");
    const sortfromURL = urlParams.get("sort");
    const orderfromURL = urlParams.get("order");
    const typefromURL = urlParams.get("type");
    if (
      searchTermfromURL ||
      typefromURL ||
      offerfromURL ||
      furnishedfromURL ||
      parkingfromURL ||
      sortfromURL ||
      orderfromURL
    ) {
      setsidebarData({
        searchTerm: searchTermfromURL || "",
        type: typefromURL || "all",
        offer: offerfromURL === "true" ? true : false,
        furnished: furnishedfromURL === "true" ? true : false,
        parking: parkingfromURL === "true" ? true : false,
        sort: sortfromURL || "createdAt",
        order: orderfromURL || -1,
      });
    }
    const fetch_data = async () => {
      setLoading(true);
      const searchParams = urlParams.toString();
      try {
        const response = await axios.get(
          `${api}/listings/search/get?${searchParams}`
        );
        setListing(response.data);
        response.data.length > 8 ? setshowmore(true) : setshowmore(false);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetch_data();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sell"
    ) {
      setsidebarData({ ...sidebarData, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setsidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "offer" ||
      e.target.id === "furnished"
    ) {
      setsidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort =
        e.target.value.split("_")[0] === "regular"
          ? e.target.value.split("_")[0] + "_" + e.target.value.split("_")[1]
          : "createdAt";
      const order = e.target.value.split("_")[2] === "asc" ? 1 : -1 || 1;

      setsidebarData({ ...sidebarData, sort, order });
    }
  };
  const handle_Submit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const onShowMore = async () => {
    const NumberofListings = Listing.length;
    const startIndex = NumberofListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const response = await axios.get(
      `${api}/listings/search/get?${searchQuery}`
    );
    const data = response.data;
    if (data.length < 9) {
      setshowmore(false);
    }
    setListing([...Listing, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row mt-20">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handle_Submit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-bold">Search Term :</label>
            <input
              type="text"
              placeholder="Search"
              className="rounded-lg p-3 border w-full"
              id="searchTerm"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <label className="font-bold">Type : </label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="all"
                checked={sidebarData.type === "all"}
                onChange={handleChange}
              />
              <span>Rent & Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="rent"
                checked={sidebarData.type === "rent"}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="sell"
                onChange={handleChange}
                checked={sidebarData.type === "sell"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="offer"
                onChange={handleChange}
                checked={sidebarData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <label className="font-bold">Amenities :</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="parking"
                onChange={handleChange}
                checked={sidebarData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="furnished"
                onChange={handleChange}
                checked={sidebarData.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-bold">Sort :</label>
            <select
              onChange={handleChange}
              defaultValue="created_At_desc"
              id="sort_order"
              className="p-3 border rounded-lg"
            >
              <option value="regular_price_desc">Price high to low</option>
              <option value="regular_price_asc">Price low to high</option>
              <option value="created_At_desc">Latest</option>
              <option value="created_At_asc">Oldest</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-slate-700 p-3 text-white rounded-lg uppercase hover:opacity-80"
          >
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold text-slate-700 p-3 border-b m-5">
          Listing Results :
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!Loading && Listing.length === 0 && (
            <p className="text-xl text-slate-700">No Listings Found</p>
          )}
          {Loading && (
            <div className="w-full flex justify-center">
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
          {!Loading &&
            Listing &&
            Listing.map((listing, index) => (
              <ListingItem key={index} listing={listing} />
            ))}
          {showmore && (
            <button
              className="p-7 w-full text-center text-green-600 hover:underline"
              onClick={onShowMore}
            >
              Show More...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
