"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface Store {
  id: string;
  name: string;
  category: string | null;
  address: string | null;
  phone: string | null;
  description: string | null;
  googleReviewUrl: string | null;
  googleMapsUrl: string | null;
  googleConnected: boolean;
  notifyEmail: string | null;
  notifyThreshold: number;
  googleRedirectThreshold: number;
  isActive: boolean;
  _count?: { reviews: number };
}

interface StoreContextValue {
  stores: Store[];
  selectedStore: Store | null;
  setSelectedStoreId: (id: string) => void;
  loading: boolean;
  refetch: () => void;
}

const StoreContext = createContext<StoreContextValue>({
  stores: [],
  selectedStore: null,
  setSelectedStoreId: () => {},
  loading: true,
  refetch: () => {},
});

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStores = () => {
    setLoading(true);
    fetch("/api/stores")
      .then((r) => r.json())
      .then((data: Store[]) => {
        setStores(data);
        if (data.length > 0 && !selectedId) {
          setSelectedId(data[0].id);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const selectedStore = stores.find((s) => s.id === selectedId) ?? stores[0] ?? null;

  return (
    <StoreContext.Provider
      value={{
        stores,
        selectedStore,
        setSelectedStoreId: setSelectedId,
        loading,
        refetch: fetchStores,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStores() {
  return useContext(StoreContext);
}
