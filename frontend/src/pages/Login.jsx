import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { shopContext } from "../context/ShopContext";
import { useEffect } from "react";

const Login = () => {
  const {token, setToken, backend_url} = useContext(shopContext)
  const navigate = useNavigate()
  const [currentState, setCurrentState] = useState("Log in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentState === "Log in") {
      await logIn();
    } else {
      await signUp();
    }  
  };
  const logIn = async () => {
    try {
      const res = await axios.post(backend_url + "/api/user/login", {
        email,
        password,
      });
      if (res.data.success) {
        setToken(res.data.token)
        localStorage.setItem('token', res.data.token)
        toast.success("Logged in Successfully");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const signUp = async () => {
    try {
      const res = await axios.post(backend_url + "/api/user/register", {
        name,
        email,
        password,
      });
      if (res.data.success) {
        setToken(res.data.token)
        localStorage.setItem('token', res.data.token)
        toast.success("Registered successfully");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if(token){
      navigate('/')
    }
  }, [token])
  

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mt-10 mb-2">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800"></hr>
      </div>
      <input
        onChange={(e) => {
          setName(e.target.value);
        }}
        value={name}
       
        className={`w-full px-3 py-2 border border-gray-800 ${
          currentState === "Log in" ? "hidden" : ""
        }`}
        type="text"
        placeholder="Name"
      ></input>
      <input
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        value={email}
        required
        className="w-full px-3 py-2 border border-gray-800"
        type="email"
        placeholder="Email"
      ></input>
      <input
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        value={password}
        required
        className="w-full px-3 py-2 border border-gray-800"
        type="password"
        placeholder="Password"
      ></input>
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot Your password?</p>
        {currentState === "Log in" ? (
          <p
            onClick={() => {
              setCurrentState("Sign up");
            }}
            className="cursor-pointer"
          >
            Create new account
          </p>
        ) : (
          <p
            onClick={() => {
              setCurrentState("Log in");
            }}
            className="cursor-pointer"
          >
            Log in
          </p>
        )}
      </div>
      <button type="submit" className="w-full bg-black text-white font-medium py-2 rounded cursor-pointer">
        {currentState === "Log in" ? "Log in" : "Sign up"}
      </button>
    </form>
  );
};

export default Login;
