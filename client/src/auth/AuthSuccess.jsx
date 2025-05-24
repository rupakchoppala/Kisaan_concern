// AuthSuccess.jsx
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
  
    if (token) {
      Cookies.set("token", token, { expires: 7, path: "/" });
      window.history.replaceState({}, document.title, "/auth/success");
  
      // Wait 1 second before redirecting
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      navigate("/login");
    }
  }, [navigate]);
  
  

  return <div>Logging you in...</div>;
}

export default AuthSuccess;
