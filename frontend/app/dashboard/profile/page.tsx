"use client";

import { BaseLayout } from "../../components/layout/base-layout";
import { Button } from "../../components/ui/button";
import { useI18n } from "../../../lib/i18n";

export default function ProfilePage() {
  const { language, setLanguage, t } = useI18n();

  return (
    <BaseLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold">{t("profile.title")}</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        <div className="grid gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="text-sm font-medium mb-4">
              {t("profile.language.title")}
            </h3>
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
        </div>
      </div>
    </BaseLayout>
  );
}
