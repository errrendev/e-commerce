import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });
      if (res.data.success) {
        setToken(res.data.token);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4 md:gap-10 bg-white shadow-md px-5 py-10 w-[80%] md:w-[30%] rounded-lg ">
        <h1 className="text-4xl font-semibold text- uppercase text-neutral-800 text-center">
          Admin panel
        </h1>
        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-neutral-800">Email</p>
            <input
              className="outline-none border border-gray-400 px-4 py-2 rounded"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            ></input>
          </div>
          <div className="flex flex-col gap-1">
            <p>Password</p>
            <input
              className="outline-none border border-gray-400 px-4 py-2 rounded"
              type="password"
              placeholder="enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            ></input>
          </div>
          <button
            type="submit"
            className="font-semibold px-6 py-2 rounded bg-neutral-800 text-white my-3 cursor-pointer hover:bg-black"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
