import type { CSSProperties } from "react";
import {
  Allura,
  Caveat,
  Dancing_Script,
  Great_Vibes,
  Pacifico,
} from "next/font/google";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });
const dancingScript = Dancing_Script({ weight: ["500", "600"], subsets: ["latin"] });
const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });
const allura = Allura({ weight: "400", subsets: ["latin"] });
const caveat = Caveat({ weight: ["500", "600"], subsets: ["latin"] });

export type SignatureFontId =
  | "classic"
  | "elegant"
  | "script"
  | "pacific"
  | "allura"
  | "caveat";

export const SIGNATURE_FONTS: {
  id: SignatureFontId;
  label: string;
  className: string;
  style?: CSSProperties;
}[] = [
  {
    id: "classic",
    label: "Clássica",
    className: "",
    style: { fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" },
  },
  { id: "elegant", label: "Elegante", className: greatVibes.className },
  { id: "script", label: "Manuscrita", className: dancingScript.className },
  { id: "pacific", label: "Fluida", className: pacifico.className },
  { id: "allura", label: "Caligráfica", className: allura.className },
  { id: "caveat", label: "Natural", className: caveat.className },
];

export function getSignatureFont(id: SignatureFontId) {
  return SIGNATURE_FONTS.find((f) => f.id === id) ?? SIGNATURE_FONTS[0];
}
