export const TEMPLATE_CATEGORIES = ["Buttons", "Backgrounds", "Cards", "Icons"] as const;

export type TemplateCategory = typeof TEMPLATE_CATEGORIES[number];
export const TEMPLATES = [
  { 
    id: "galaxy", 
    title: "Galaxy Star Field", 
    category: "Backgrounds", 
    image: "/images/galaxy-preview.png", 
    path: "/template/GalaxyStarField"   
  },
  { 
    id: "text-3d", 
    title: "Text 3D", 
    category: "Backgrounds", 
    image: "/images/text3d-preview.png", 
    path: "/template/Text3D" 
  },
];