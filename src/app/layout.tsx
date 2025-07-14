// app/layout.tsx
import { Outlet } from "@tanstack/react-router";
import Footer from "../components/ui/footer";
import Header from "../components/ui/header";
const Layout = () => {
  return (
    <div className="flex flex-col justify-between min-h-screen relative">
      <Header />
      <main className="p-3 mt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
