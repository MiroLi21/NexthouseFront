import type { IService } from "./IService";

export interface ISubcategory {
  id: number;
  name: string;
  service_id: number;
  service?: IService | null;
}
