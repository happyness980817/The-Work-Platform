import { useOutletContext } from "react-router";
import type { AppContext } from "~/types";
import ClientSettingsPage from "~/features/clients/users/pages/client-settings-page";
import FacilitatorSettingsPage from "~/features/facilitators/users/pages/facilitator-settings-page";

export default function SettingsPage() {
  const { role } = useOutletContext<AppContext>();

  if (role === "facilitator") {
    return <FacilitatorSettingsPage />;
  }
  return <ClientSettingsPage />;
}
