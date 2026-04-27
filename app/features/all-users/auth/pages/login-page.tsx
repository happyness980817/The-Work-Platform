import { Form, Link, redirect, useNavigation } from "react-router";
import { useTranslation } from "react-i18next";
import z from "zod";
import { LoaderCircle, GlobeIcon } from "lucide-react";
import type { Route } from "./+types/login-page";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import { makeSSRClient } from "~/supa-client";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Login | The Work Platform" }];
};

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return {
      loginError: null,
      formErrors: z.flattenError(error).fieldErrors,
    };
  }
  const { email, password } = data;
  const { client, headers } = makeSSRClient(request);
  const { error: loginError } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (loginError) {
    return {
      formErrors: null,
      loginError: loginError.message,
    };
  }
  return redirect("/", { headers });
};

const languages = [
  { label: "한국어", value: "ko" },
  { label: "English", value: "en" },
];

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";

  return (
    <div className="flex flex-col relative items-center justify-center h-full px-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute top-6 right-6">
            <GlobeIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.value}
              className={i18n.language === lang.value ? "font-bold" : ""}
              onClick={() => {
                i18n.changeLanguage(lang.value);
                localStorage.setItem("locale", lang.value);
              }}
            >
              {lang.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex items-center flex-col justify-center max-w-sm w-full gap-8">
        <div className="flex justify-center lg:hidden">
          <img
            src="https://thework.com/wp-content/uploads/2019/03/The-Work-app.jpg"
            alt="The Work"
            className="size-12 rounded"
          />
        </div>
        <h1 className="text-2xl font-semibold">{t("auth.login")}</h1>
        <Form className="w-full space-y-4" method="post">
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder={t("auth.placeholder_email")}
            />
            {actionData && "formErrors" in actionData && (
              <p className="text-sm text-red-500">
                {actionData?.formErrors?.email?.join(", ")}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Input id="password" name="password" type="password" required />
            {actionData && "formErrors" in actionData && (
              <p className="text-sm text-red-500">
                {actionData?.formErrors?.password?.join(", ")}
              </p>
            )}
          </div>
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              t("auth.login_button")
            )}
          </Button>
          {actionData && "loginError" in actionData && actionData.loginError && (
            <p className="text-sm text-red-500">{actionData.loginError}</p>
          )}
        </Form>
        <p className="text-sm text-muted-foreground">
          {t("auth.no_account")}{" "}
          <Link to="/auth/join" className="text-primary hover:underline">
            {t("auth.join")}
          </Link>
        </p>
      </div>
    </div>
  );
}
