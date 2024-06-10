import { Outlet } from "react-router-dom";
import useScreenSize from "@/hooks/useScreenSize";

import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";

function Layout() {
  const screenSize = useScreenSize();
  // const LG = 1024;

  return (
    <div
      className={`grid w-full transition-all duration-150 md:grid-cols-[80px_1fr] xl:grid-cols-[220px_1fr]`}
    >
      <Sidebar screenSize={screenSize} />
      <div className="flex h-screen max-h-screen flex-col overflow-y-auto">
        <Navbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
