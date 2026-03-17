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
      route("/:facilitatorId", "features/platform/pages/facilitator-page.tsx"),
    ]),
    layout("features/users/layouts/bookings-layout.tsx", [
      ...prefix("/my/bookings", [
        index("features/users/pages/bookings-index-page.tsx"),
        route(
          "/sessions",
          "features/users/pages/facilitators/facilitator-sessions-page.tsx",
        ),
        route(
          "/manage",
          "features/users/pages/facilitators/facilitator-manage-page.tsx",
        ),
        route(
          "/availability",
          "features/users/pages/facilitators/facilitator-availability-page.tsx",
        ),
      ]),
    ]),
    route("/my/profile", "features/users/pages/profile-page.tsx"),
    route("/my/settings", "features/users/pages/settings-page.tsx"),
  ]),
  layout("features/auth/layouts/auth-layout.tsx", [
    ...prefix("/auth", [
      route("/login", "features/auth/pages/login-page.tsx"),
      route("/join", "features/auth/pages/join-page.tsx"),
    ]),
  ]),
  layout("features/chats/layouts/chat-shell-layout.tsx", [
    layout("features/chats/layouts/chat-layout.tsx", [
      route("/chats", "features/chats/pages/chats-index-page.tsx"),
      route(
        "/chats/sessions/:sessionId",
        "features/chats/pages/facilitator-session-page.tsx",
      ),
      route("/chats/dms/:dmId", "features/chats/pages/facilitator-dm-page.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
