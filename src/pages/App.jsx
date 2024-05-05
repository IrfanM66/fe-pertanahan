import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Login } from "../utils/FetchUsers";
import UseInput from "../hooks/UseInput.js";
import { FaEye, FaEyeSlash, FaHeadSideCough, FaShower } from "react-icons/fa";

function App() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [email, setEmail] = UseInput("");
  const [password, setPassword] = UseInput("");
  const [errEmail, setErrEmail] = useState(true);
  const [errPassword, setErrPassword] = useState(true);
  const handlerLogin = (event) => {
    event.preventDefault();
    Login(email, password).then((res) => {
      if (!res.status) {
        setMessage("email atau password salah");
      } else {
        localStorage.setItem("token", res.token);
        navigate("/dashboard");
      }
    });
  };

  const handleShowPassword = (e) => {
    e.preventDefault();
    if (e.key !== "Enter") {
      setPasswordType((prevType) =>
        prevType === "password" ? "text" : "password"
      );
    }
  };

  const emailRef = useRef(null);
  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length == 0) {
      setErrEmail(true);
    } else if (!emailRegex.test(email)) {
      setErrEmail("Email yang anda masukkan tidak valid");
    } else {
      setErrEmail(true);
    }
  }, [email]);

  useEffect(() => {
    if (password.length == 0) {
      setErrPassword(true);
    } else if (password.length < 8) {
      setErrPassword("Password yang anda masukkan kurang dari 8 karakter");
    } else {
      setErrPassword(true);
    }
  }, [password]);

  return (
    <div className="grid h-screen">
      <div className="grid grid-flow-col grid-cols-2 m-5">
        <div className="grid justify-items-center items-center bg-secondary rounded-lg">
          <div className="grid justify-items-center w-10/12 gap-5">
            <div className="grid justify-items-center w-11/12 gap-5">
              <img
                src="logo.png"
                alt=""
                className="flex justify-content-center pr-8"
              />
            </div>
          </div>
        </div>
        <div className="grid items-center justify-items-center">
          <form
            onSubmit={handlerLogin}
            className="w-7/12 grid gap-4 px-10 py-3 rounded-md relative"
          >
            <h2 className="text-3xl m-0 font-bold text-start text-primary">
              Selamat Datang!
            </h2>
            <p className="text-start m-0 font-medium text-quaternary">
              Login terlebih dahulu untuk mengakses halaman Admin
            </p>
            <div className="relative">
              <input
                ref={emailRef}
                type="text"
                placeholder="Email"
                className="form-input px-4 py-3 w-full rounded-lg border-2  border-secondary"
                id="email"
                value={email}
                onChange={setEmail}
              />
              <p className="text-red-500 text-xs absolute right-0">
                {errEmail == true ? null : errEmail}
              </p>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="form-input px-4 py-3 w-full rounded-lg border-2 border-secondary"
                id="passwordType"
                value={password}
                onChange={setPassword}
              />
              <p className="text-red-500 text-xs absolute right-0">
                {password == true ? null : errPassword}
              </p>
            </div>
            <button
              type="submit"
              className="bg-secondary rounded-lg w-full justify-self-center h-10 font-semibold text-white font-sans mt-3"
            >
              Login
            </button>
            <p className="text-red-500 font-normal absolute top-full left-1/2 text-center -translate-x-1/2">
              {message}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
