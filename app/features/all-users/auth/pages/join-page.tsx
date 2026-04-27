import { Form, Link, redirect, useNavigation } from "react-router";
import { useTranslation } from "react-i18next";
import z from "zod";
import { LoaderCircle, GlobeIcon } from "lucide-react";
import type { Route } from "./+types/join-page";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/common/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import { makeSSRClient } from "~/supa-client";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Join | The Work Platform" }];
};

const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long."),
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    passwordConfirmation: z.string(),
    role: z.enum(["client", "facilitator"]),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return {
      signUpError: null,
      formErrors: z.flattenError(error).fieldErrors,
    };
  }
  const { client, headers } = makeSSRClient(request);
  const { data: signUpData, error: signUpError } = await client.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        role: data.role,
      },
    },
  });
  if (signUpError) {
    return {
      formErrors: null,
      signUpError: signUpError.message,
    };
  }
  // Supabase는 보안상 중복 이메일에 명시적 에러를 반환하지 않고 빈 identities 배열로 신호한다
  if (signUpData.user && signUpData.user.identities?.length === 0) {
    return {
      formErrors: null,
      signUpError: "가입에 실패했습니다. 다른 이메일로 시도해주세요.",
    };
  }
  return redirect("/", { headers });
};

const languages = [
  { label: "한국어", value: "ko" },
  { label: "English", value: "en" },
];

export default function JoinPage({ actionData }: Route.ComponentProps) {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";

  return (
    <div className="flex flex-col relative items-center justify-center h-full px-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-6 right-6"
          >
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
        <h1 className="text-2xl font-semibold">{t("auth.join")}</h1>
        <Tabs defaultValue="client" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="client">{t("auth.client")}</TabsTrigger>
            <TabsTrigger value="facilitator">
              {t("auth.facilitator")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="client">
            <Form className="space-y-4" method="post">
              <input type="hidden" name="role" value="client" />
              <div className="space-y-2">
                <Label htmlFor="client-name">{t("auth.name")}</Label>
                <Input
                  id="client-name"
                  name="name"
                  required
                  placeholder={t("auth.placeholder_name")}
                />
                {actionData && "formErrors" in actionData && (
                  <p className="text-sm text-red-500">
                    {actionData?.formErrors?.name?.join(", ")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-email">{t("auth.email")}</Label>
                <Input
                  id="client-email"
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
                <Label htmlFor="client-password">{t("auth.password")}</Label>
                <Input
                  id="client-password"
                  name="password"
                  type="password"
                  required
                />
                {actionData && "formErrors" in actionData && (
                  <p className="text-sm text-red-500">
                    {actionData?.formErrors?.password?.join(", ")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-password-confirm">
                  {t("auth.password_confirm")}
                </Label>
                <Input
                  id="client-password-confirm"
                  name="passwordConfirmation"
                  type="password"
                  required
                />
                {actionData && "formErrors" in actionData && (
                  <p className="text-sm text-red-500">
                    {actionData?.formErrors?.passwordConfirmation?.join(", ")}
                  </p>
                )}
              </div>
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  t("auth.join_button")
                )}
              </Button>
              {actionData && "signUpError" in actionData && actionData.signUpError && (
                <p className="text-sm text-red-500">{actionData.signUpError}</p>
              )}
            </Form>
          </TabsContent>
          <TabsContent value="facilitator">
            <Form className="space-y-4" method="post">
              <input type="hidden" name="role" value="facilitator" />
              <div className="space-y-2">
                <Label htmlFor="facilitator-name">{t("auth.name")}</Label>
                <Input
                  id="facilitator-name"
                  name="name"
                  required
                  placeholder={t("auth.placeholder_name")}
                />
                {actionData && "formErrors" in actionData && (
                  <p className="text-sm text-red-500">
                    {actionData?.formErrors?.name?.join(", ")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="facilitator-email">{t("auth.email")}</Label>
                <Input
                  id="facilitator-email"
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
                <Label htmlFor="facilitator-password">
                  {t("auth.password")}
                </Label>
                <Input
                  id="facilitator-password"
                  name="password"
                  type="password"
                  required
                />
                {actionData && "formErrors" in actionData && (
                  <p className="text-sm text-red-500">
                    {actionData?.formErrors?.password?.join(", ")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="facilitator-password-confirm">
                  {t("auth.password_confirm")}
                </Label>
                <Input
                  id="facilitator-password-confirm"
                  name="passwordConfirmation"
                  type="password"
                  required
                />
                {actionData && "formErrors" in actionData && (
                  <p className="text-sm text-red-500">
                    {actionData?.formErrors?.passwordConfirmation?.join(", ")}
                  </p>
                )}
              </div>
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  t("auth.join_button")
                )}
              </Button>
              {actionData && "signUpError" in actionData && actionData.signUpError && (
                <p className="text-sm text-red-500">{actionData.signUpError}</p>
              )}
            </Form>
          </TabsContent>
        </Tabs>
        <p className="text-sm text-muted-foreground">
          {t("auth.has_account")}{" "}
          <Link to="/auth/login" className="text-primary hover:underline">
            {t("auth.login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
