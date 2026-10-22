import { create } from "zustand";
export type GroceryCategory =
  "Produce" | "Vegetables" | "Dairy" | "Bakery" | "others";
export type GroceryPriority = "low" | "medium" | "high";

export type GroceryItem = {
  id: string;
  name: string;
  category: GroceryCategory;
  quantity: number;
  purchased: boolean;
  priority: GroceryPriority;
};

export type CreateItemInput = {
  name: string;
  category: GroceryCategory;
  quantity: number;
  priority: GroceryPriority;
};

type ItemsResponse = { items: GroceryItem[] };
type ItemResponse = { item: GroceryItem };

interface GroceryStore {
  items: GroceryItem[];
  isLoading: boolean;
  error: string | null;
  loadItems: () => Promise<void>;
  addItem: (input: CreateItemInput) => Promise<GroceryItem | void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  togglePurchased: (id: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearPurchased: () => Promise<void>;
}

export const useGroceryStore = create<GroceryStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  // Action : Charger les articles depuis l'API
  loadItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/items");
      const payload = (await res.json()) as ItemsResponse;

      if (!res.ok) throw new Error(`Request Failed : ${res.status}`);
      set({ items: payload.items });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Action : Ajouter un article via l'API et mettre à jour l'état local immédiatement
  addItem: async (input) => {
    set({ error: null });
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: input.name,
          category: input.category,
          quantity: Math.max(1, input.quantity),
          priority: input.priority,
        }),
      });
      const payload = (await res.json()) as ItemResponse;
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      // const newItem = await res.json();

      // Ajout du nouvel article tout en haut de la liste existante
      set((state) => ({ items: [payload.item, ...state.items] }));
      return payload.item;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error adding item";
      set({ error: message });
    }
  },

  // Action : Ajustement de la quantité d'un article
  updateQuantity: async (id: string, quantity: number) => {
    // Ta logique pour modifier la quantité
    const nextQuantity = Math.max(1, quantity); // Sécurité : minimum 1
    set({ error: null });

    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: nextQuantity }),
      });
      const payload = (await res.json()) as ItemResponse;
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? payload.item : item,
        ),
      }));
    } catch (error) {
      console.error("Error updating quantity:", error);
      set({ error: "Something went wrong" });
    }
  },

  // Action : Basculer l'état "Acheté" / "En attente"
  togglePurchased: async (id) => {
    // Ta logique pour inverser l'état acheté/non acheté

    const currentItem = get().items.find((item) => item.id === id);
    if (!currentItem) return;

    const nextPurchased = !currentItem.purchased;

    // Mise à jour locale instantanée
    set({ error: null });

    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchased: nextPurchased }),
      });

      const payload = (await res.json()) as ItemResponse;
      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? payload.item : item,
        ),
      }));
    } catch (err: unknown) {
      set({ error: "Something went wrong" });
    }
  },

  // Action : Supprimer un article
  removeItem: async (id) => {
    // Ta logique pour supprimer un article

    set({ error: null });
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
    } catch (error) {
      console.error("Error removing item:", error);
      set({ error: "Something went wrong" });
    }
  },

  clearPurchased: async () => {
    // Ta logique pour nettoyer les articles achetés

    set({ error: null });
    try {
      const res = await fetch("/api/items/clear-purchased", { method: "POST" });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const items = get().items.filter((item) => !item.purchased);
      set({ items });
    } catch (error) {
      console.error("Error clearing purchased:", error);
      set({ error: "Something went wrong" });
    }
  },
}));
