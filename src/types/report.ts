export type WaterLevel = 'green' | 'yellow' | 'red';
export type VehicleType = 'carro-bajo' | 'jeepeta' | 'camion' | 'motor';

export interface FloodReport {
  id: string;
  latitude: number;
  longitude: number;
  waterLevel: WaterLevel;
  recommendedVehicles: VehicleType[];
  photoUrl?: string;
  comment?: string;
  createdAt: number;
  confirms: number;
  rejects: number;
}
