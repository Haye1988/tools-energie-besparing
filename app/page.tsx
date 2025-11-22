"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  Sun, 
  Wind, 
  Snowflake, 
  Battery, 
  Home as HomeIcon, 
  Flame, 
  Zap, 
  FileText, 
  Square as WindowIcon, 
  Award, 
  Droplet 
} from "lucide-react";

const tools = [
  { 
    name: "Zonnepanelen", 
    href: "/zonnepanelen", 
    description: "Bereken je zonnepanelen opbrengst en besparing",
    icon: Sun,
    color: "text-yellow-500"
  },
  { 
    name: "Warmtepomp", 
    href: "/warmtepomp", 
    description: "Ontdek hoeveel je bespaart met een warmtepomp",
    icon: Wind,
    color: "text-blue-500"
  },
  { 
    name: "Airconditioning", 
    href: "/airco", 
    description: "Bereken het benodigde koelvermogen",
    icon: Snowflake,
    color: "text-cyan-500"
  },
  { 
    name: "Thuisbatterij", 
    href: "/thuisbatterij", 
    description: "Optimaliseer je zelfconsumptie",
    icon: Battery,
    color: "text-green-500"
  },
  { 
    name: "Isolatie", 
    href: "/isolatie", 
    description: "Bereken isolatie besparingen",
    icon: HomeIcon,
    color: "text-orange-500"
  },
  { 
    name: "CV-Ketel", 
    href: "/cv-ketel", 
    description: "Vervangingsadvies en besparing",
    icon: Flame,
    color: "text-red-500"
  },
  { 
    name: "Laadpaal", 
    href: "/laadpaal", 
    description: "Bereken laadpaal capaciteit en kosten",
    icon: Zap,
    color: "text-purple-500"
  },
  { 
    name: "Energiecontract", 
    href: "/energiecontract", 
    description: "Vergelijk energiecontracten",
    icon: FileText,
    color: "text-indigo-500"
  },
  { 
    name: "Kozijnen", 
    href: "/kozijnen", 
    description: "Bereken besparing met nieuwe kozijnen",
    icon: WindowIcon,
    color: "text-teal-500"
  },
  { 
    name: "Energielabel", 
    href: "/energielabel", 
    description: "Bereken je energielabel",
    icon: Award,
    color: "text-pink-500"
  },
  { 
    name: "Boilers", 
    href: "/boilers", 
    description: "Boiler advies en dimensionering",
    icon: Droplet,
    color: "text-blue-400"
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-primary">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <Image
              src="/totaaladvies-logo.png"
              alt="Totaaladvies"
              width={200}
              height={45}
              className="h-10 w-auto"
              priority
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-container px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-totaaladvies-blue mb-6">
            Energie Besparing Tools
          </h1>
          <p className="text-xl md:text-2xl text-totaaladvies-gray-medium max-w-3xl mx-auto">
            Bereken je persoonlijke energiebesparing met onze interactieve calculators
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="card-hover bg-white rounded-card border border-gray-100 p-6 lg:p-8 shadow-card group animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`${tool.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold text-totaaladvies-blue mb-2 group-hover:text-totaaladvies-orange transition-colors">
                  {tool.name}
                </h2>
                <p className="text-totaaladvies-gray-medium text-sm leading-relaxed">
                  {tool.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

