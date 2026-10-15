"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group } from "three";

export type AvatarLook = {
  skin: string;
  hair: string;
  hairStyle: "short" | "afro" | "long" | "bun" | "fade";
  eyes: string;
  faceShape: "round" | "oval" | "square";
  top: string;
  bottom: string;
  shoes: string;
  accessory: string;
  mood: "neutral" | "happy" | "cool" | "wink" | "smile";
  pet: string;
};

export const DEFAULT_LOOK: AvatarLook = {
  skin: "#c68642",
  hair: "#1f130c",
  hairStyle: "short",
  eyes: "#2c1810",
  faceShape: "oval",
  top: "basic-tee",
  bottom: "basic-jeans",
  shoes: "basic-sneakers",
  accessory: "none",
  mood: "neutral",
  pet: "none",
};

/** 10 outfits: 2 free + 8 paid. Tops define the main clothing pack. */
export const OUTFITS = [
  { id: "basic-tee", name: "Basic Tee", price: 0, color: "#f3f4f6", accent: "#9ca3af", free: true },
  { id: "basic-hoodie", name: "Basic Hoodie", price: 0, color: "#111827", accent: "#374151", free: true },
  { id: "street-jacket", name: "Street Jacket", price: 1200, color: "#1e3a8a", accent: "#60a5fa", free: false },
  { id: "denim-fit", name: "Denim Fit", price: 1500, color: "#1d4ed8", accent: "#93c5fd", free: false },
  { id: "sport-set", name: "Sport Set", price: 1800, color: "#059669", accent: "#6ee7b7", free: false },
  { id: "school-look", name: "School Look", price: 2000, color: "#7c2d12", accent: "#fdba74", free: false },
  { id: "winter-coat", name: "Winter Coat", price: 2500, color: "#0f172a", accent: "#64748b", free: false },
  { id: "royal-fit", name: "Royal Fit", price: 3500, color: "#7c3aed", accent: "#c4b5fd", free: false },
  { id: "party-fit", name: "Party Fit", price: 4000, color: "#be185d", accent: "#f9a8d4", free: false },
  { id: "legend-fit", name: "Legend Fit", price: 5000, color: "#b45309", accent: "#fcd34d", free: false },
] as const;

export const BOTTOMS = [
  { id: "basic-jeans", name: "Basic Jeans", price: 0, color: "#1e3a8a" },
  { id: "black-pants", name: "Black Pants", price: 800, color: "#111827" },
  { id: "sport-shorts", name: "Sport Shorts", price: 900, color: "#047857" },
  { id: "royal-slacks", name: "Royal Slacks", price: 1500, color: "#4c1d95" },
] as const;

export const SHOES = [
  { id: "basic-sneakers", name: "Sneakers", price: 0, color: "#e5e7eb" },
  { id: "high-tops", name: "High Tops", price: 1000, color: "#1f2937" },
  { id: "gold-kicks", name: "Gold Kicks", price: 2200, color: "#d97706" },
] as const;

export const ACCESSORIES = [
  { id: "none", name: "None", price: 0 },
  { id: "cap", name: "Cap", price: 700 },
  { id: "glasses", name: "Glasses", price: 900 },
  { id: "headphones", name: "Headphones", price: 1400 },
  { id: "chain", name: "Gold Chain", price: 2000 },
] as const;

export const PETS = [
  { id: "none", name: "No pet", price: 0, emoji: "" },
  { id: "dog", name: "Golden pup", price: 2500, emoji: "🐶" },
  { id: "cat", name: "Cool cat", price: 2500, emoji: "🐱" },
  { id: "bunny", name: "Bunny", price: 2000, emoji: "🐰" },
  { id: "dragon", name: "Mini dragon", price: 5000, emoji: "🐉" },
] as const;

export const SKINS = ["#f6d7c3", "#e0ac69", "#c68642", "#8d5524", "#5c3317", "#3b2219"];
export const HAIRS = ["#1f130c", "#3b2314", "#6b3e26", "#d4a017", "#111827", "#7c2d12", "#f5f5f4"];
export const EYES = ["#2c1810", "#1e3a5f", "#3f6212", "#4a044e", "#0f172a"];

