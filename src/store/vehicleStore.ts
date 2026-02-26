import { create } from 'zustand';

import { VehicleType } from '@/types/report';

interface VehicleState {
  vehicleType: VehicleType;
  setVehicleType: (value: VehicleType) => void;
}

export const useVehicleStore = create<VehicleState>((set) => ({
  vehicleType: 'carro-bajo',
  setVehicleType: (value) => set({ vehicleType: value })
}));
