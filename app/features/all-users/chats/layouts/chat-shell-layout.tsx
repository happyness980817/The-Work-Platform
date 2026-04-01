import { Outlet, useOutletContext } from "react-router";
import Navigation from "~/common/components/navigation";
import type { AppContext } from "~/types";

export default function ChatShellLayout() {
  const appContext = useOutletContext<AppContext>();
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navigation
        isLoggedIn={appContext.isLoggedIn}
        avatar={appContext.avatar}
        name={appContext.name}
        role={appContext.role}
      />
      <div className="h-16 shrink-0" />
      <main className="flex-1 min-h-0">
        <Outlet context={appContext} />
      </main>
    </div>
  );
}
