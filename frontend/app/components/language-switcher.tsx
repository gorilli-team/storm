import { Button } from "./ui/button";
import { useI18n } from "../../lib/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{t("profile.language.title")}</h3>
      <div className="flex gap-2">
        <Button
          variant={language === "en" ? "default" : "outline"}
          size="sm"
          onClick={() => setLanguage("en")}
        >
          {t("profile.language.en")}
        </Button>
        <Button
          variant={language === "it" ? "default" : "outline"}
          size="sm"
          onClick={() => setLanguage("it")}
        >
          {t("profile.language.it")}
        </Button>
      </div>
    </div>
  );
}
