import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Briefing: React.FC = () => {
  const { t, dir } = useLanguage();
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleGo = async () => {
    const trimmed = subject.trim();
    if (!trimmed) {
      toast({
        title: t("common", "error"),
        description: t("briefing", "subjectLabel"),
      });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("briefing-proxy", {
        body: { subject: trimmed },
      });
      if (error) throw error;
      console.log("briefing-proxy response:", data);
      toast({
        title: t("common", "success"),
        description: t("improve", "successMessage"),
      });
    } catch (err: any) {
      console.error("briefing-proxy error:", err);
      toast({
        title: t("common", "error"),
        description: err?.message || "Webhook error",
      });
    } finally {
      setLoading(false);
    }
  };

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

          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleGo}
              disabled={loading || !subject.trim()}
              aria-busy={loading}
              className="bg-[hsl(var(--brand-ihata))] text-[hsl(var(--brand-ihata-foreground))] hover:bg-[hsl(var(--brand-ihata-hover))]"
            >
              {t("briefing", "go")}
            </Button>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Briefing;
