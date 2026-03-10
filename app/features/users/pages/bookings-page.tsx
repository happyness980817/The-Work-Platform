import { useOutletContext } from "react-router";
import type { AppContext } from "~/types";
import ClientBookingsPage from "./clients/client-bookings-page";
import FacilitatorBookingsPage from "./facilitators/facilitator-bookings-page";

export default function BookingsPage() {
  const appContext = useOutletContext<AppContext>();

  return appContext.role === "client" ? (
    <ClientBookingsPage />
  ) : (
    <FacilitatorBookingsPage />
  );
}
