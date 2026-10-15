import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PageHeading, useMe } from "@/components/shell";
import { Button } from "@/components/ui";
import { formatBucks } from "@/lib/jaytalk";

export const Route = createFileRoute("/_app/avatar")({
  component: AvatarPage,
  head: () => ({ meta: [{ title: "Avatar — JayTalk" }] }),
});

const AVATAR_UNLOCK = 5000;

const SKINS = ["#f5d0b0", "#e8b989", "#c68642", "#8d5524", "#5c3317", "#3b2214"];
const HAIRS = [
  { id: "short", label: "Short" },
  { id: "fade", label: "Fade" },
  { id: "afro", label: "Afro" },
  { id: "locs", label: "Locs" },
  { id: "long", label: "Long" },
  { id: "bun", label: "Bun" },
  { id: "bald", label: "Bald" },
];
const HAIR_COLORS = ["#1a1a1a", "#3d2314", "#6b4423", "#c4a35a", "#e8e0d5", "#b71c1c", "#1565c0"];
const EYES = ["#2c1810", "#3e2723", "#1b5e20", "#0d47a1", "#4a148c", "#37474f"];
const FACES = [
  { id: "oval", label: "Oval" },
  { id: "round", label: "Round" },
  { id: "square", label: "Square" },
  { id: "heart", label: "Heart" },
];
const MOODS = [
  { id: "neutral", label: "Neutral", mouth: "M 38 62 Q 50 66 62 62" },
  { id: "smile", label: "Smile", mouth: "M 36 60 Q 50 72 64 60" },
  { id: "grin", label: "Grin", mouth: "M 34 58 Q 50 78 66 58" },
  { id: "cool", label: "Cool", mouth: "M 40 64 L 60 64" },
];

const OUTFITS = [
  { id: "tee", name: "Basic tee", price: 0, color: "#e8eef7", accent: "#94a3b8" },
  { id: "hoodie", name: "Hoodie", price: 0, color: "#312e81", accent: "#6366f1" },
  { id: "denim", name: "Denim jacket", price: 1200, color: "#1e3a5f", accent: "#60a5fa" },
  { id: "sports", name: "Sports kit", price: 1500, color: "#14532d", accent: "#4ade80" },
  { id: "school", name: "School fit", price: 1800, color: "#1e293b", accent: "#f8fafc" },
  { id: "winter", name: "Winter coat", price: 2200, color: "#7c2d12", accent: "#fdba74" },
  { id: "street", name: "Streetwear", price: 2500, color: "#18181b", accent: "#a1a1aa" },
  { id: "royal", name: "Royal set", price: 3500, color: "#4c1d95", accent: "#fbbf24" },
  { id: "shoes", name: "Sneaker pack", price: 2800, color: "#0f172a", accent: "#38bdf8" },
  { id: "accessory", name: "Glasses & hats", price: 2000, color: "#334155", accent: "#e2e8f0" },
];

type AvatarState = {
  unlocked: boolean;
  mode: "manual" | "photo";
  photoDataUrl: string | null;
  skin: string;
  face: string;
  hair: string;
  hairColor: string;
  eyes: string;
  mood: string;
  owned: string[];
  equipped: string;
};

function load(): AvatarState {
  try {
    const raw = localStorage.getItem("jaytalk-avatar-v3");
    if (raw) return JSON.parse(raw) as AvatarState;
  } catch {
    /* ignore */
  }
  return {
    unlocked: false,
    mode: "manual",
    photoDataUrl: null,
    skin: SKINS[2],
    face: "oval",
    hair: "short",
    hairColor: HAIR_COLORS[0],
    eyes: EYES[0],
    mood: "smile",
    owned: ["tee", "hoodie"],
    equipped: "tee",
  };
}

function faceRadius(face: string): string {
  if (face === "round") return "50%";
  if (face === "square") return "18%";
  if (face === "heart") return "45% 45% 40% 40% / 55% 55% 40% 40%";
  return "42% 42% 38% 38% / 48% 48% 42% 42%";
}

