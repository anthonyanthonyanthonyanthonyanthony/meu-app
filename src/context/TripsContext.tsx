import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

export type Trip = {
  id: string;
  user: string;
  nomeLocal: string;
  fotoUri: string;
  latitude: number;
  longitude: number;
  data: string;
};

type AddTripInput = Omit<Trip, "id">;

type TripsContextType = {
  trips: Trip[];
  addTrip: (trip: AddTripInput) => void;
  removeTrip: (id: string) => void;
  editTrip: (id: string, newName: string) => void;
  clearTripsForUser: (user: string) => void;
};

const TripsContext = createContext<TripsContextType | undefined>(undefined);

export const TripsProvider = ({ children }: { children: React.ReactNode }) => {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("@meuapp:trips");
        if (saved) setTrips(JSON.parse(saved));
      } catch (e) {
        console.log("Erro ao carregar viagens:", e);
      }
    })();
  }, []);

  async function save(newTrips: Trip[]) {
    setTrips(newTrips);
    await AsyncStorage.setItem("@meuapp:trips", JSON.stringify(newTrips));
  }

  function addTrip(trip: AddTripInput) {
    const nova = { id: uuid.v4().toString(), ...trip };
    save([...trips, nova]);
  }

  function removeTrip(id: string) {
    save(trips.filter((t) => t.id !== id));
  }

  function editTrip(id: string, newName: string) {
    save(
      trips.map((t) =>
        t.id === id ? { ...t, nomeLocal: newName } : t
      )
    );
  }

  function clearTripsForUser(user: string) {
    const updated = trips.filter((t) => t.user !== user);
    save(updated);
  }

  return (
    <TripsContext.Provider
      value={{
        trips,
        addTrip,
        removeTrip,
        editTrip,
        clearTripsForUser,
      }}
    >
      {children}
    </TripsContext.Provider>
  );
};

export function useTrips() {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error("useTrips deve ser usado dentro de TripsProvider");
  return ctx;
}
