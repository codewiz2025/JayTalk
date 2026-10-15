import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { PageHeading, useMe } from "@/components/shell";
import { Button, errText } from "@/components/ui";
import { formatBucks } from "@/lib/jaytalk";
import { buyItem, equipItem, listStore } from "@/lib/jaytalk-api";

export const Route = createFileRoute("/_app/store")({
  component: StorePage,
  head: () => ({ meta: [{ title: "Store — JayTalk" }] }),
});

const sections = [
  { kind: "avatar", title: "Avatars" },
  { kind: "wallpaper", title: "Wallpapers" },
  { kind: "theme", title: "Chat themes" },
  { kind: "powerup", title: "Power-ups" },
];

function StorePage() {
  const qc = useQueryClient();
  const me = useMe();
  const items = useQuery({ queryKey: ["store"], queryFn: () => listStore() });

  async function buy(key: string) {
    try {
      await buyItem({ data: { key } });
      toast.success("Added to your collection");
      await qc.invalidateQueries({ queryKey: ["store"] });
      await qc.invalidateQueries({ queryKey: ["me"] });
    } catch (error) {
      toast.error(errText(error));
    }
  }
  async function equip(key: string) {
    try {
      await equipItem({ data: { key } });
      toast.success("Now in use");
      await qc.invalidateQueries({ queryKey: ["store"] });
      await qc.invalidateQueries({ queryKey: ["me"] });
    } catch (error) {
      toast.error(errText(error));
    }
  }

  return (
    <div>
      <PageHeading title="Store" subtitle="Looks, wallpapers, and power-ups. Premium wallpapers can be a photo from your phone." />
      <section className="mb-8 rounded-3xl bg-card p-4">
        <h2 className="font-bold">Custom wallpaper · 400 Bucks</h2>
        <p className="mt-1 text-sm text-muted-foreground">Upload a photo from your device. It becomes your chat background.</p>
        <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
          Upload photo
          <input className="sr-only" type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              localStorage.setItem("jaytalk-wallpaper", String(reader.result));
              toast.success("Wallpaper saved on this device");
            };
            reader.readAsDataURL(file);
          }} />
        </label>
      </section>
      <p className="mb-6 text-sm font-semibold">You have {formatBucks(me.data?.balance ?? 0)}</p>
      {sections.map((section) => {
        const list = items.data?.filter((item) => item.kind === section.kind) ?? [];
        if (!list.length) return null;
        return (
          <section key={section.kind} className="mb-8">
            <h2 className="mb-3 font-bold">{section.title}</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {list.map((item) => {
                const owned = item.quantity != null;
                const gradient = item.preview.startsWith("linear-gradient");
                const free = Number(item.price_bucks) === 0;
                return (
                  <article key={item.key} className="overflow-hidden rounded-2xl border border-border bg-card">
                    <div className="grid aspect-[4/3] place-items-center bg-muted text-4xl" style={gradient ? { backgroundImage: item.preview } : undefined}>
                      {!gradient && item.kind !== "theme" && item.kind !== "powerup" ? item.preview : item.kind === "powerup" ? "🔥" : item.name.slice(0, 1)}
                    </div>
                    <div className="p-3">
                      <p className="truncate text-sm font-semibold">{item.name}</p>
                      <p className="mb-3 text-xs text-muted-foreground">{free ? "Free" : formatBucks(Number(item.price_bucks))}{item.kind === "powerup" && owned ? ` · You have ${item.quantity}` : ""}</p>
                      {item.kind !== "powerup" && (owned || free) ? (
                        <Button className="w-full" variant={item.equipped ? "secondary" : "primary"} disabled={Boolean(item.equipped)} onClick={() => void equip(item.key)}>{item.equipped ? "In use" : "Use"}</Button>
                      ) : (
                        <Button className="w-full" onClick={() => void buy(item.key)}><ShoppingBag className="size-4" /> Buy</Button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
