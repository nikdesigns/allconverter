export type ToolCategory =
  | "pdf-tools"
  | "image-tools"
  | "text-tools"
  | "developer-tools"
  | "seo-tools"
  | "calculators"
  | "unit-converters"
  | "ai-tools"
  | "business-tools"
  | "color-tools"
  | "audio-tools";

export interface Tool {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  icon: string;
  tags: string[];
  isNew?: boolean;
  isTrending?: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  relatedTools?: string[];
  faqs?: FAQ[];
  howTo?: HowToStep[];
  useCases?: string[];
  benefits?: string[];
}

export interface ToolCategory_Data {
  slug: ToolCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  toolCount?: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface HowToStep {
  title: string;
  description: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface SearchResult {
  tool: Tool;
  score: number;
}
