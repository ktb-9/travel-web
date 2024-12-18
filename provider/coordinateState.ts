import { create } from "zustand";

interface Coordinate {
  x: number;
  y: number;
}

interface CoordinateState {
  coordinates: Coordinate[];
  setCoordinates: (newCoordinates: Coordinate[]) => void;
  addCoordinate: (coordinate: Coordinate) => void;
  clearCoordinates: () => void;
}

const useCoordinateStore = create<CoordinateState>((set) => ({
  coordinates: [],
  setCoordinates: (newCoordinates) => set({ coordinates: newCoordinates }),
  addCoordinate: (coordinate) =>
    set((state) => ({ coordinates: [...state.coordinates, coordinate] })),
  clearCoordinates: () => set({ coordinates: [] }),
}));

export default useCoordinateStore;
