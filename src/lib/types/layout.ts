export interface ChairCounts {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface Table {
  id: number;
  type: string;
  color: string;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  chairs: ChairCounts;
  info: string;
}

export interface Plant {
  id: number;
  type: string;
  color: string;
  plantType: string;
  x: number;
  y: number;
}

// Corresponds to your LayoutItem C# class
export interface LayoutItem {
  walls: any[];
  floors: any[];
  tables: Table[];
  plants: Plant[];
}

// Corresponds to your SaveLayoutRequest C# class
export interface SaveLayoutRequest {
  userId: string;
  version: number;
  restaurantId: number;
  layout: LayoutItem[]; // This is the structured array of objects
}
// src/lib/types.ts
export interface LoggedUser {
  id: string | null;
  name: string | null;
  isAuthenticated: boolean;
}
