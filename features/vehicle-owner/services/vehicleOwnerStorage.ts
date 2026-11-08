
import type { VehicleOwner } from '../types/vehicleOwner';

const STORAGE_KEY = 'tqms_vehicle_owners';

export function getVehicleOwners(): VehicleOwner[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const savedRaw = localStorage.getItem(STORAGE_KEY);

    if (!savedRaw) return [];

    const parsed = JSON.parse(savedRaw);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading vehicle owners:', error);
    return [];
  }
}

export function saveVehicleOwner(
  ownerData: Omit<VehicleOwner, 'id'>
): VehicleOwner {
  const currentList = getVehicleOwners();

  const nextId =
    currentList.length > 0
      ? Math.max(
          ...currentList.map((owner) => Number(owner.id) || 0)
        ) + 1
      : 1;

  const newOwner: VehicleOwner = {
    id: nextId,
    ...ownerData,
  };

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...currentList, newOwner])
    );
  } catch (error) {
    console.error('Error saving vehicle owner:', error);
    throw new Error(
      'Unable to save. The uploaded files may be too large for browser storage.'
    );
  }

  return newOwner;
}
export function updateVehicleOwner(
  id: number,
  ownerData: Omit<VehicleOwner, 'id'>
): VehicleOwner | null {
  const currentList = getVehicleOwners();

  const ownerExists = currentList.some(
    (owner) => Number(owner.id) === Number(id)
  );

  if (!ownerExists) return null;

  const updatedOwner: VehicleOwner = {
    id,
    ...ownerData,
  };

  const updatedList = currentList.map((owner) =>
    Number(owner.id) === Number(id) ? updatedOwner : owner
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedList)
  );

  return updatedOwner;
}