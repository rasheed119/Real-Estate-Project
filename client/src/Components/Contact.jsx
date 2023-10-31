import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { api } from "../Config/Config";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";

const message_validation_schema = yup.object().shape({
  message: yup
    .string()
    .min(25, "Message must be at least 25 characters")
    .required("Message is Required"),
});

function Contact({ listing }) {
  const [landlord, setlandlord] = useState(null);
  const { currentUser } = useSelector((state) => state.user.user);
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const response = await axios.get(`${api}/user/${listing.userRef}`, {
          headers: {
            access_token: currentUser.token,
          },
        });
        setlandlord(response.data.User);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, []);
  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        message: "",
      },
      validationSchema: message_validation_schema,
      onSubmit: (data) => {
        window.location = `mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${data.message}`;
      },
    });
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-3">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for <span className="font-semibold">{listing.name}</span>
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
              name="message"
              id="message"
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              rows="2"
              placeholder="Enter the message here..."
              className="w-full rounded-lg p-3 border"
            />
            {errors.message && touched.message && (
              <p className="text-red-700 font-semibold italic">
                {errors.message}
              </p>
            )}
            <button
              className="text-center w-full bg-slate-700 p-3 hover:opacity-80 text-white uppercase rounded-lg"
              type="submit"
            >
              Send Message
            </button>
          </form>
        </div>
      )}
    </>
  );
}

Contact.propTypes = {
  listing: PropTypes.object,
};

export default Contact;
