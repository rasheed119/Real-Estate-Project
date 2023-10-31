import { Link } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";
import {
  signinStart,
  signInSuccess,
  signInFailure,
} from "../Redux/user/UserSlice";
import OAuth from "../Components/OAuth";
import { api } from "../Config/Config";

const sign_in_validation_schema = yup.object().shape({
  password: yup
    .string()
    .required("Password is Required")
    .min(8, "Must Require 8 Characters"),
  email: yup.string().email("Invalid Email").required("Email is Required"),
});

function Signin() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user.user);

  const [, SetCookie] = useCookies(["access_token"]);
  const name = "Sign In"

  const navigate = useNavigate();

  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        password: "",
        email: "",
      },
      validationSchema: sign_in_validation_schema,
      onSubmit: async (value) => {
        dispatch(signinStart());
        try {
          const response = await axios.post(
            `${api}/user/signin`,
            value
          );
          const data = response.data;
          SetCookie("access_token", data.token);
          dispatch(signInSuccess(data));
          toast.success("Login Successfull, Redirecting to Home Page", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          value.email = "";
          value.password = "";
          setTimeout(() => {
            navigate("/");
          }, 5000);
        } catch (error) {
          dispatch(signInFailure(error.response.data.Error));
          toast.error(error.response.data.Error, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      },
    });

  return (
    <div className="p-3 max-w-lg mt-20 mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          name="email"
          id="email"
        />
        {errors.email && touched.email ? (
          <p className="text-red-500 text-xs italic">{errors.email}</p>
        ) : (
          ""
        )}
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          name="password"
          id="password"
        />
        {errors.password && touched.password ? (
          <p className="text-red-500 text-xs italic">{errors.password}</p>
        ) : (
          ""
        )}
        {loading ? (
          <button
            disabled
            type="button"
            className="bg-slate-700 p-3 text-white rounded-lg uppercase"
          >
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#1C64F2"
              />
            </svg>
            Loading...
          </button>
        ) : (
          <button
            className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-50 uppercase"
            type="submit"
          >
            Sign In
          </button>
        )}
        <OAuth name={name} />
      </form>
      <div className="flex gap-1 mt-5">
        <p>Dont have an acount?</p>
        <Link to={"/Signup"}>
          <span className="text-blue-700">Sign-up</span>
        </Link>
      </div>
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

export default Signin;
