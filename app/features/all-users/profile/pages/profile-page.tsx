import { useOutletContext } from "react-router";
import type { AppContext } from "~/types";
import ClientProfilePage from "~/features/clients/users/pages/client-profile-page";
import FacilitatorProfilePage from "~/features/facilitators/users/pages/facilitator-profile-page";

export default function ProfilePage() {
  const { role } = useOutletContext<AppContext>();

  if (role === "facilitator") {
    return <FacilitatorProfilePage />;
  }
  return <ClientProfilePage />;
}
