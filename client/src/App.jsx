import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";
import About from "./Pages/About";
import Header from "./Components/Header";
import { BrowserRouter as Router } from "react-router-dom";
import PrivateRoute from "./Components/PrivateRoute";
import CreateListings from "./Pages/CreateListings";
import UpdateListing from "./Pages/UpdateListing";
import Listings from "./Pages/Listings";
import Search from "./Pages/Search";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Signup" element={<Signup />} />
        <Route element={<PrivateRoute />}>
          <Route path="/Profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListings />} />
          <Route path="/update-listing/:_id" element={<UpdateListing />} />
        </Route>
        <Route path="/About" element={<About />} />
        <Route path="/listing/:_id" element={<Listings />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
