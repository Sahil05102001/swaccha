
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  deleteField,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";
import type { Product, ProductFormData } from "../types/product";
import { deleteCloudinaryProductImage } from "./productImageService";

const productsCollection = collection(db, "products");
const GST_RATES = [0, 0.25, 3, 5, 18, 40];

const PRODUCT_UNITS = [
  "pcs",
  "bottle",
  "ltr",
  "ml",
  "kg",
  "gm",
  "pack",
  "box",
  "carton",
  "set",
];

const BADGE_MAX_LENGTH = 16;

export type DuplicateProductField = "name" | "sku";

export class DuplicateProductError extends Error {
  readonly code: string;
  readonly field: DuplicateProductField;

  constructor(field: DuplicateProductField, message: string) {
    super(message);

    this.name = "DuplicateProductError";
    this.field = field;
    this.code =
      field === "name"
        ? "DUPLICATE_PRODUCT_NAME"
        : "DUPLICATE_PRODUCT_SKU";

    Object.setPrototypeOf(this, DuplicateProductError.prototype);
  }
}

function cleanProductName(value: unknown): string {
  const name = typeof value === "string" ? value.trim() : "";

  if (!name) {
    throw new Error("Product name is required.");
  }

  return name;
}

function cleanHsn(value: unknown): string {
  const hsn = typeof value === "string" ? value.trim() : "";

  if (hsn !== "" && !/^\d{4}(\d{2}(\d{2})?)?$/.test(hsn)) {
    throw new Error("HSN code must be 4, 6 or 8 digits.");
  }

  return hsn;
}

function cleanRate(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;

  if (typeof value !== "number" || !GST_RATES.includes(value)) {
    throw new Error("Choose a valid GST rate.");
  }

  return value;
}

function cleanSku(value: unknown): string {
  const sku = typeof value === "string" ? value.trim() : "";

  if (sku.length < 3) {
    throw new Error("SKU must be at least 3 characters.");
  }

  return sku;
}

function cleanUnit(value: unknown): string {
  const unit = typeof value === "string" ? value.trim() : "";

  if (!PRODUCT_UNITS.includes(unit)) {
    throw new Error("Please select a valid product unit.");
  }

  return unit;
}

function cleanProductSize(value: unknown): number | null {
  if (value === "" || value === undefined || value === null) {
    return null;
  }

  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value <= 0
  ) {
    throw new Error("Product size must be a positive number.");
  }

  return value;
}

function cleanBadge(mode: unknown, text: unknown) {
  const badgeMode =
    mode === "global" || mode === "custom" ? mode : "none";

  const badgeText =
    badgeMode === "custom" && typeof text === "string"
      ? text.trim().slice(0, BADGE_MAX_LENGTH)
      : "";

  // A custom badge without text is the same as no badge.
  return {
    badgeMode: badgeMode === "custom" && !badgeText ? "none" : badgeMode,
    badgeText,
  };
}

/**
 * Prevent duplicate product names and SKUs.
 * Both comparisons are case-insensitive and ignore surrounding whitespace.
 *
 * When editing, the current product is excluded from the comparison.
 */
async function assertUniqueProductDetails(
  name: string,
  sku: string,
  excludeProductId?: string,
): Promise<void> {
  const normalizedName = name.trim().toLowerCase();
  const normalizedSku = sku.trim().toLowerCase();

  const snapshot = await getDocs(productsCollection);

  const duplicateName = snapshot.docs.some((document) => {
    if (document.id === excludeProductId) {
      return false;
    }

    const existingName = document.data().name;

    return (
      typeof existingName === "string" &&
      existingName.trim().toLowerCase() === normalizedName
    );
  });

  if (duplicateName) {
    throw new DuplicateProductError(
      "name",
      `A product with the name "${name}" already exists.`,
    );
  }

  const duplicateSku = snapshot.docs.some((document) => {
    if (document.id === excludeProductId) {
      return false;
    }

    const existingSku = document.data().sku;

    return (
      typeof existingSku === "string" &&
      existingSku.trim().toLowerCase() === normalizedSku
    );
  });

  if (duplicateSku) {
    throw new DuplicateProductError(
      "sku",
      `A product with SKU "${sku}" already exists.`,
    );
  }
}

/**
 * Calculate discount percentage from MRP and selling price.
 * The stored discount is rounded to the nearest whole percentage.
 */
function calculateDiscount(mrp: number, sellingPrice: number): number {
  if (
    !Number.isFinite(mrp) ||
    !Number.isFinite(sellingPrice) ||
    mrp <= 0 ||
    sellingPrice <= 0 ||
    mrp <= sellingPrice
  ) {
    return 0;
  }

  return Math.round(((mrp - sellingPrice) / mrp) * 100);
}

