import { 
  Sun, 
  Wind, 
  Snowflake, 
  Battery, 
  Home, 
  Flame, 
  Zap, 
  FileText, 
  Window, 
  Award, 
  Droplet,
  TrendingUp,
  Euro,
  Clock
} from "lucide-react";

export const calculatorIcons = {
  zonnepanelen: { Icon: Sun, color: "text-yellow-500" },
  warmtepomp: { Icon: Wind, color: "text-blue-500" },
  airco: { Icon: Snowflake, color: "text-cyan-500" },
  thuisbatterij: { Icon: Battery, color: "text-green-500" },
  isolatie: { Icon: Home, color: "text-orange-500" },
  "cv-ketel": { Icon: Flame, color: "text-red-500" },
  laadpaal: { Icon: Zap, color: "text-purple-500" },
  energiecontract: { Icon: FileText, color: "text-indigo-500" },
  kozijnen: { Icon: Window, color: "text-teal-500" },
  energielabel: { Icon: Award, color: "text-pink-500" },
  boilers: { Icon: Droplet, color: "text-blue-400" },
};

export const resultIcons = {
  aantal: Sun,
  vermogen: Zap,
  opwekking: TrendingUp,
  besparing: Euro,
  verbruik: Battery,
  kosten: Euro,
  gas: Flame,
  stroom: Zap,
  co2: Wind,
  capaciteit: Battery,
  laadtijd: Clock,
  label: Award,
};

