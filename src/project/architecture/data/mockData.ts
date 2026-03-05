import type { IService } from "../types/IService";
import type { ISubcategory } from "../types/ISubcategory";
import type { IProject } from "../types/IProject";

// ─── Mock Services ───────────────────────────────────────────────────────────
export const mockServices: IService[] = [
  { id: 1, name: "غرف", icon_url: null },
  { id: 2, name: "مطابخ", icon_url: null },
  { id: 3, name: "لوندري", icon_url: null },
  { id: 4, name: "منازل", icon_url: null },
];

// ─── Mock Subcategories ───────────────────────────────────────────────────────
export const mockSubcategories: ISubcategory[] = [
  // Rooms
  { id: 1, name: "كلاسيك", service_id: 1 },
  { id: 2, name: "مودرن", service_id: 1 },
  { id: 3, name: "نيو كلاسيك", service_id: 1 },
  // Kitchens
  { id: 4, name: "كلاسيك", service_id: 2 },
  { id: 5, name: "مودرن", service_id: 2 },
  { id: 6, name: "نيو كلاسيك", service_id: 2 },
  // Laundry
  { id: 7, name: "كلاسيك", service_id: 3 },
  { id: 8, name: "مودرن", service_id: 3 },
  { id: 9, name: "نيو كلاسيك", service_id: 3 },
  // Houses
  { id: 10, name: "كلاسيك", service_id: 4 },
  { id: 11, name: "مودرن", service_id: 4 },
  { id: 12, name: "نيو كلاسيك", service_id: 4 },
];

// ─── Mock Projects ────────────────────────────────────────────────────────────
// Using high-quality Unsplash images for realistic preview
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
];

function generateProjects(categoryId: number, startId: number): IProject[] {
  return PLACEHOLDER_IMAGES.map((url, i) => ({
    id: startId + i,
    image_url: url,
    description: `تصميم ${i + 1} — مشروع متميز`,
    category_id: categoryId,
  }));
}

export const mockProjects: IProject[] = [
  ...generateProjects(1, 100),
  ...generateProjects(2, 108),
  ...generateProjects(3, 116),
  ...generateProjects(4, 124),
  ...generateProjects(5, 132),
  ...generateProjects(6, 140),
  ...generateProjects(7, 148),
  ...generateProjects(8, 156),
  ...generateProjects(9, 164),
  ...generateProjects(10, 172),
  ...generateProjects(11, 180),
  ...generateProjects(12, 188),
];
