"use client";

import { BaseLayout } from "../../components/layout/base-layout";
import { Button } from "../../components/ui/button";
import { useI18n } from "../../../lib/i18n";
import { User, Zap } from "lucide-react";

export default function ProfilePage() {
  const { language, setLanguage, t } = useI18n();

  return (
    <BaseLayout>
      <div className="space-y-8 w-full px-6 text-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 pb-1">
            {t("profile.title")}
          </h1>
          <p className="text-blue-300 mt-2 flex items-center">
            <User className="inline mr-2 h-4 w-4 text-cyan-400" /> Manage your
            account settings
          </p>
        </div>

        <div className="grid gap-6">
          <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-blue-500 border-opacity-50">
            <h3 className="text-sm font-medium mb-4 text-cyan-400">
              {t("profile.language.title")}
            </h3>
            <div className="flex gap-2">
              <Button
                variant={language === "en" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("en")}
                className={
                  language === "en"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500"
                    : "border-blue-700 text-blue-300 hover:bg-gray-700"
                }
              >
                {t("profile.language.en")}
              </Button>
              <Button
                variant={language === "it" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("it")}
                className={
                  language === "it"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500"
                    : "border-blue-700 text-blue-300 hover:bg-gray-700"
                }
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