function outfitColor(id: string) {
  return OUTFITS.find((o) => o.id === id)?.color ?? "#f3f4f6";
}
function outfitAccent(id: string) {
  return OUTFITS.find((o) => o.id === id)?.accent ?? "#9ca3af";
}
function bottomColor(id: string) {
  return BOTTOMS.find((b) => b.id === id)?.color ?? "#1e3a8a";
}
function shoeColor(id: string) {
  return SHOES.find((s) => s.id === id)?.color ?? "#e5e7eb";
}

function Character({ look }: { look: AvatarLook }) {
  const group = useRef<Group>(null);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.35;
  });

  const headScale =
    look.faceShape === "round" ? [1.05, 1.0, 1.05] : look.faceShape === "square" ? [1.0, 0.95, 1.0] : [0.95, 1.05, 0.95];

  const smileY = look.mood === "happy" || look.mood === "smile" ? -0.02 : 0;
  const leftEyeOpen = look.mood === "wink" ? 0.02 : 0.06;
  const rightEyeOpen = 0.06;

  const hairMeshes = useMemo(() => {
    if (look.hairStyle === "afro") {
      return (
        <mesh position={[0, 1.55, 0]}>
          <sphereGeometry args={[0.42, 24, 24]} />
          <meshStandardMaterial color={look.hair} roughness={0.9} />
        </mesh>
      );
    }
    if (look.hairStyle === "long") {
      return (
        <>
          <mesh position={[0, 1.48, -0.05]}>
            <sphereGeometry args={[0.34, 20, 20]} />
            <meshStandardMaterial color={look.hair} />
          </mesh>
          <mesh position={[0, 1.15, -0.12]}>
            <boxGeometry args={[0.38, 0.55, 0.12]} />
            <meshStandardMaterial color={look.hair} />
          </mesh>
        </>
      );
    }
    if (look.hairStyle === "bun") {
      return (
        <>
          <mesh position={[0, 1.48, 0]}>
            <sphereGeometry args={[0.32, 20, 20]} />
            <meshStandardMaterial color={look.hair} />
          </mesh>
          <mesh position={[0, 1.78, 0]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color={look.hair} />
          </mesh>
        </>
      );
    }
    if (look.hairStyle === "fade") {
      return (
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.3, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color={look.hair} />
        </mesh>
      );
    }
    // short
    return (
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.32, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
        <meshStandardMaterial color={look.hair} />
      </mesh>
    );
  }, [look.hair, look.hairStyle]);

  const topColor = outfitColor(look.top);
  const topAccent = outfitAccent(look.top);
  const isHoodie = look.top.includes("hoodie") || look.top.includes("winter") || look.top.includes("jacket");
  const isLegend = look.top === "legend-fit" || look.top === "royal-fit" || look.top === "party-fit";

  return (
    <group ref={group} position={[0, -0.9, 0]}>
      {/* legs */}
      <mesh position={[-0.14, 0.35, 0]}>
        <capsuleGeometry args={[0.09, 0.35, 6, 12]} />
        <meshStandardMaterial color={bottomColor(look.bottom)} />
      </mesh>
      <mesh position={[0.14, 0.35, 0]}>
        <capsuleGeometry args={[0.09, 0.35, 6, 12]} />
        <meshStandardMaterial color={bottomColor(look.bottom)} />
      </mesh>
      {/* shoes */}
      <mesh position={[-0.14, 0.05, 0.04]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[0.16, 0.1, 0.26]} />
        <meshStandardMaterial color={shoeColor(look.shoes)} />
      </mesh>
      <mesh position={[0.14, 0.05, 0.04]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[0.16, 0.1, 0.26]} />
        <meshStandardMaterial color={shoeColor(look.shoes)} />
      </mesh>
      {/* torso */}
      <mesh position={[0, 0.85, 0]}>
        <capsuleGeometry args={[0.22, 0.45, 8, 16]} />
        <meshStandardMaterial color={topColor} metalness={isLegend ? 0.35 : 0.05} roughness={0.55} />
      </mesh>
      {isHoodie && (
        <mesh position={[0, 1.12, -0.08]}>
          <sphereGeometry args={[0.2, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color={topAccent} />
        </mesh>
      )}
      {/* arms */}
      <mesh position={[-0.32, 0.9, 0]} rotation={[0, 0, 0.25]}>
        <capsuleGeometry args={[0.07, 0.38, 6, 10]} />
        <meshStandardMaterial color={topColor} />
      </mesh>
      <mesh position={[0.32, 0.9, 0]} rotation={[0, 0, -0.25]}>
        <capsuleGeometry args={[0.07, 0.38, 6, 10]} />
        <meshStandardMaterial color={topColor} />
      </mesh>
      {/* hands */}
      <mesh position={[-0.38, 0.58, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color={look.skin} />
      </mesh>
      <mesh position={[0.38, 0.58, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color={look.skin} />
      </mesh>
      {/* neck */}
      <mesh position={[0, 1.22, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.12, 12]} />
        <meshStandardMaterial color={look.skin} />
      </mesh>
      {/* head */}
      <mesh position={[0, 1.42, 0]} scale={headScale as [number, number, number]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color={look.skin} roughness={0.7} />
      </mesh>
      {/* eyes */}
      <mesh position={[-0.09, 1.46, 0.24]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.09, 1.46, 0.24]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.09, 1.46, 0.28]} scale={[1, leftEyeOpen / 0.06, 1]}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshStandardMaterial color={look.eyes} />
      </mesh>
      <mesh position={[0.09, 1.46, 0.28]} scale={[1, rightEyeOpen / 0.06, 1]}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshStandardMaterial color={look.eyes} />
      </mesh>
      {/* mouth */}
      <mesh position={[0, 1.32 + smileY, 0.25]} rotation={[0.2, 0, 0]}>
        <torusGeometry
          args={[
            0.06,
            0.012,
            8,
            16,
            look.mood === "happy" || look.mood === "smile" ? Math.PI : Math.PI * 0.6,
          ]}
        />
        <meshStandardMaterial color="#7f1d1d" />
      </mesh>
      {/* hair */}
      {hairMeshes}
      {/* accessories */}
      {look.accessory === "cap" && (
        <>
          <mesh position={[0, 1.62, 0.02]}>
            <cylinderGeometry args={[0.28, 0.3, 0.12, 20]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
          <mesh position={[0, 1.56, 0.22]} rotation={[-0.4, 0, 0]}>
            <boxGeometry args={[0.32, 0.04, 0.18]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
        </>
      )}
      {look.accessory === "glasses" && (
        <>
          <mesh position={[-0.1, 1.46, 0.3]}>
            <torusGeometry args={[0.06, 0.012, 8, 16]} />
            <meshStandardMaterial color="#111827" metalness={0.6} />
          </mesh>
          <mesh position={[0.1, 1.46, 0.3]}>
            <torusGeometry args={[0.06, 0.012, 8, 16]} />
            <meshStandardMaterial color="#111827" metalness={0.6} />
          </mesh>
          <mesh position={[0, 1.46, 0.3]}>
            <boxGeometry args={[0.06, 0.01, 0.01]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
        </>
      )}
      {look.accessory === "headphones" && (
        <>
          <mesh position={[-0.28, 1.42, 0]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
          <mesh position={[0.28, 1.42, 0]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
          <mesh position={[0, 1.58, 0]}>
            <torusGeometry args={[0.28, 0.025, 8, 24, Math.PI]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
        </>
      )}
      {look.accessory === "chain" && (
        <mesh position={[0, 1.18, 0.18]}>
          <torusGeometry args={[0.12, 0.018, 8, 24]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
        </mesh>
      )}
      {/* pet */}
      {look.pet !== "none" && (
        <group position={[0.55, 0.25, 0.2]}>
          <mesh>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial
              color={
                look.pet === "dog"
                  ? "#d4a574"
                  : look.pet === "cat"
                    ? "#9ca3af"
                    : look.pet === "dragon"
                      ? "#059669"
                      : "#f5d0c5"
              }
            />
          </mesh>
          <mesh position={[0.08, 0.1, 0.08]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial
              color={
                look.pet === "dog"
                  ? "#d4a574"
                  : look.pet === "cat"
                    ? "#9ca3af"
                    : look.pet === "dragon"
                      ? "#059669"
                      : "#f5d0c5"
              }
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

export function Avatar3DPreview({ look, className }: { look: AvatarLook; className?: string }) {
  return (
    <div className={className ?? "h-72 w-full overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-500/20 via-violet-500/10 to-background"}>
      <Canvas camera={{ position: [0, 0.6, 3.2], fov: 40 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 5, 2]} intensity={1.1} />
        <directionalLight position={[-2, 2, -1]} intensity={0.35} />
        <Character look={look} />
        <OrbitControls enablePan={false} minDistance={2.2} maxDistance={4.5} maxPolarAngle={Math.PI / 1.7} />
      </Canvas>
    </div>
  );
}
