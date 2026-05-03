"use client";

import { motion } from "motion/react";
import {
  Activity as Lu_Activity,
  AlertCircle as Lu_AlertCircle,
  ArrowLeftRight as Lu_ArrowLeftRight,
  ArrowRight as Lu_ArrowRight,
  Bell as Lu_Bell,
  Building2 as Lu_Building2,
  Calendar as Lu_Calendar,
  Check as Lu_Check,
  CheckCircle2 as Lu_CheckCircle2,
  Code2 as Lu_Code2,
  Database as Lu_Database,
  Download as Lu_Download,
  ExternalLink as Lu_ExternalLink,
  Globe as Lu_Globe,
  Globe2 as Lu_Globe2,
  HelpCircle as Lu_HelpCircle,
  Info as Lu_Info,
  Loader2 as Lu_Loader2,
  Menu as Lu_Menu,
  Moon as Lu_Moon,
  Play as Lu_Play,
  Plus as Lu_Plus,
  Search as Lu_Search,
  Server as Lu_Server,
  Share2 as Lu_Share2,
  ShieldAlert as Lu_ShieldAlert,
  ShieldCheck as Lu_ShieldCheck,
  ShieldX as Lu_ShieldX,
  Sun as Lu_Sun,
  X as Lu_X,
  type LucideIcon,
} from "lucide-react";

// Lucide icons wrapped with a Motion hover animation. Ships an animated
// feel inspired by lucide-animated.com across all 29 icons we actually use,
// without the npm package's 9-icon coverage limit.
//
// Animation: spring scale + tiny rotate on hover; auto-triggered when the
// nearest parent .group element hovers too (so an icon inside a hover
// button responds even if the cursor doesn't land on the icon itself).
//
// Usage (drop-in replacement):
//   import { Bell, Calendar, ArrowRight } from "@/components/ui/icons";
//   <Bell className="size-4" />
//
// Special cases:
//   - <Loader2 /> renders without the hover wrap so it can spin freely
//     via Tailwind's `animate-spin`.
//   - <Spinner /> exported as a friendlier name for Loader2.

type IconProps = React.SVGAttributes<SVGSVGElement> & {
  size?: number | string;
  className?: string;
  /** Disable the hover/group-hover animation (useful for static badges). */
  static?: boolean;
};

const HOVER_TRANSITION = { type: "spring", stiffness: 380, damping: 18 } as const;

// Tailwind classes that should apply to the inner SVG (sizing). Everything
// else lands on the wrapper so positioning utilities (absolute, top-,
// left-, translate-) resolve against the right element.
const SVG_CLASS_PATTERN = /^(size|w|h|min-w|min-h|max-w|max-h)-/;

function splitIconClasses(className: string | undefined): {
  wrapper: string;
  svg: string;
} {
  if (!className) return { wrapper: "", svg: "" };
  const parts = className.split(/\s+/).filter(Boolean);
  const svg: string[] = [];
  const wrapper: string[] = [];
  for (const cls of parts) {
    // Strip Tailwind-v4 modifier prefix (sm:, hover:, etc.) when checking
    // — we want size-3 AND sm:size-4 both routed to the SVG.
    const last = cls.split(":").at(-1) ?? cls;
    if (SVG_CLASS_PATTERN.test(last)) svg.push(cls);
    else wrapper.push(cls);
  }
  return { wrapper: wrapper.join(" "), svg: svg.join(" ") };
}

function makeAnimatedIcon(Icon: LucideIcon, displayName: string) {
  function AnimatedIcon({ size, className, static: isStatic, ...rest }: IconProps) {
    if (isStatic) {
      return <Icon size={size} className={className} {...rest} />;
    }
    // Sizing utilities (size-3, w-4, h-5, etc.) land on the SVG so the
    // icon is actually that size. Everything else (positioning, colour,
    // text-, hover-, etc.) lands on the wrapper so utilities like
    // `absolute top-1/2 -translate-y-1/2` resolve against the wrapper as
    // the actual DOM element being positioned.
    const { wrapper, svg } = splitIconClasses(className);
    return (
      <motion.span
        className={`inline-flex shrink-0 align-middle leading-none ${wrapper}`}
        whileHover={{ scale: 1.12, rotate: -4 }}
        whileTap={{ scale: 0.94 }}
        transition={HOVER_TRANSITION}
        style={{ transformOrigin: "center", display: "inline-flex" }}
      >
        <Icon
          size={size}
          className={`transition-transform duration-200 ease-out group-hover:scale-110 ${svg}`}
          {...rest}
        />
      </motion.span>
    );
  }
  AnimatedIcon.displayName = displayName;
  return AnimatedIcon;
}

// Plain pass-through (no hover wrap) for the spinner — Tailwind's
// animate-spin keeps it rotating continuously.
function PlainSpinner({ className, size = 16, ...rest }: IconProps) {
  return <Lu_Loader2 size={size} className={className} {...rest} />;
}
PlainSpinner.displayName = "Spinner";

export const Activity = makeAnimatedIcon(Lu_Activity, "Activity");
export const AlertCircle = makeAnimatedIcon(Lu_AlertCircle, "AlertCircle");
export const ArrowLeftRight = makeAnimatedIcon(Lu_ArrowLeftRight, "ArrowLeftRight");
export const ArrowRight = makeAnimatedIcon(Lu_ArrowRight, "ArrowRight");
export const Bell = makeAnimatedIcon(Lu_Bell, "Bell");
export const Building2 = makeAnimatedIcon(Lu_Building2, "Building2");
export const Calendar = makeAnimatedIcon(Lu_Calendar, "Calendar");
export const Check = makeAnimatedIcon(Lu_Check, "Check");
export const CheckCircle2 = makeAnimatedIcon(Lu_CheckCircle2, "CheckCircle2");
export const Code2 = makeAnimatedIcon(Lu_Code2, "Code2");
export const Database = makeAnimatedIcon(Lu_Database, "Database");
export const Download = makeAnimatedIcon(Lu_Download, "Download");
export const ExternalLink = makeAnimatedIcon(Lu_ExternalLink, "ExternalLink");
export const Globe = makeAnimatedIcon(Lu_Globe, "Globe");
export const Globe2 = makeAnimatedIcon(Lu_Globe2, "Globe2");
export const HelpCircle = makeAnimatedIcon(Lu_HelpCircle, "HelpCircle");
export const Info = makeAnimatedIcon(Lu_Info, "Info");
export const Loader2 = PlainSpinner;
export const Spinner = PlainSpinner;
export const Menu = makeAnimatedIcon(Lu_Menu, "Menu");
export const Moon = makeAnimatedIcon(Lu_Moon, "Moon");
export const Play = makeAnimatedIcon(Lu_Play, "Play");
export const Plus = makeAnimatedIcon(Lu_Plus, "Plus");
export const Search = makeAnimatedIcon(Lu_Search, "Search");
export const Server = makeAnimatedIcon(Lu_Server, "Server");
export const Share2 = makeAnimatedIcon(Lu_Share2, "Share2");
export const ShieldAlert = makeAnimatedIcon(Lu_ShieldAlert, "ShieldAlert");
export const ShieldCheck = makeAnimatedIcon(Lu_ShieldCheck, "ShieldCheck");
export const ShieldX = makeAnimatedIcon(Lu_ShieldX, "ShieldX");
export const Sun = makeAnimatedIcon(Lu_Sun, "Sun");
export const X = makeAnimatedIcon(Lu_X, "X");
