import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { CartItem, Product, ProductVariant, WishlistItem, User, Theme, Language, CurrencyCode } from '@/types';

// Cart Store
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getSubtotal: () => number;
  getTax: (rate?: number) => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    immer((set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.productId === product.id &&
              item.variantId === variant?.id
          );

          if (existingIndex > -1) {
            state.items[existingIndex].quantity += quantity;
          } else {
            state.items.push({
              id: `${product.id}-${variant?.id || 'default'}-${Date.now()}`,
              quantity,
              createdAt: new Date(),
              updatedAt: new Date(),
              product,
              variant: variant || null,
              coupon: null,
            } as CartItem);
          }
        });
      },

      removeItem: (itemId) => {
        set((state) => {
          state.items = state.items.filter((item) => item.id !== itemId);
        });
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          const item = state.items.find((item) => item.id === itemId);
          if (item) {
            item.quantity = quantity;
            item.updatedAt = new Date();
          }
        });
      },

      clearCart: () => {
        set((state) => {
          state.items = [];
        });
      },

      toggleCart: () => {
        set((state) => {
          state.isOpen = !state.isOpen;
        });
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.variant?.price || item.product.price;
          return total + price * item.quantity;
        }, 0);
      },

      getTax: (rate = 0.15) => {
        return get().getSubtotal() * rate;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const tax = get().getTax();
        return subtotal + tax;
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    })),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Wishlist Store
interface WishlistState {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    immer((set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          if (!state.items.find((item) => item.productId === product.id)) {
            state.items.push({
              id: `${product.id}-${Date.now()}`,
              createdAt: new Date(),
              product,
            });
          }
        });
      },

      removeItem: (productId) => {
        set((state) => {
          state.items = state.items.filter(
            (item) => item.productId !== productId
          );
        });
      },

      toggleItem: (product) => {
        const isInWishlist = get().isInWishlist(product.id);
        if (isInWishlist) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      getItemCount: () => {
        return get().items.length;
      },
    })),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// UI Store
interface UIState {
  theme: Theme;
  language: Language;
  currency: CurrencyCode;
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  isQuickViewOpen: boolean;
  quickViewProductId: string | null;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setCurrency: (currency: CurrencyCode) => void;
  toggleSearch: () => void;
  toggleMobileMenu: () => void;
  openQuickView: (productId: string) => void;
  closeQuickView: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    immer((set) => ({
      theme: 'system',
      language: 'en',
      currency: 'USD',
      isSearchOpen: false,
      isMobileMenuOpen: false,
      isQuickViewOpen: false,
      quickViewProductId: null,

      setTheme: (theme) => {
        set((state) => {
          state.theme = theme;
        });
      },

      setLanguage: (language) => {
        set((state) => {
          state.language = language;
        });
      },

      setCurrency: (currency) => {
        set((state) => {
          state.currency = currency;
        });
      },

      toggleSearch: () => {
        set((state) => {
          state.isSearchOpen = !state.isSearchOpen;
        });
      },

      toggleMobileMenu: () => {
        set((state) => {
          state.isMobileMenuOpen = !state.isMobileMenuOpen;
        });
      },

      openQuickView: (productId) => {
        set((state) => {
          state.isQuickViewOpen = true;
          state.quickViewProductId = productId;
        });
      },

      closeQuickView: () => {
        set((state) => {
          state.isQuickViewOpen = false;
          state.quickViewProductId = null;
        });
      },
    })),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        currency: state.currency,
      }),
    }
  )
);

// User Store
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    immer((set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => {
        set((state) => {
          state.user = user;
          state.isAuthenticated = !!user;
        });
      },

      logout: () => {
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
        });
      },
    })),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
