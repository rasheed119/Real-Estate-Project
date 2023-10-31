import express from "express";
import ListingModel from "../Model/Listings.js";
import Verifytoken from "../Authentication/auth.js";

const router = express.Router();

router.post("/create_listing", Verifytoken, async (req, res) => {
  try {
    const listings = await ListingModel.create(req.body);
    console.log(req.user);
    res.status(200).json({ message: "Listings Added", listings });
  } catch (error) {
    console.log(error);
  }
});

router.get("/getlisting/:id", Verifytoken, async (req, res) => {
  if (req.user._id !== req.params.id) {
    return res
      .status(500)
      .json({ Error: "You can see only your own listings" });
  } else {
    try {
      const find_listing = await ListingModel.find({
        userRef: req.params.id,
      });
      res.status(200).json(find_listing);
    } catch (error) {
      console.log(error.message);
    }
  }
});

//Update Listing
router.put("/update_listing/:_id", Verifytoken, async (req, res) => {
  try {
    const Find_Listings = await ListingModel.findById({ _id: req.params._id });
    if (!Find_Listings) {
      return res.status(500).json({ Error: "Listing Not Found" });
    }
    const Update_listing = await ListingModel.findByIdAndUpdate(
      req.params._id,
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Update Successfull", updated_listing: Update_listing });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ Error: `${error.message}` });
  }
});

//Get a Specific listing
router.get("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const listing = await ListingModel.findById(_id);
    res.status(200).json({ message: "Listing Fetched Successfully", listing });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ Error: `${error.message}` });
  }
});

router.delete("/:_id", Verifytoken, async (req, res) => {
  try {
    const { _id } = req.params;
    await ListingModel.findByIdAndDelete(_id);
    res.status(200).json({ message: "Listing Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ Error: `${error.message}` });
  }
});

router.get("/search/get", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }
    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sell", "rent"] };
    }
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";

    const order = req.query.order || -1;

    const listings = await ListingModel.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({
        [sort]: order,
      })
      .limit(limit)
      .skip(startIndex);
    res.status(200).json(listings);
  } catch (error) {
    console.log(error.message);
    res.status(456).json({ message: `Error ${error.message}` });
  }
});

export { router as Listing_Router };
