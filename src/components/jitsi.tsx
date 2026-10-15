import { useEffect, useState } from "react";
import { Mic, MicOff, PhoneOff, Video, VideoOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui";

export function CallFrame({ room, onClose, name = "JayTalk call" }: { room: string; onClose: () => void; name?: string }) {
  const href = `https://meet.jit.si/${encodeURIComponent(room)}`;
  const [phase, setPhase] = useState<"ring" | "live">("ring");
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase("live"), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white">
      <header className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/60">Calling</p>
          <p className="font-bold">{name}</p>
        </div>
        <Button variant="ghost" className="text-white" onClick={onClose}>Close</Button>
      </header>
      <div className="relative min-h-0 flex-1">
        {phase === "ring" ? (
          <div className="grid h-full place-items-center">
            <div className="text-center">
              <div className="relative mx-auto grid size-28 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
                <span className="absolute inset-3 animate-pulse rounded-full bg-primary/60" />
                <Volume2 className="relative size-10" />
              </div>
              <p className="mt-6 text-xl font-extrabold">Ringing…</p>
              <p className="mt-1 text-sm text-white/70">Connecting your call</p>
            </div>
          </div>
        ) : (
          <iframe title="JayTalk call" className="h-full w-full border-0" allow="camera; microphone; fullscreen; display-capture; autoplay" src={`${href}#config.prejoinPageEnabled=false&config.startWithAudioMuted=${!mic}&config.startWithVideoMuted=${!cam}`} />
        )}
      </div>
      <div className="grid grid-cols-4 gap-2 border-t border-white/10 bg-slate-900/95 p-3">
        <button type="button" className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 py-3 text-xs" onClick={() => setMic((v) => !v)}>
          {mic ? <Mic className="size-5" /> : <MicOff className="size-5" />} {mic ? "Mute" : "Unmute"}
        </button>
        <button type="button" className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 py-3 text-xs" onClick={() => setCam((v) => !v)}>
          {cam ? <Video className="size-5" /> : <VideoOff className="size-5" />} {cam ? "Camera" : "Cam off"}
        </button>
        <a href={href} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 py-3 text-xs">Open</a>
        <button type="button" className="flex flex-col items-center gap-1 rounded-2xl bg-red-600 py-3 text-xs font-semibold" onClick={onClose}>
          <PhoneOff className="size-5" /> End
        </button>
      </div>
    </div>
  );
}
