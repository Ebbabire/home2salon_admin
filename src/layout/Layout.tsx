import { Outlet } from "react-router-dom";
import useScreenSize from "@/hooks/useScreenSize";

import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";

function Layout() {
  const screenSize = useScreenSize();
  // const LG = 1024;

  return (
    <div
      className={`grid min-h-screen w-full md:grid-cols-[80px_1fr] lg:grid-cols-[220px_1fr] transition-all duration-150`}
    >
      <Sidebar screenSize={screenSize} />
      <div className="flex flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
