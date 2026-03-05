import type { ISubcategory } from "./ISubcategory";

export interface IProject {
  id: number;
  image_url: string;
  description: string | null;
  category_id: number;
  category?: ISubcategory | null;
}
