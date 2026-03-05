import { Outlet, useOutletContext } from "react-router";
import Navigation from "~/common/components/navigation";
import type { AppContext } from "~/types";

export default function ChatShellLayout() {
  const appContext = useOutletContext<AppContext>();
  return (
    <div className="flex flex-col h-screen">
      <Navigation
        isLoggedIn={appContext.isLoggedIn}
        hasNotifications={false}
        hasMessages={false}
        avatar={appContext.avatar}
        name={appContext.name}
      />
      <main className="flex-1 pt-16 min-h-0">
        <Outlet context={appContext} />
      </main>
    </div>
  );
}
