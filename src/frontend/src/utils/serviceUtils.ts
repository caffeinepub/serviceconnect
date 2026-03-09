import { ServiceCategory } from "../backend";

export interface CategoryMeta {
  label: string;
  icon: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  description: string;
}

export const categoryMeta: Record<ServiceCategory, CategoryMeta> = {
  [ServiceCategory.nurse]: {
    label: "Medical Nurse",
    icon: "🏥",
    colorClass: "text-service-nurse",
    bgClass: "bg-service-nurse",
    borderClass: "border-service-nurse",
    description: "Healthcare & nursing services",
  },
  [ServiceCategory.plumber]: {
    label: "Plumber",
    icon: "🔧",
    colorClass: "text-service-plumber",
    bgClass: "bg-service-plumber",
    borderClass: "border-service-plumber",
    description: "Plumbing & pipe services",
  },
  [ServiceCategory.electrician]: {
    label: "Electrician",
    icon: "⚡",
    colorClass: "text-service-electrician",
    bgClass: "bg-service-electrician",
    borderClass: "border-service-electrician",
    description: "Electrical installation & repair",
  },
  [ServiceCategory.carpenter]: {
    label: "Carpenter",
    icon: "🪵",
    colorClass: "text-service-carpenter",
    bgClass: "bg-service-carpenter",
    borderClass: "border-service-carpenter",
    description: "Woodwork & carpentry",
  },
  [ServiceCategory.cleaner]: {
    label: "Cleaner",
    icon: "🧹",
    colorClass: "text-service-cleaner",
    bgClass: "bg-service-cleaner",
    borderClass: "border-service-cleaner",
    description: "Cleaning & housekeeping",
  },
  [ServiceCategory.painter]: {
    label: "Painter",
    icon: "🎨",
    colorClass: "text-service-painter",
    bgClass: "bg-service-painter",
    borderClass: "border-service-painter",
    description: "Painting & decorating",
  },
  [ServiceCategory.hvac]: {
    label: "HVAC",
    icon: "❄️",
    colorClass: "text-service-hvac",
    bgClass: "bg-service-hvac",
    borderClass: "border-service-hvac",
    description: "Heating, cooling & ventilation",
  },
  [ServiceCategory.other]: {
    label: "Other",
    icon: "🔨",
    colorClass: "text-service-other",
    bgClass: "bg-service-other",
    borderClass: "border-service-other",
    description: "Other professional services",
  },
};

export function getCategoryMeta(category: ServiceCategory): CategoryMeta {
  return categoryMeta[category] ?? categoryMeta[ServiceCategory.other];
}

export const allCategories = Object.values(
  ServiceCategory,
) as ServiceCategory[];
