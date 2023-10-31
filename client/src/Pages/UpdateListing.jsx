import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  ImageUploadSuccess,
  ImageuploadStart,
  ImageUploadError,
} from "../Redux/user/UserSlice";
import axios from "axios";
import { api } from "../Config/Config";
import { useSelector } from "react-redux";
import showToast from "../Components/toast";
import { ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

function CreateListings() {
  const [file, setfile] = useState([]);
  const [formLoading, SetformLoading] = useState(false);
  const [loading, setloading] = useState(false);
  const [file_percentage, set_filepercentage] = useState(0);
  const [UploadImageError, setUploadImageError] = useState(null);
  const [error, seterror] = useState(null);
  const { currentUser } = useSelector((state) => state.user.user);
  const [FormData, setFormData] = useState({
    imageurls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedroom: 1,
    bathroom: 1,
    regular_price: 50,
    discounted_price: 0,
    offer: false,
    parking: false,
    furnished: false,
    userRef: currentUser._id,
  });
  const { _id } = useParams();
  useEffect(() => {
    const fetch_data = async () => {
      try {
        const response = await axios.get(`${api}/listings/${_id}`);
        setFormData(response.data.listing);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetch_data();
  }, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleImageSubmit = () => {
    setloading(true);
    dispatch(ImageuploadStart());
    if (file.length > 0 && file.length + FormData.imageurls.length <= 6) {
      const promise = [];
      for (let i = 0; i < file.length; i++) {
        promise.push(storeImage(file[i], i + 1));
      }
      Promise.all(promise)
        .then((urls) => {
          setFormData({
            ...FormData,
            imageurls: FormData.imageurls.concat(urls),
          });
          setloading(false);
          setUploadImageError(false);
        })
        .catch(() => {
          setloading(false);
          setUploadImageError(
            "Image Shhould be below 2mb each ( max 6 images )"
          );
        });
      dispatch(ImageUploadSuccess());
    } else if (file.length === 0) {
      setloading(false);
      dispatch(
        ImageUploadError("No Images Selected, Please Select an Image to Upload")
      );
      setUploadImageError(
        "No Images Selected, Please Select an Image to Upload"
      );
    } else {
      setloading(false);
      dispatch(ImageUploadError("You Can Upload max 6 Images Per Listing"));
      setUploadImageError("You Can Upload max 6 Images Per Listing");
    }
  };
  const storeImage = async (files) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const filename = new Date().getTime() + files.name;
      const storageref = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageref, files);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          set_filepercentage(Math.round(percentage));
        },
        (error) => {
          dispatch(ImageUploadError(error.message));
          reject(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadedURL) => {
            resolve(downloadedURL);
          });
        }
      );
      set_filepercentage(0);
    });
  };
  const handleImageDelete = (index, imageURL) => {
    try {
      setFormData({
        ...FormData,
        imageurls: FormData.imageurls.filter((url, i) => i !== index),
      });
      const storage = getStorage(app);
      const storeref = ref(storage, imageURL);
      deleteObject(storeref);
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleChange = (e) => {
    if (e.target.name === "sell" || e.target.name === "rent") {
      setFormData({
        ...FormData,
        type: e.target.name,
      });
    }
    if (
      e.target.name === "furnished" ||
      e.target.name === "parking" ||
      e.target.name === "offer"
    ) {
      setFormData({
        ...FormData,
        [e.target.name]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...FormData,
        [e.target.name]: e.target.value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (FormData.imageurls.length === 0) {
      seterror("You Need An Image To  Upload an Listing");
    } else if (FormData.regular_price < FormData.discounted_price) {
      seterror("Discounted Price must be Lesss than Regular Price");
    } else {
      try {
        SetformLoading(true);
        seterror(null);
        await axios.put(`${api}/listings/update_listing/${_id}`, FormData, {
          headers: {
            access_token: currentUser.token,
          },
        });
        showToast("Listing Updated Successfully", "success");
        setFormData({
          imageurls: [],
          name: "",
          description: "",
          address: "",
          type: "rent",
          bedroom: 1,
          bathroom: 1,
          regular_price: 50,
          discounted_price: 50,
          offer: false,
          parking: false,
          furnished: false,
          userRef: currentUser._id,
        });
        seterror(null);
        setfile([]);
        setTimeout(() => {
          navigate(`/listing/${_id}`);
        }, 5000);
      } catch (error) {
        SetformLoading(false);
        showToast(error.response.data.Error, "error");
      }
    }
  };
  return (
    <div className="max-w-4xl mt-20 mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-col gap-4 flex-1">
          <input
            placeholder="Name"
            className="p-3 rounded-lg border"
            type="text"
            name="name"
            required
            min="8"
            max="62"
            value={FormData.name}
            onChange={handleChange}
          />
          <textarea
            placeholder="Description"
            className="p-3 rounded-lg border"
            name="description"
            required
            value={FormData.description}
            onChange={handleChange}
          ></textarea>
          <input
            placeholder="Address"
            className="p-3 rounded-lg border"
            type="text"
            name="address"
            required
            value={FormData.address}
            onChange={handleChange}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="sell"
                className="w-5"
                checked={FormData.type === "sell"}
                onChange={handleChange}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="rent"
                className="w-5"
                checked={FormData.type === "rent"}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="parking"
                className="w-5"
                onChange={handleChange}
                checked={FormData.parking}
              />
              <span>Parking Lot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="furnished"
                className="w-5"
                checked={FormData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="offer"
                className="w-5"
                onChange={handleChange}
                checked={FormData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-row gap-3 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                name="bedroom"
                min={"1"}
                max={"10"}
                value={FormData.bedroom}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg  p-3 w-20"
              />
              <span>Beds</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                name="bathroom"
                className="border border-gray-200 rounded-lg  p-3 w-20"
                onChange={handleChange}
                value={FormData.bathroom}
              />
              <span>Bathrooms</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                name="regular_price"
                min="50"
                max="100000"
                onChange={handleChange}
                value={FormData.regular_price}
                className="border border-gray-200 rounded-lg  p-3 w-20"
              />
              <div className="flex flex-col text-center">
                <span>Regular Price</span>
                <span className="text-xs">( $ / months )</span>
              </div>
            </div>
            {FormData.offer && (
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  name="discounted_price"
                  value={FormData.discounted_price}
                  onChange={handleChange}
                  min="0"
                  max="100000"
                  className="border border-gray-200 rounded-lg  p-3 w-20"
                />
                <div className="flex flex-col text-center">
                  <span>Discounted Price</span>
                  <span className="text-xs">( $ / months )</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Image :
            <span className="font-normal">
              The First Image will be the Cover ( max 6 )
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setfile(e.target.files)}
              type="file"
              multiple
              accept="image/*"
              className="p-3 border border-gray-600 w-full"
            />
            <button
              type="button"
              onClick={() => handleImageSubmit()}
              className="p-3 border border-green-700 text-green-700 rounded-lg uppercase hover:shadow-lg disabled:opacity-80"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {UploadImageError ? (
            <p className="text-red-700 font-bold">{UploadImageError}</p>
          ) : file_percentage > 0 && file_percentage < 100 ? (
            <p className="text-green-700">
              Uploading Image {file_percentage}%...
            </p>
          ) : file_percentage === 100 ? (
            <p className="text-green-700">Image Upload Succesfull</p>
          ) : (
            ""
          )}
          {error ? <p className="text-red-700 font-bold">{error}</p> : ""}
          {FormData.imageurls.length > 0
            ? FormData.imageurls.map((imageURL, index) => (
                <div
                  key={index}
                  className="flex justify-between border p-3 border-slate-500 rounded-lg items-center"
                >
                  <img src={imageURL} alt="Listings" className="w-20" />
                  <div>
                    <button
                      type="button"
                      className="p-3 bg-red-700 text-white uppercase rounded-lg hover:opacity-60"
                      onClick={() => handleImageDelete(index, imageURL)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            : ""}
          <button
            disabled={loading || formLoading}
            type="submit"
            className="p-3 bg-slate-700 text-white uppercase rounded-lg disabled:opacity-60 hover:opacity-90"
          >
            Update Listing
          </button>
        </div>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default CreateListings;
