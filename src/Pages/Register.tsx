import { JSX, useState } from "react";
import { countryOptions } from "./Login";
import { Link, useNavigate } from "react-router-dom";
import Select, { SingleValue } from "react-select";
import APIClientPrivate from "../utils/api";
import { useFormik } from "formik";
import * as Yup from "yup";

type Props = {};
type CountryOption = {
  value: string;
  label: JSX.Element;
};

export default function Register({}: Props) {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
    countryOptions[0]
  );

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobileNo: Yup.string()
      .matches(/^\d+$/, "Mobile number must be numeric")
      .required("Mobile number is required"),
    status: Yup.string().required("Status is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobileNo: "",
      status: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await APIClientPrivate.post(
          "/api/auth/register",
          values
        );
        console.log("Registration successful:", response);
        navigate("/login");
      } catch (error) {
        console.error("Registration error:", error);
        alert("Error registering user.");
      }
    },
  });

  return (
    <div className="w-full flex-1 flex-col flex justify-center items-center ">
      <div className="relative inline-block text-[31px] font-bold">
        <h1 className="relative z-50">Register</h1>
        <span className="absolute left-0 bottom-1 w-full h-2 bg-[#fac166] z-0"></span>
      </div>

      <form
        className="p-4 flex flex-col shadow-lg"
        onSubmit={formik.handleSubmit}
      >
        <label className="text-[18px] font-bold mt-1">Full Name</label>
        <input
          type="text"
          className="flex-1 p-2 outline-none text-gray-700 border-2 border-[#c4c4c4] rounded-md mt-1 "
          placeholder="Enter your name"
          {...formik.getFieldProps("name")}
        />
        {formik.touched.name && formik.errors.name && (
          <small className="text-red-500">{formik.errors.name}</small>
        )}

        <label className="text-[18px] font-bold mt-1">Email</label>
        <input
          type="text"
          className="flex-1 p-2 outline-none text-gray-700 border-2 border-[#c4c4c4] rounded-md mt-1 "
          placeholder="Enter your email"
          {...formik.getFieldProps("email")}
        />
        {formik.touched.email && formik.errors.email && (
          <small className="text-red-500">{formik.errors.email}</small>
        )}

        <label className="text-[18px] font-semibold mt-1">Mobile Number</label>
        <div className="flex gap-2 flex-row">
          <Select
            options={countryOptions}
            value={selectedCountry}
            onChange={(newValue: SingleValue<CountryOption>) =>
              setSelectedCountry(newValue)
            }
            className="md:w-[110px] w-[75px] text-gray-800 border-2 border-[#c4c4c4] rounded-md "
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

          <input
            type="tel"
            placeholder="Enter your phone number"
            className="p-2 md:pl-10 outline-none text-gray-700 border-2 border-[#c4c4c4] rounded-md "
            {...formik.getFieldProps("mobileNo")}
          />
        </div>
        {formik.touched.mobileNo && formik.errors.mobileNo && (
          <small className="text-red-500">{formik.errors.mobileNo}</small>
        )}

        <label className="text-[18px] font-bold mt-1">Current Status</label>
        <div className="flex gap-4 items-center">
          {["student", "employee"].map((status) => (
            <label
              key={status}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="status"
                value={status}
                className="hidden"
                checked={formik.values.status === status}
                onChange={formik.handleChange}
              />
              <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    formik.values.status === status
                      ? "bg-[#2A586F]"
                      : "bg-gray-400"
                  }`}
                ></div>
              </div>
              <span className="text-black capitalize">{status}</span>
            </label>
          ))}
        </div>
        {formik.touched.status && formik.errors.status && (
          <small className="text-red-500">{formik.errors.status}</small>
        )}

        <label className="text-[18px] font-bold mt-1">Password</label>
        <input
          type="password"
          className="flex-1 p-2 outline-none text-gray-700 border-2 border-[#c4c4c4] rounded-md "
          placeholder="Enter Password"
          {...formik.getFieldProps("password")}
        />
        {formik.touched.password && formik.errors.password && (
          <small className="text-red-500 text-sm ">
            {formik.errors.password}
          </small>
        )}

        <button className="mt-4 py-2 font-semibold text-[14px] bg-[#2A586F] text-white border-2 border-[#2A586F] hover:bg-transparent hover:text-[#2A586F] rounded-md">
          Save
        </button>
        <small className="text-center mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login Now
          </Link>
        </small>
      </form>
    </div>
  );
}