function AvatarPreview({ state }: { state: AvatarState }) {
  const outfit = OUTFITS.find((o) => o.id === state.equipped) ?? OUTFITS[0];
  const mood = MOODS.find((m) => m.id === state.mood) ?? MOODS[1];
  const showHair = state.hair !== "bald";

  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-3xl bg-gradient-to-b from-slate-800 via-indigo-950 to-slate-950 shadow-2xl">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />

      <div className="absolute bottom-[8%] left-1/2 w-[42%] -translate-x-1/2">
        <div
          className="mx-auto h-28 w-full rounded-t-[40%] shadow-lg"
          style={{
            background: `linear-gradient(160deg, ${outfit.color} 0%, ${outfit.accent}55 100%)`,
          }}
        />
        <div
          className="absolute -left-[28%] top-2 h-20 w-[28%] rounded-full opacity-95"
          style={{ background: outfit.color, transform: "rotate(12deg)" }}
        />
        <div
          className="absolute -right-[28%] top-2 h-20 w-[28%] rounded-full opacity-95"
          style={{ background: outfit.color, transform: "rotate(-12deg)" }}
        />
      </div>

      <div
        className="absolute left-1/2 top-[38%] h-8 w-8 -translate-x-1/2 rounded-b-lg"
        style={{ background: state.skin }}
      />

      <div
        className="absolute left-1/2 top-[14%] aspect-square w-[46%] -translate-x-1/2 overflow-hidden shadow-xl"
        style={{
          background: state.mode === "photo" && state.photoDataUrl ? "transparent" : state.skin,
          borderRadius: faceRadius(state.face),
        }}
      >
        {state.mode === "photo" && state.photoDataUrl ? (
          <img src={state.photoDataUrl} alt="Your face" className="h-full w-full object-cover" />
        ) : (
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <ellipse cx="35" cy="48" rx="7" ry="8" fill="#fff" />
            <ellipse cx="65" cy="48" rx="7" ry="8" fill="#fff" />
            <circle cx="35" cy="49" r="4.5" fill={state.eyes} />
            <circle cx="65" cy="49" r="4.5" fill={state.eyes} />
            <circle cx="36.5" cy="47.5" r="1.5" fill="#fff" opacity="0.7" />
            <circle cx="66.5" cy="47.5" r="1.5" fill="#fff" opacity="0.7" />
            <path d="M 26 40 Q 35 36 44 40" fill="none" stroke={state.hairColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 56 40 Q 65 36 74 40" fill="none" stroke={state.hairColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 50 52 L 47 60 Q 50 62 53 60 Z" fill={state.skin} stroke="#00000022" strokeWidth="0.5" />
            <path d={mood.mouth} fill="none" stroke="#5c3317" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {showHair && state.mode === "manual" && (
        <div
          className="pointer-events-none absolute left-1/2 top-[10%] w-[52%] -translate-x-1/2"
          style={{ height: state.hair === "afro" || state.hair === "locs" ? "28%" : "18%" }}
        >
          <div
            className="mx-auto h-full w-full"
            style={{
              background: state.hairColor,
              borderRadius:
                state.hair === "afro"
                  ? "50%"
                  : state.hair === "bun"
                    ? "40% 40% 20% 20%"
                    : state.hair === "long"
                      ? "40% 40% 10% 10%"
                      : "45% 45% 30% 30%",
              boxShadow: state.hair === "locs" ? `0 12px 0 ${state.hairColor}, 0 20px 0 ${state.hairColor}` : undefined,
            }}
          />
        </div>
      )}

      {state.equipped === "accessory" && state.mode === "manual" && (
        <div className="pointer-events-none absolute left-1/2 top-[26%] flex w-[40%] -translate-x-1/2 justify-center gap-1">
          <div className="h-5 w-5 rounded-full border-2 border-slate-300/90" />
          <div className="mt-2 h-0.5 w-2 bg-slate-300/90" />
          <div className="h-5 w-5 rounded-full border-2 border-slate-300/90" />
        </div>
      )}

      <p className="absolute bottom-3 left-0 right-0 text-center text-[10px] font-medium tracking-wide text-white/50">
        JayTalk Avatar
      </p>
    </div>
  );
}

function AvatarPage() {
  const me = useMe();
  const [state, setState] = useState<AvatarState>(load);
  const [tab, setTab] = useState<"face" | "hair" | "style" | "store">("face");
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [camOn, setCamOn] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    localStorage.setItem("jaytalk-avatar-v3", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function unlock() {
    if ((me.data?.balance ?? 0) < AVATAR_UNLOCK) {
      toast.error(`Need ${formatBucks(AVATAR_UNLOCK)} to unlock avatar`);
      return;
    }
    setState((s) => ({ ...s, unlocked: true }));
    toast.success("Avatar unlocked — create your look");
  }

  function buyOutfit(id: string, price: number) {
    if (state.owned.includes(id)) {
      setState((s) => ({ ...s, equipped: id }));
      toast.success("Equipped");
      return;
    }
    if ((me.data?.balance ?? 0) < price) {
      toast.error("Not enough Bucks");
      return;
    }
    setState((s) => ({ ...s, owned: [...s.owned, id], equipped: id }));
    toast.success("Purchased");
  }

  function onPhotoFile(file: File | null) {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Choose a photo");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setState((s) => ({
        ...s,
        mode: "photo",
        photoDataUrl: String(reader.result),
      }));
      toast.success("Photo applied as face");
      stopCam();
    };
    reader.readAsDataURL(file);
  }

  async function startCam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamOn(true);
    } catch {
      toast.error("Camera permission denied — upload a photo instead");
    }
  }

  function stopCam() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCamOn(false);
  }

  function snap() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    const data = canvas.toDataURL("image/jpeg", 0.92);
    setState((s) => ({ ...s, mode: "photo", photoDataUrl: data }));
    stopCam();
    toast.success("Selfie applied as face");
  }

  function useManual() {
    setState((s) => ({ ...s, mode: "manual", photoDataUrl: null }));
    stopCam();
  }

  if (!state.unlocked) {
    return (
      <div className="mx-auto max-w-lg space-y-4 pb-8">
        <PageHeading
          title="Avatar"
          subtitle="Create a realistic look inside JayTalk — by photo or by hand. No other account needed."
        />
        <section className="rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-xl">
          <p className="text-sm font-semibold opacity-90">Premium</p>
          <h2 className="mt-1 text-2xl font-extrabold">Unlock your avatar</h2>
          <ul className="mt-3 space-y-1 text-sm opacity-90">
            <li>· Snap a selfie or upload a photo for your face</li>
            <li>· Or build face, hair & style manually</li>
            <li>· 10 outfits (2 free) with Bucks</li>
          </ul>
          <Button className="mt-5 bg-white text-indigo-700 hover:bg-white/90" onClick={unlock}>
            Unlock · {formatBucks(AVATAR_UNLOCK)}
          </Button>
          <p className="mt-2 text-xs opacity-80">Balance: {formatBucks(me.data?.balance ?? 0)}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-4 pb-10 lg:grid-cols-[minmax(0,280px)_1fr]">
      <div className="space-y-3">
        <PageHeading title="Avatar" subtitle="All inside JayTalk — no external account." />
        <AvatarPreview state={state} />
        <div className="flex gap-2">
          <Button
            variant={state.mode === "photo" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setTab("face")}
          >
            Photo face
          </Button>
          <Button variant={state.mode === "manual" ? "default" : "outline"} className="flex-1" onClick={useManual}>
            Manual
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-1 rounded-2xl bg-secondary/60 p-1">
          {(
            [
              ["face", "Face / Photo"],
              ["hair", "Hair"],
              ["style", "Mood"],
              ["store", "Outfits"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                tab === id ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <section className="rounded-3xl border border-border bg-card p-4 shadow-sm">
          {tab === "face" && (
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-semibold">Create from photo</p>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" onClick={() => fileRef.current?.click()}>
                    Upload photo
                  </Button>
                  <Button type="button" variant="outline" onClick={camOn ? stopCam : startCam}>
                    {camOn ? "Close camera" : "Snap selfie"}
                  </Button>
                  {state.photoDataUrl && (
                    <Button type="button" variant="outline" onClick={useManual}>
                      Clear photo
                    </Button>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={(e) => onPhotoFile(e.target.files?.[0] ?? null)}
                />
                {camOn && (
                  <div className="mt-3 space-y-2">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="mx-auto max-h-56 w-full max-w-xs scale-x-[-1] rounded-2xl bg-black object-cover"
                    />
                    <Button className="w-full" onClick={snap}>
                      Take photo
                    </Button>
                  </div>
                )}
              </div>

              {state.mode === "manual" && (
                <>
                  <div>
                    <p className="mb-2 text-sm font-semibold">Skin tone</p>
                    <div className="flex flex-wrap gap-2">
                      {SKINS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className={`h-9 w-9 rounded-full border-2 transition ${
                            state.skin === c ? "border-primary scale-110" : "border-transparent"
                          }`}
                          style={{ background: c }}
                          onClick={() => setState((s) => ({ ...s, skin: c }))}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-semibold">Face shape</p>
                    <div className="flex flex-wrap gap-2">
                      {FACES.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          className={`rounded-xl border px-3 py-1.5 text-sm ${
                            state.face === f.id ? "border-primary bg-secondary" : "border-border"
                          }`}
                          onClick={() => setState((s) => ({ ...s, face: f.id }))}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-semibold">Eye color</p>
                    <div className="flex flex-wrap gap-2">
                      {EYES.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className={`h-8 w-8 rounded-full border-2 ${
                            state.eyes === c ? "border-primary" : "border-transparent"
                          }`}
                          style={{ background: c }}
                          onClick={() => setState((s) => ({ ...s, eyes: c }))}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {tab === "hair" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Hair shows in manual mode. Photo mode uses your real hair from the picture.
              </p>
              <div>
                <p className="mb-2 text-sm font-semibold">Style</p>
                <div className="flex flex-wrap gap-2">
                  {HAIRS.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      className={`rounded-xl border px-3 py-1.5 text-sm ${
                        state.hair === h.id ? "border-primary bg-secondary" : "border-border"
                      }`}
                      onClick={() => setState((s) => ({ ...s, mode: "manual", hair: h.id }))}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold">Color</p>
                <div className="flex flex-wrap gap-2">
                  {HAIR_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`h-9 w-9 rounded-full border-2 ${
                        state.hairColor === c ? "border-primary scale-110" : "border-transparent"
                      }`}
                      style={{ background: c }}
                      onClick={() => setState((s) => ({ ...s, hairColor: c }))}
                    >
                      <span className="sr-only">{c}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "style" && (
            <div>
              <p className="mb-2 text-sm font-semibold">Expression</p>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`rounded-xl border px-3 py-1.5 text-sm ${
                      state.mood === m.id ? "border-primary bg-secondary" : "border-border"
                    }`}
                    onClick={() => setState((s) => ({ ...s, mood: m.id }))}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === "store" && (
            <div>
              <h2 className="mb-3 font-bold">Outfits · 2 free · 8 paid</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {OUTFITS.map((item) => {
                  const owned = state.owned.includes(item.id);
                  const on = state.equipped === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`rounded-2xl border p-3 text-left transition hover:border-primary ${
                        on ? "border-primary bg-secondary" : "border-border"
                      }`}
                      onClick={() => buyOutfit(item.id, item.price)}
                    >
                      <div
                        className="mb-2 h-8 w-full rounded-lg"
                        style={{
                          background: `linear-gradient(135deg, ${item.color}, ${item.accent})`,
                        }}
                      />
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {owned ? (on ? "Equipped" : "Owned · Equip") : item.price === 0 ? "Free" : formatBucks(item.price)}
                      </p>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Balance: {formatBucks(me.data?.balance ?? 0)}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
