import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("phoneNumber");
    navigate("/login");
  };
  return handleLogOut;
};

export default useLogout;
