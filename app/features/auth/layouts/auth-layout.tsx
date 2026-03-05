import { Outlet, useOutletContext } from "react-router";
import type { AppContext } from "~/types";

export default function AuthLayout() {
  const appContext = useOutletContext<AppContext>();
  return <Outlet context={appContext} />;
}
