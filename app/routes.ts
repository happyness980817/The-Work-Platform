import {
  type RouteConfig,
  index,
  route,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  layout("common/layouts/site-layout.tsx", [
    index("common/pages/home-page.tsx"),
    ...prefix("/facilitators", [
      index("common/pages/facilitators-page.tsx"),
      route(
        "/profile/:facilitatorId",
        "features/all-users/platform/pages/facilitator-profile-page.tsx",
      ),
      route(
        "/:facilitatorId",
        "features/all-users/platform/pages/facilitator-booking-page.tsx",
      ),
    ]),
    layout("features/all-users/bookings/layouts/bookings-layout.tsx", [
      ...prefix("/my/bookings", [
        index("features/all-users/bookings/pages/bookings-dashboard-page.tsx"),
        route(
          "/sessions",
          "features/facilitators/bookings/pages/sessions-list-page.tsx",
        ),
        route(
          "/manage",
          "features/facilitators/bookings/pages/manage-bookings-page.tsx",
        ),
        route(
          "/availability",
          "features/facilitators/bookings/pages/availability-page.tsx",
        ),
      ]),
    ]),
    route("/about", "common/pages/about-page.tsx"),
    route("/my/profile", "features/all-users/profile/pages/profile-page.tsx"),
    route("/my/settings", "features/all-users/profile/pages/settings-page.tsx"),
  ]),
  layout("features/all-users/auth/layouts/auth-layout.tsx", [
    ...prefix("/auth", [
      route("/login", "features/all-users/auth/pages/login-page.tsx"),
      route("/join", "features/all-users/auth/pages/join-page.tsx"),
    ]),
  ]),
  layout("features/all-users/chats/layouts/chat-shell-layout.tsx", [
    layout("features/all-users/chats/layouts/chat-layout.tsx", [
      route("/chats", "features/all-users/chats/pages/chats-index-page.tsx"),
      route(
        "/chats/sessions/:sessionId",
        "features/all-users/chats/pages/chat-session-page.tsx",
      ),
      route(
        "/chats/dms/:dmId",
        "features/all-users/chats/pages/chat-dm-page.tsx",
      ),
    ]),
  ]),
] satisfies RouteConfig;
