import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Gamepad2, Heart, Moon, RotateCcw, Star, Sun, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeading } from "@/components/shell";
import { Button } from "@/components/ui";

export const Route = createFileRoute("/_app/games")({
  component: GamesPage,
  head: () => ({ meta: [{ title: "Games — JayTalk" }] }),
});

const icons: LucideIcon[] = [Sun, Moon, Heart, Star, Zap, Gamepad2];

function shuffle() {
  return [...icons, ...icons].map((icon) => ({ icon, r: Math.random() })).sort((a, b) => a.r - b.r).map((item) => item.icon);
}

function GamesPage() {
  const [cards, setCards] = useState<LucideIcon[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [found, setFound] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    setCards(shuffle());
    const saved = localStorage.getItem("jaytalk-memory-best");
    if (saved) setBest(Number(saved));
  }, []);

  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open;
    const timer = window.setTimeout(() => {
      if (cards[a!] === cards[b!]) setFound((current) => [...current, a!, b!]);
      setOpen([]);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [open, cards]);

  const won = cards.length > 0 && found.length === cards.length;
  useEffect(() => {
    if (!won) return;
    if (best === null || moves < best) {
      setBest(moves);
      localStorage.setItem("jaytalk-memory-best", String(moves));
    }
  }, [won, best, moves]);

  function flip(index: number) {
    if (open.length === 2 || open.includes(index) || found.includes(index)) return;
    if (open.length === 1) setMoves((m) => m + 1);
    setOpen((current) => [...current, index]);
  }

  return (
    <div className="max-w-md">
      <PageHeading title="Games" subtitle="Memory match. Find every pair in as few moves as you can." />
      <div className="mb-4 flex items-center justify-between text-sm">
        <span>Moves: <b>{moves}</b>{best !== null && <span className="text-muted-foreground"> · Best {best}</span>}</span>
        <Button variant="outline" onClick={() => { setCards(shuffle()); setOpen([]); setFound([]); setMoves(0); }}><RotateCcw className="size-4" /> Restart</Button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {cards.map((Icon, index) => {
          const shown = open.includes(index) || found.includes(index);
          return (
            <button key={index} type="button" aria-label={shown ? "Card" : "Hidden card"} className={`grid aspect-square place-items-center rounded-2xl ${shown ? "bg-secondary text-primary" : "bg-primary text-primary-foreground"}`} onClick={() => flip(index)}>
              {shown ? <Icon /> : <Gamepad2 />}
            </button>
          );
        })}
      </div>
      {won && <p className="mt-5 font-semibold text-primary">You found every pair in {moves} moves.</p>}
    </div>
  );
}
