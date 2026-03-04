import {
  type RouteConfig,
  index,
  route,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("common/pages/home-page.tsx"),
  ...prefix("/facilitators", [
    index("features/users/pages/facilitators/facilitators-page.tsx"),
    route(
      "/:facilitatorId",
      "features/users/pages/facilitators/facilitator-page.tsx",
    ),
  ]),
  ...prefix("/auth", [
    route("/login", "features/auth/pages/login-page.tsx"),
    route("/join", "features/auth/pages/join-page.tsx"),
  ]),
] satisfies RouteConfig;
