import { Outlet, useOutletContext } from "react-router";
import type { AppContext } from "~/types";
import { LightRays } from "~/common/components/ui/light-rays";
import { IconCloud } from "~/common/components/ui/icon-cloud";
import { facilitators } from "~/features/users/data/facilitators";

const facilitatorAvatars = facilitators.map((f) => f.imageUrl);

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
          <IconCloud images={facilitatorAvatars} />
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
