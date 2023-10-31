import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function Header() {
  const { currentUser } = useSelector((state) => state.user.user);
  const [searchParams, setsearchParams] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchParams);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromURL = urlParams.get("searchTerm");
    if(searchTermFromURL){
      setsearchParams(searchTermFromURL);
    }
  },[location.search])
  return (
    <header className="bg-slate-200 shadow-md fixed w-full top-0 z-50">
      <div className="flex justify-between items-center mx-auto max-w-7xl p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Rasheed</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchParams}
            onChange={(e) => setsearchParams(e.target.value)}
            className="bg-transparent focus:outline-none w-24 sm:w-64 "
          />
          <button type="submit">
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/About">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>

          {currentUser ? (
            <Link to="/Profile">
              {" "}
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt={currentUser.username}
              />{" "}
            </Link>
          ) : (
            <Link to="/Signin">
              <li className="hidden sm:inline text-slate-700 hover:underline">
                Sign-in
              </li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
