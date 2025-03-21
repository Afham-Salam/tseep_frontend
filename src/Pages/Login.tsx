import { JSX, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select, { SingleValue } from "react-select";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import APIClientPrivate from "../utils/api";

type CountryOption = {
  value: string;
  label: JSX.Element;
};

export const countryOptions: CountryOption[] = [
  {
    value: "IN",
    label: (
      <div className="flex items-center gap-1">
        <img
          src="https://flagcdn.com/w40/in.png"
          alt="India Flag"
          className="w-6 h-4 rounded-sm"
        />
        <span>+91</span>
      </div>
    ),
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
    countryOptions[0]
  );

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    mobileNo: Yup.string()
      .matches(/^[0-9]{10}$/, "Invalid mobile number")
      .required("Mobile number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  return (
    <div className="w-full flex-1 flex-col flex justify-center items-center gap-10">
      <div className="relative inline-block text-[31px] font-semibold text-[#2A586F]">
        <h1 className="relative z-50">Login</h1>
        <span className="absolute left-0 bottom-1 w-full h-2 bg-[#fac166] z-0"></span>
      </div>

      <Formik
        initialValues={{ mobileNo: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await APIClientPrivate.post(
              "/api/auth/login",
              values
            );
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("UserID", response.data.user._id);
            navigate("/question");
          } catch (error) {
            console.error("Login error:", error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="p-5 flex flex-col shadow-lg">
            {/* Mobile Number */}
            <label className="text-[18px] font-bold">Mobile Number</label>
            <div className="flex gap-2 flex-row">
              <Select
                options={countryOptions}
                value={selectedCountry}
                onChange={(newValue: SingleValue<CountryOption>) =>
                  setSelectedCountry(newValue)
                }
                className="md:w-[110px] w-[75px] text-gray-800 border-2 border-[#c4c4c4] rounded-md mt-2 h-fit"
                isSearchable={false}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: "none",
                    boxShadow: "none",
                    backgroundColor: "transparent",
                  }),
                  indicatorSeparator: () => ({ display: "none" }),
                  dropdownIndicator: (provided) => ({
                    ...provided,
                    padding: "2px",
                  }),
                }}
              />

              <div className="flex flex-col">
                <Field
                  type="tel"
                  name="mobileNo"
                  placeholder="Enter your phone number"
                  className="p-2 md:pl-10 outline-none text-gray-700 border-2 border-[#c4c4c4] rounded-md mt-2"
                />
                <ErrorMessage
                  name="mobileNo"
                  component="small"
                  className="text-red-500"
                />
              </div>
            </div>

            {/* Password */}
            <label className="text-[18px] font-bold mt-4">Password</label>
            <Field
              type="password"
              name="password"
              placeholder="Enter Password"
              className="flex-1 p-2 outline-none text-gray-700 border-2 border-[#c4c4c4] rounded-md mt-2"
            />
            <ErrorMessage
              name="password"
              component="small"
              className="text-red-500"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 cursor-pointer py-2 font-semibold text-[14px] bg-[#2A586F] text-white border-2 border-[#2A586F] hover:bg-transparent hover:text-[#2A586F] rounded-md"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            <small className="text-center mt-5">
              Don't have an account?{" "}
              <Link to={"/register"} className="text-blue-600">
                Register Now
              </Link>
            </small>
          </Form>
        )}
      </Formik>
    </div>
  );
}
