import { Outlet, useOutletContext } from "react-router";
import type { AppContext } from "~/types";
import { LightRays } from "~/common/components/ui/light-rays";
import { OrbitingCircles } from "~/common/components/ui/orbiting-circles";
import { facilitators } from "~/features/all-users/data/facilitators";

export default function AuthLayout() {
  const appContext = useOutletContext<AppContext>();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <div className="relative hidden lg:flex bg-linear-to-b from-background to-primary/5 items-center justify-center overflow-hidden">
        <LightRays
          color="rgba(23, 84, 207, 0.2)"
          count={6}
          blur={40}
          speed={16}
        />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative flex size-[400px] items-center justify-center">
            <span className="text-6xl">🌏</span>

            <OrbitingCircles iconSize={48} radius={120} duration={30}>
              {facilitators.slice(0, 3).map((f) => (
                <img
                  key={f.id}
                  src={f.imageUrl}
                  alt={f.name}
                  className="size-12 rounded-full ring-2 ring-background shadow-md"
                />
              ))}
            </OrbitingCircles>

            <OrbitingCircles iconSize={40} radius={180} duration={38} reverse>
              {facilitators.slice(3).map((f) => (
                <img
                  key={f.id}
                  src={f.imageUrl}
                  alt={f.name}
                  className="size-10 rounded-full ring-2 ring-background shadow-md"
                />
              ))}
            </OrbitingCircles>
          </div>

          <div className="text-center space-y-3 px-12">
            <h2 className="text-3xl font-bold">
              The Work{" "}
              <span className="text-primary italic font-semibold">
                Platform
              </span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-sm">
              Find peace of mind through inquiry. Connect with certified
              facilitators and question stressful thoughts.
            </p>
          </div>
        </div>
      </div>
      <Outlet context={appContext} />
    </div>
  );
}
