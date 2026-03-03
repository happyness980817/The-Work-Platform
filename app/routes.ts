import {
  type RouteConfig,
  index,
  route,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("common/pages/home-page.tsx"),
  route("/facilitators", "features/users/pages/facilitators-page.tsx"),
  ...prefix("/auth", [
    route("/login", "features/auth/pages/login-page.tsx"),
    route("/join", "features/auth/pages/join-page.tsx"),
  ]),
] satisfies RouteConfig;
