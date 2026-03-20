import { Outlet, useOutletContext } from "react-router";
import Navigation from "~/common/components/navigation";
import Footer from "~/common/components/footer";
import type { AppContext } from "~/types";

export default function SiteLayout() {
  const appContext = useOutletContext<AppContext>();
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation
        isLoggedIn={appContext.isLoggedIn}
        avatar={appContext.avatar}
        name={appContext.name}
        username={appContext.username}
        role={appContext.role}
        isAdmin={appContext.isAdmin}
      />
      <main className="flex-1 pt-16">
        <Outlet context={appContext} />
      </main>
      <Footer />
    </div>
  );
}
