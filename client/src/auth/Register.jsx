import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
//import Navbar from "../navbar/Navbar";
const Register = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const allowedRoles = ["farmer", "consumer"];
const roleParam = params.get("role");
const defaultRole = allowedRoles.includes(roleParam) ? roleParam : "farmer";


  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: defaultRole,
  });

  const navigate = useNavigate();

  const handleGoogleRegister = (role) => {
    window.location.href = `http://localhost:3000/auth/google?role=${role}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/signup", userData);
      const Loginres = await axios.post('http://localhost:3000/api/auth/login', {
        email: userData.email,
        password: userData.password, // assuming it's available
      });
      const token = Loginres.data.token;
      Cookies.set('token', token, { expires: 7 }); // 7 days expiry
   // Cookies.set('user', JSON.stringify(res.data.user), { expires: 7 });
      toast.success("User registration successful");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.msg || error.message);
    }
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      role: defaultRole,
    }));
  }, [defaultRole]);

  return (
    <>
     
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-50 via-white to-green-100 px-4 overflow-hidden">
        {/* Blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-[-100px] w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-60px] left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>

        {/* Main Card */}
        <div className="relative mt-5 z-10 w-full max-w-4xl bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden">
          {/* Image Side */}
          <div className="hidden md:block md:w-1/2 bg-green-100 flex items-center justify-center">
            <img
              src="Regis.png"
              alt="Register"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Form Side */}
          <div className="w-full md:w-1/2 p-6 md:p-10">
            <h2 className="text-2xl font-bold text-green-700 text-center mb-6">Register</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="relative">
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <FaUser className="absolute left-3 top-9 text-gray-500" />
                <input
                  type="text"
                  name="userName"
                  value={userData.userName}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Register As</label>
                <select
                  name="role"
                  value={userData.role}
                  onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="farmer">farmer</option>
                  <option value="consumer">consumer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <FaEnvelope className="absolute left-3 top-9 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <FaLock className="absolute left-3 top-9 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <FaLock className="absolute left-3 top-9 text-gray-500" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Register
              </button>
            </form>

            <div className="text-center my-4 text-gray-500">or</div>

            <div className="flex justify-center">
              <button
                onClick={() => handleGoogleRegister(userData.role)}
                className="flex items-center gap-2 border py-2 px-4 rounded-lg hover:shadow-md bg-white text-gray-700"
              >
                <FcGoogle size={22} />
                <span>Continue with Google</span>
              </button>
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-green-700 cursor-pointer hover:underline"
              >
                Sign in here
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}</style>
    </>
  );
};

export default Register;