import { Outlet, useOutletContext } from "react-router";
import type { AppContext } from "~/types";

export default function AuthLayout() {
  const appContext = useOutletContext<AppContext>();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <div className="bg-linear-to-br from-primary hidden lg:flex via-black to-primary/50 items-center justify-center">
        <div className="text-center text-white space-y-4 px-12">
          <img
            src="https://thework.com/wp-content/uploads/2019/03/The-Work-app.jpg"
            alt="The Work"
            className="size-16 rounded-xl mx-auto"
          />
          <h2 className="text-3xl font-bold">
            The Work{" "}
            <span className="text-primary italic font-semibold">Platform</span>
          </h2>
          <p className="text-white/70 text-sm max-w-sm">
            Find peace of mind through inquiry. Connect with certified
            facilitators and question stressful thoughts.
          </p>
        </div>
      </div>
      <Outlet context={appContext} />
    </div>
  );
}
