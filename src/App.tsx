// import { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
import AllRoutes from "./routes/AllRoutes";

function App() {
  // const token = JSON.parse(sessionStorage.getItem("token")!);
  // const navigate = useNavigate();
  // const { pathname } = useLocation();

  // useEffect(() => {
  //   if (!token && pathname !== "/pass-reset" && pathname !== "/privacyPolicy") {
  //     navigate("/login");
  //   }
  // }, [token, navigate, pathname]);
  return (
    <>
      <AllRoutes />
    </>
  );
}

export default App;
