import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Login } from "../utils/FetchUsers";
import UseInput from "../hooks/UseInput.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetProfile } from "../utils/FetchUsers";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoginBackground from "../assets/bg-papuma.jpg";

function App() {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [email, setEmail] = UseInput("");
  const [password, setPassword] = UseInput("");
  const [errEmail, setErrEmail] = useState(true);
  const [errPassword, setErrPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handlerLogin = (event) => {
    event.preventDefault();
    Login(email, password).then((res) => {
      if (!res.status) {
        toast.error("Login gagal", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      } else {
        sessionStorage.setItem("token", res.token);
        toast.success("Berhasil login", {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
        GetProfile().then((res) => setAuth(res.data));
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    });
  };

  const emailRef = useRef(null);
  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length === 0) {
      setErrEmail(true);
    } else if (!emailRegex.test(email)) {
      setErrEmail("Email yang anda masukkan tidak valid");
    } else {
      setErrEmail(true);
    }
  }, [email]);

  useEffect(() => {
    if (password.length === 0) {
      setErrPassword(true);
    } else if (password.length < 8) {
      setErrPassword("Password yang anda masukkan kurang dari 8 karakter");
    } else {
      setErrPassword(true);
    }
  }, [password]);

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gray-100 sm:px-6 lg:px-8">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
        <img
          src={LoginBackground}
          className="object-cover h-full w-full"
          alt="Background"
        />
      </div>
      <div className="relative bg-gradient-to-b from-secondary to-primary rounded-2xl shadow-xl overflow-hidden w-full max-w-md p-6 sm:p-8 z-10 xl:hidden">
        <div className="flex justify-center mb-6">
          <img src="logo2.png" alt="Logo" className="h-12 sm:h-16 md:h-20" />
        </div>
        <form onSubmit={handlerLogin} className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-tertiary">SIMDIS</h2>
            <p className="mt-2 text-sm text-white">
              Sistem Informasi Manajemen Disposisi Kantah Jember
            </p>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <input
                ref={emailRef}
                type="text"
                placeholder="Email"
                className="form-input px-4 py-3 w-full rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500"
                id="email"
                value={email}
                onChange={setEmail}
              />
              <p className="text-red-500 text-xs absolute right-0 mt-1">
                {errEmail === true ? null : errEmail}
              </p>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="form-input px-4 py-3 w-full rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500"
                id="passwordType"
                value={password}
                onChange={setPassword}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <p className="text-red-500 text-xs absolute right-0 mt-1">
                {errPassword === true ? null : errPassword}
              </p>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-tertiary text-white font-semibold rounded-lg hover:bg-pentary focus:outline-none focus:bg-indigo-700"
            >
              LOGIN
            </button>
          </div>
        </form>
      </div>
      <div className="relative grid grid-flow-col grid-cols-2  m-5 font-poppins z-10 hidden xl:grid h-max ">
        <div className="grid justify-items-center items-center py-20">
          <div className="grid justify-items-center w-10/12 gap-5 ">
            <div className="grid justify-items-center w-11/12 gap-5">
              <img
                src="logo2.png"
                alt="Logo"
                className="flex justify-content-center w-5/6 pr-8"
              />
            </div>
          </div>
        </div>
        <div className="grid items-center justify-items-center bg-gradient-to-b from-secondary to-primary rounded-tr-3xl rounded-bl-3xl py-20">
          <form
            onSubmit={handlerLogin}
            className="w-7/12 grid gap-5 xl:px-10 py-3 rounded-md relative sm:px-1"
          >
            <h2 className="text-6xl m-0 font-bold text-start text-tertiary">
              SIMDIS
              <h2 className="text-3xl m-0 font-semibold text-start mt-4 text-white">
                Sistem Informasi Manajemen Disposisi Kantah Jember
              </h2>
            </h2>
            <p className="text-start m-0 font-medium text-quinary">
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
              <p className="text-red-500 text-xs absolute right-0 my-0.5">
                {errEmail === true ? null : errEmail}
              </p>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="form-input px-4 py-3 w-full rounded-lg border-2 border-secondary"
                id="passwordType"
                value={password}
                onChange={setPassword}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-4 m-px"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <p className="text-red-500 text-xs absolute right-0 my-0.5">
                {errPassword === true ? null : errPassword}
              </p>
            </div>
            <button
              type="submit"
              className=" rounded-lg w-full justify-self-center h-10 font-bold bg-tertiary text-white font-sans mt-3 hover:bg-pentary"
            >
              LOGIN
            </button>
            <ToastContainer />
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
