import {
  Activity,
  Baby,
  Bandage,
  Bone,
  Brain,
  BrainCircuit,
  Droplet,
  Ear,
  Flower2,
  Heart,
  HeartHandshake,
  HeartPulse,
  Ribbon,
  Sparkles,
  Stethoscope,
  Thermometer,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Condition, Specialization } from "./constants";

/**
 * Icon + tint per category. The label is always shown next to the icon, so
 * colour is decorative, never the only way to identify a category.
 */
export interface IconStyle {
  icon: LucideIcon;
  tone: string;
}

export const CONDITION_ICONS: Record<Condition, IconStyle> = {
  Hypertension: { icon: Activity, tone: "bg-emerald-50 text-emerald-700" },
  Fever: { icon: Thermometer, tone: "bg-orange-50 text-orange-700" },
  Diabetes: { icon: Droplet, tone: "bg-rose-50 text-rose-700" },
  Depression: { icon: Brain, tone: "bg-indigo-50 text-indigo-700" },
  Asthma: { icon: Wind, tone: "bg-sky-50 text-sky-700" },
  "Skin Allergy": { icon: Sparkles, tone: "bg-fuchsia-50 text-fuchsia-700" },
  Migraine: { icon: Zap, tone: "bg-amber-50 text-amber-700" },
  "Heart Disease": { icon: Heart, tone: "bg-red-50 text-red-700" },
  Arthritis: { icon: Bone, tone: "bg-blue-50 text-blue-700" },
  Fracture: { icon: Bandage, tone: "bg-teal-50 text-teal-700" },
};

export const SPECIALIZATION_ICONS: Record<Specialization, IconStyle> = {
  "General Medicine": { icon: Stethoscope, tone: "bg-blue-50 text-blue-700" },
  Cardiology: { icon: HeartPulse, tone: "bg-red-50 text-red-700" },
  Pediatrics: { icon: Baby, tone: "bg-sky-50 text-sky-700" },
  Dermatology: { icon: Sparkles, tone: "bg-orange-50 text-orange-700" },
  Gynecology: { icon: Flower2, tone: "bg-pink-50 text-pink-700" },
  ENT: { icon: Ear, tone: "bg-amber-50 text-amber-700" },
  Neurology: { icon: BrainCircuit, tone: "bg-indigo-50 text-indigo-700" },
  Oncology: { icon: Ribbon, tone: "bg-violet-50 text-violet-700" },
  Orthopedics: { icon: Bone, tone: "bg-slate-100 text-slate-700" },
  Psychiatry: { icon: HeartHandshake, tone: "bg-emerald-50 text-emerald-700" },
};