export interface ProductsPageResult {
  products: Product[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

/**
 * Fetch active products using Firestore cursor pagination.
 */
export async function getProductsPage(
  pageSize: number,
  lastVisible: QueryDocumentSnapshot<DocumentData> | null = null,
): Promise<ProductsPageResult> {
  const constraints = [
    where("isActive", "==", true),
    orderBy("createdAt", "desc"),
    ...(lastVisible ? [startAfter(lastVisible)] : []),
    limit(pageSize + 1),
  ];

  const productsQuery = query(productsCollection, ...constraints);
  const snapshot = await getDocs(productsQuery);

  const hasMore = snapshot.docs.length > pageSize;
  const pageDocs = snapshot.docs.slice(0, pageSize);

  const products: Product[] = pageDocs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<Product, "id">),
  }));

  return {
    products,
    lastVisible: pageDocs.length
      ? pageDocs[pageDocs.length - 1]
      : null,
    hasMore,
  };
}

/**
 * Existing unpaginated function retained for other parts of the app.
 */
export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(productsCollection);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<Product, "id">),
  }));
}

export async function createProduct(product: ProductFormData) {
  const name = cleanProductName(product.name);
  const sku = cleanSku(product.sku);
  const unit = cleanUnit(product.unit);
  const productSize = cleanProductSize(product.productSize);

  const brand = product.brand.trim();
  const subcategory = product.subcategory.trim();

  const hsnCode = cleanHsn(product.hsnCode);
  const gstRate = cleanRate(product.gstRate);

  const { badgeMode, badgeText } = cleanBadge(
    product.badgeMode,
    product.badgeText,
  );

  const imagePublicId =
    typeof product.imagePublicId === "string"
      ? product.imagePublicId.trim()
      : "";

  const discount = calculateDiscount(product.mrp, product.price);

  await assertUniqueProductDetails(name, sku);

  const created = await addDoc(productsCollection, {
    name,
    description: product.description,

    brand,
    sku,
    category: product.category,
    subcategory,
    ...(productSize !== null ? { productSize } : {}),
    unit,

    price: product.price,
    mrp: product.mrp,
    discount,
    stock: product.stock,

    images: product.images,
    ...(imagePublicId ? { imagePublicId } : {}),

    isActive: product.isActive,
    isFeatured: false,

    ...(hsnCode ? { hsnCode } : {}),
    ...(gstRate !== null ? { gstRate } : {}),

    ...(badgeMode !== "none" ? { badgeMode } : {}),
    ...(badgeMode === "custom" ? { badgeText } : {}),

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return created.id;
}

export async function updateProduct(
  id: string,
  product: ProductFormData,
) {
  const name = cleanProductName(product.name);
  const sku = cleanSku(product.sku);
  const unit = cleanUnit(product.unit);
  const productSize = cleanProductSize(product.productSize);

  const brand = product.brand.trim();
  const subcategory = product.subcategory.trim();

  const imagePublicId =
    typeof product.imagePublicId === "string"
      ? product.imagePublicId.trim()
      : "";

  const discount = calculateDiscount(product.mrp, product.price);

  const { badgeMode, badgeText } = cleanBadge(
    product.badgeMode,
    product.badgeText,
  );

  await assertUniqueProductDetails(name, sku, id);

  await updateDoc(doc(db, "products", id), {
    name,
    description: product.description,

    brand,
    sku,
    category: product.category,
    subcategory,
    productSize:
      productSize !== null ? productSize : deleteField(),
    unit,

    price: product.price,
    mrp: product.mrp,
    discount,

    images: product.images,

    ...(product.imagePublicId !== undefined
      ? {
          imagePublicId: imagePublicId || deleteField(),
        }
      : {}),

    isActive: product.isActive,

    ...(product.hsnCode !== undefined
      ? { hsnCode: cleanHsn(product.hsnCode) || deleteField() }
      : {}),

    ...(product.gstRate !== undefined
      ? { gstRate: cleanRate(product.gstRate) ?? deleteField() }
      : {}),

    ...(product.badgeMode !== undefined
      ? {
          badgeMode: badgeMode === "none" ? deleteField() : badgeMode,
          badgeText: badgeMode === "custom" ? badgeText : deleteField(),
        }
      : {}),

    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct({
  id,
  imagePublicId,
}: {
  id: string;
  imagePublicId?: string;
}) {
  // Delete the Cloudinary image first, if one exists.
  if (imagePublicId?.trim()) {
    await deleteCloudinaryProductImage(imagePublicId, id);
  }

  // Delete the Firestore document only after Cloudinary succeeds.
  await deleteDoc(doc(db, "products", id));
}
