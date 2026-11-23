
import type { CartItem } from "../types/cart";

const GUEST_CART_STORAGE_KEY = "swachha_guest_cart";

interface GuestCartStorage {
  mergeId: string;
  items: CartItem[];
}

type GuestCartItemInput = Omit<
  CartItem,
  "id" | "createdAt" | "updatedAt"
>;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function createMergeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function readGuestCart(): GuestCartStorage {
  if (!isBrowser()) {
    return { mergeId: "", items: [] };
  }

  try {
    const storedValue = localStorage.getItem(GUEST_CART_STORAGE_KEY);

    if (!storedValue) {
      return { mergeId: "", items: [] };
    }

    const parsed = JSON.parse(storedValue) as GuestCartStorage;

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !Array.isArray(parsed.items)
    ) {
      localStorage.removeItem(GUEST_CART_STORAGE_KEY);
      return { mergeId: "", items: [] };
    }

    const validItems = parsed.items.filter(
      (item): item is CartItem =>
        Boolean(
          item &&
            typeof item.id === "string" &&
            typeof item.productId === "string" &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            item.product &&
            typeof item.product === "object"
        )
    );

    return {
      mergeId:
        typeof parsed.mergeId === "string" && parsed.mergeId
          ? parsed.mergeId
          : createMergeId(),
      items: validItems,
    };
  } catch {
    throw new Error(
      "Unable to access your saved cart. Please check your browser storage settings."
    );
  }
}

function saveGuestCart(cart: GuestCartStorage): void {
  if (!isBrowser()) {
    throw new Error("Guest cart storage is unavailable.");
  }

  try {
    localStorage.setItem(
      GUEST_CART_STORAGE_KEY,
      JSON.stringify(cart)
    );
  } catch {
    throw new Error(
      "Unable to save your cart. Please check your browser storage space and settings."
    );
  }
}

export function getGuestCartItems(): CartItem[] {
  return readGuestCart().items;
}

export function getGuestCartMergeId(): string | null {
  const cart = readGuestCart();

  if (cart.items.length === 0) {
    return null;
  }

  if (!cart.mergeId) {
    return null;
  }

  return cart.mergeId;
}

export function addGuestCartItem(
  item: GuestCartItemInput
): void {
  const cart = readGuestCart();

  const existingItem = cart.items.find(
    (cartItem) => cartItem.productId === item.productId
  );

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.items.push({
      ...item,
      id: `guest_${encodeURIComponent(item.productId)}`,
    });
  }

  saveGuestCart({
    mergeId: cart.mergeId || createMergeId(),
    items: cart.items,
  });
}

export function updateGuestCartItem(
  id: string,
  quantity: number
): void {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be at least 1.");
  }

  const cart = readGuestCart();

  const item = cart.items.find((cartItem) => cartItem.id === id);

  if (!item) {
    throw new Error("Cart item not found.");
  }

  item.quantity = quantity;

  saveGuestCart(cart);
}

export function deleteGuestCartItem(id: string): void {
  const cart = readGuestCart();

  const updatedItems = cart.items.filter(
    (item) => item.id !== id
  );

  if (updatedItems.length === 0) {
    clearGuestCart();
    return;
  }

  saveGuestCart({
    ...cart,
    items: updatedItems,
  });
}

export function clearGuestCart(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
  } catch {
    throw new Error("Unable to clear the saved guest cart.");
  }
}
