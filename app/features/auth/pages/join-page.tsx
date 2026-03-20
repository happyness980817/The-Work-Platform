import { Link } from "react-router";
import { useTranslation } from "react-i18next";
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
import { GlobeIcon } from "lucide-react";

const languages = [
  { label: "한국어", value: "ko" },
  { label: "English", value: "en" },
];

export default function JoinPage() {
  const { t, i18n } = useTranslation();

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
        <h1 className="text-2xl font-semibold">{t("auth.join")}</h1>
        <Tabs defaultValue="client" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="client">{t("auth.client")}</TabsTrigger>
            <TabsTrigger value="facilitator">
              {t("auth.facilitator")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="client">
            <form className="space-y-4">
              <input type="hidden" name="role" value="client" />
              <div className="space-y-2">
                <Label htmlFor="client-name">{t("auth.name")}</Label>
                <Input id="client-name" name="name" placeholder="홍길동" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-email">{t("auth.email")}</Label>
                <Input
                  id="client-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-password">{t("auth.password")}</Label>
                <Input
                  id="client-password"
                  name="password"
                  type="password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-password-confirm">
                  {t("auth.password_confirm")}
                </Label>
                <Input
                  id="client-password-confirm"
                  name="passwordConfirmation"
                  type="password"
                />
              </div>
              <Button className="w-full" type="submit">
                {t("auth.join_button")}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="facilitator">
            <form className="space-y-4">
              <input type="hidden" name="role" value="facilitator" />
              <div className="space-y-2">
                <Label htmlFor="facilitator-name">{t("auth.name")}</Label>
                <Input
                  id="facilitator-name"
                  name="name"
                  placeholder="홍길동"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facilitator-email">{t("auth.email")}</Label>
                <Input
                  id="facilitator-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facilitator-password">
                  {t("auth.password")}
                </Label>
                <Input
                  id="facilitator-password"
                  name="password"
                  type="password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facilitator-password-confirm">
                  {t("auth.password_confirm")}
                </Label>
                <Input
                  id="facilitator-password-confirm"
                  name="passwordConfirmation"
                  type="password"
                />
              </div>
              <Button className="w-full" type="submit">
                {t("auth.join_button")}
              </Button>
            </form>
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
