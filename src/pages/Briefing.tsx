import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Briefing: React.FC = () => {
  const { t, dir } = useLanguage();
  const [subject, setSubject] = useState("");

  // Basic SEO: title, description, canonical
  useEffect(() => {
    const title = `${t("briefing", "title")} | SNRT Intelligence`;
    document.title = title;

    const descContent = t("briefing", "placeholder");
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", descContent);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${window.location.origin}/briefing`);
  }, [t]);

  return (
    <main dir={dir} className="w-full">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("briefing", "title")}
          </h1>
        </header>

        <article className="bg-card rounded-lg border p-4 sm:p-6 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="subject-input" className="text-sm">
              {t("briefing", "subjectLabel")}
            </Label>
            <Input
              id="subject-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("briefing", "placeholder")}
              aria-label={t("briefing", "subjectLabel")}
            />
          </div>
        </article>
      </section>
    </main>
  );
};

export default Briefing;
