import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const taglineLines = t("footer.tagline").split("\n");
  return (
    <footer className="border-t pt-10 pb-6 max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 w-full">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <img
              src="https://thework.com/wp-content/uploads/2019/03/The-Work-app.jpg"
              alt="The Work"
              className="size-6 rounded"
            />
            <span className="text-lg font-bold">
              The Work{" "}
              <span className="text-primary font-normal italic">Platform</span>
            </span>
          </div>
          <div className="text-muted-foreground text-sm space-y-1.5">
            {taglineLines.map((line, index) => (
              <p key={index} className="leading-5">
                {line.trim()}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t text-xs text-muted-foreground space-y-3">
        <p>{t("footer.disclaimer")}</p>
        <p>{t("footer.copyright")}</p>
      </div>
    </footer>
  );
}
