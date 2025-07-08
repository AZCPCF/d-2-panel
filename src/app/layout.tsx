// app/layout.tsx
import { Outlet } from "@tanstack/react-router";
import Footer from "../components/ui/footer";
import Header from "../components/ui/header";
const Layout = () => {
  return (
    <>
      <Header />
      <main className="p-3">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
