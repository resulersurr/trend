import AiContentGenerator from "@/components/admin/AiContentGenerator";

export default function AdminAiContentPage() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground">AI Icerik Uretimi</h2>
        <p className="text-sm text-muted">Keyword tabanli icerik uret, incele ve draft olarak kaydet.</p>
      </div>
      <AiContentGenerator />
    </section>
  );
}
