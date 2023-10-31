import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState, Fragment } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import {
  successUpdate,
  updateStart,
  updateFailure,
  signout,
  signoutStart,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../Redux/user/UserSlice";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import showToast from "../Components/toast";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { api } from "../Config/Config";

const profile_validation_schema = yup.object().shape({
  username: yup.string().min(8, "Minimum 8 Characters is Required"),
  email: yup.string().email("Must be an Valid Email"),
  password: yup.string().min(8, "Minimum 8 Characters is required"),
});

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading } = useSelector((state) => state.user.user);
  const [, setCookie] = useCookies(["access_token"]);
  const file_ref = useRef(null);
  const [file, setfile] = useState(undefined);
  const [filePerc, setfilePerc] = useState(0);
  const [File_Upload_Error, Set_File_Upload_Error] = useState(false);
  const [firebase_avatar, set_firebase_avatar] = useState();
  const [open, setOpen] = useState(false);
  const [Listings, setListings] = useState([]);
  const [error, seterror] = useState(null);
  const [tooglelistins, SetTooglelistings] = useState(false);
  const cancelButtonRef = useRef(null);
  useEffect(() => {
    if (file) {
      handleFileupload(file);
    }
  }, [file]);
  const handleFileupload = (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);
    const upLoadTask = uploadBytesResumable(storageRef, file);
    upLoadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setfilePerc(Math.round(progress));
      },
      (error) => {
        Set_File_Upload_Error(true);
        console.log(error);
      },
      () => {
        Set_File_Upload_Error(false);
        getDownloadURL(upLoadTask.snapshot.ref).then((downloadedUrl) => {
          set_firebase_avatar(downloadedUrl);
        });
      }
    );
  };
  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        username: currentUser.username,
        password: "",
        email: currentUser.email,
      },
      validationSchema: profile_validation_schema,
      onSubmit: async (value) => {
        dispatch(updateStart());
        try {
          const res = await axios.put(
            `http://localhost:9000/user/updateuser/${currentUser._id}`,
            { ...value, avatar: firebase_avatar },
            {
              headers: {
                access_token: currentUser.token,
              },
            }
          );
          dispatch(successUpdate(res.data.data));
          showToast("Update Success", "success");
        } catch (error) {
          dispatch(updateFailure(error.response.data.Error));
          showToast(error.response.data.Error, "error");
        }
      },
    });
  const handle_signout = () => {
    dispatch(signoutStart());
    setCookie("access_token", "");
    navigate("/Signin");
    dispatch(signout());
  };
  const delete_user = async () => {
    dispatch(deleteUserStart());
    try {
      const response = await axios.delete(
        `${api}/user/delete/${currentUser._id}`,
        {
          headers: {
            access_token: currentUser.token,
          },
        }
      );
      const data = response.data.message;
      dispatch(deleteUserSuccess());
      showToast(data, "success");
      setTimeout(() => {
        navigate("/Signin");
      }, 4000);
    } catch (error) {
      dispatch(deleteUserFailure(error.response.data.Error));
      showToast(error.response.data.Error, "error");
    }
  };
  const handleToogle = () => {
    SetTooglelistings(!tooglelistins);
    if (!tooglelistins) {
      handleShowListings();
    }
  };
  const handleShowListings = async () => {
    try {
      seterror(null);
      const response = await axios.get(
        `${api}/listings/getlisting/${currentUser._id}`,
        {
          headers: {
            access_token: currentUser.token,
          },
        }
      );
      setListings(response.data);
    } catch (error) {
      seterror(error.response.data.Error);
    }
  };
  const delete_Listing = async (_id) => {
    try {
      await axios.delete(`${api}/listings/${_id}`, {
        headers: {
          access_token: currentUser.token,
        },
      });
      showToast("Listing Deleted Successfully", "success");
      const removelist = Listings.filter((listing) => listing._id !== _id);
      setListings(removelist);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto mt-20">
      <h1 className="text-center my-7 font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="self-center relative">
          <a
            href={firebase_avatar || currentUser.avatar}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={firebase_avatar || currentUser.avatar}
              className="rounded-full h-24 w-24 object-cover  mt-2"
            />
          </a>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="absolute left-16 top-24  transform -translate-y-1/2 w-7 h-7 bg-red-400 border-2  dark:border-gray-800 rounded-full cursor-pointer"
            onClick={() => file_ref.current.click()}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-center">
          {File_Upload_Error ? (
            <span className="text-red-700">
              Error while Uploading Image(Image must be below 2mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">
              {`Uploading Image... ${filePerc}%`}
            </span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">
              Image Successfully Uploaded !
            </span>
          ) : (
            ""
          )}
        </p>
        <input
          type="file"
          onChange={(e) => setfile(e.target.files[0])}
          ref={file_ref}
          hidden
          accept="image/*"
        />
        <input
          placeholder="Username"
          type="text"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          name="username"
          className="p-3 rounded-lg border"
        />
        {errors.username && touched.username ? (
          <p className="text-red-500 text-xs italic">{errors.email}</p>
        ) : (
          ""
        )}
        <input
          placeholder="Email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          name="email"
          className="p-3 rounded-lg border"
        />
        {errors.email && touched.email ? (
          <p className="text-red-500 text-xs italic">{errors.email}</p>
        ) : (
          ""
        )}
        <input
          placeholder="Password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          name="password"
          className="p-3 rounded-lg border"
        />
        {errors.password && touched.password ? (
          <p className="text-red-500 text-xs italic">{errors.password}</p>
        ) : (
          ""
        )}
        <button
          disabled={loading}
          className="bg-slate-700 rounded-lg p-3 text-white uppercase disabled:opacity-50 hover:opacity-90"
        >
          {!loading ? "update" : "Loading..."}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-70"
        >
          Create Listing
        </Link>
      </form>
      <div className="mt-5 flex justify-between ">
        <span
          className="text-red-600 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          Delete Account
        </span>
        <span
          onClick={() => handle_signout()}
          className="text-red-600 cursor-pointer"
        >
          Sign Out
        </span>
      </div>
      {error ? <p className="text-red-700">{error}</p> : ""}
      <div className="flex justify-center mt-3">
        <button onClick={handleToogle}>
          {tooglelistins ? (
            <span className="text-red-700 uppercase">Hide Listings</span>
          ) : (
            <span className="text-green-700 uppercase">Show Listings</span>
          )}
        </button>
      </div>
      {Listings && Listings.length > 0 && (
        <div
          className={`flex flex-col gap-4 ${tooglelistins ? "show" : "hidden"}`}
        >
          <h1 className="text-center font-semibold text-2xl mt-7">
            Your listings
          </h1>
          {Listings.map((listings, index) => (
            <div
              key={index}
              className="flex justify-between items-center border p-3 gap-3"
            >
              <Link
                to={`/listing/${listings._id}`}
                className="flex items-center gap-2"
              >
                <img
                  src={listings.imageurls}
                  alt={listings.name}
                  className="h-16 w-18 object-contain"
                />
                <p className="text-slate-700 font-semibold hover:underline truncate flex-1">
                  {listings.name}
                </p>
              </Link>

              <div className="flex flex-col p-2">
                <button
                  className="uppercase text-red-700"
                  onClick={() => delete_Listing(listings._id)}
                >
                  Delete
                </button>
                <button
                  className="uppercase text-green-700"
                  onClick={() => navigate(`/update-listing/${listings._id}`)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Delete account
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to delete your account? All of
                            your data will be permanently removed. This action
                            cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => delete_user()}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

export default Profile;
