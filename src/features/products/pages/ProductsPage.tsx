import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Pagination,
} from "@mui/material";

import type { SelectChangeEvent } from "@mui/material";

import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { useSearchParams } from "react-router-dom";

import ProductGrid from "../components/ProductGrid";
import { useProducts } from "../hooks/useProducts";

type SortOption =
  | "relevance"
  | "price-low"
  | "price-high"
  | "discount"
  | "name"
  | "featured";

const PAGE_SIZE = 12;

// Distance from the top of the screen at which the desktop filter panel sticks.
// - Navbar scrolls away with the page: keep 16.
// - Navbar is sticky/fixed: set this to the navbar height + 16 (e.g. 72 + 16 = 88),
//   otherwise the panel slides under the navbar.
const STICKY_TOP = 16;

// Show a search box inside a filter section once it has more options than this.
const SEARCHABLE_AFTER = 8;

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);

// Menu settings for the Sort dropdown.
// disableScrollLock stops the page from jumping sideways (and the navbar from
// shifting) when the menu opens on desktop, where the page has a scrollbar.
const sortMenuProps = {
  disableScrollLock: true,
  anchorOrigin: {
    vertical: "bottom" as const,
    horizontal: "left" as const,
  },
  transformOrigin: {
    vertical: "top" as const,
    horizontal: "left" as const,
  },
  marginThreshold: 8,
  slotProps: {
    paper: {
      sx: {
        maxHeight: 280,
        overflowY: "auto",
        overscrollBehavior: "contain",
        backgroundColor: "#080B12",
        color: "#F5F7FA",
        boxShadow: "none",
        border: "1px solid #273344",
        borderRadius: 0,
        "& .MuiMenuItem-root": {
          color: "#F5F7FA",
          backgroundColor: "transparent",
          "&.Mui-selected": {
            backgroundColor: "#102B38",
            color: "#00D9FF",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "#153746",
          },
          "&:hover": {
            backgroundColor: "#111722",
          },
        },
      },
    },
  },
};

// Dark styling shared by the desktop filter panel and the mobile filter drawer.
const filterPanelSx = {
  color: "#F5F7FA",
  "& .MuiDivider-root": {
    borderColor: "#273344",
  },
  "& .MuiTypography-root": {
    color: "#F5F7FA",
  },
  "& .MuiInputLabel-root": {
    color: "#AAB6C6",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#00D9FF",
  },
  "& .MuiOutlinedInput-root": {
    color: "#F5F7FA",
    backgroundColor: "#111722",
    borderRadius: 0,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#344052",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#00D9FF",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#00D9FF",
    },
  },
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "#65758B",
  },
  "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
    borderColor: "#273344",
  },
  "& .MuiSvgIcon-root": {
    color: "#00D9FF",
  },
  // Checkboxes and radios: grey when off, cyan when on.
  "& .MuiCheckbox-root, & .MuiRadio-root": {
    color: "#65758B",
    "&.Mui-checked": {
      color: "#00D9FF",
    },
  },
  "& .MuiCheckbox-root .MuiSvgIcon-root, & .MuiRadio-root .MuiSvgIcon-root": {
    color: "inherit",
  },
  "& .MuiSlider-root": {
    color: "#00D9FF",
  },
  "& .MuiFormControlLabel-label": {
    color: "#E2E8F0",
  },
  "& .MuiButton-root": {
    color: "#00D9FF",
  },
};

interface SortSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent) => void;
  children: ReactNode;
}

/**
 * The Sort dropdown. It doesn't lock page scroll, so it can't shift the navbar.
 * Because the page can still scroll while it is open, it closes if the page scrolls
 * a noticeable distance, so it never floats away from its field.
 */
function SortSelect({ id, label, value, onChange, children }: SortSelectProps) {
  const [open, setOpen] = useState(false);
  const scrollYAtOpen = useRef(0);

  useEffect(() => {
    if (!open) {
      return;
    }

    scrollYAtOpen.current = window.scrollY;

    const handleScroll = () => {
      // Ignore tiny movements (focus adjustments); close on real scrolling.
      if (Math.abs(window.scrollY - scrollYAtOpen.current) > 24) {
        setOpen(false);
      }
    };

    const handleResize = () => setOpen(false);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: 190,
        "& .MuiInputLabel-root": {
          color: "#000000",
        },
        "& .MuiOutlinedInput-root": {
          color: "#000000",
          backgroundColor: "#FFFFFF",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#00D9FF",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#00D9FF",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#00D9FF",
          },
        },
        "& .MuiSvgIcon-root": {
          color: "#00D9FF",
        },
      }}
    >
      <InputLabel id={`${id}-label`}>{label}</InputLabel>

      <Select
        labelId={`${id}-label`}
        id={id}
        value={value}
        label={label}
        onChange={onChange}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        MenuProps={sortMenuProps}
      >
        {children}
      </Select>
    </FormControl>
  );
}

interface FilterSectionProps {
  title: string;
  // Short text shown next to the title when a value is selected.
  summary?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

/** A collapsible filter group that expands in place (no popup menus). */
function FilterSection({
  title,
  summary,
  defaultOpen = false,
  children,
}: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Box>
      <Box
        component="button"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          p: 0,
          py: 0.5,
          border: 0,
          background: "none",
          color: "inherit",
          font: "inherit",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography component="span" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>

          {summary && (
            <Box
              component="span"
              sx={{
                ml: 1,
                fontSize: "0.8rem",
                color: "#00D9FF",
                wordBreak: "break-word",
              }}
            >
              {summary}
            </Box>
          )}
        </Box>

        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>

      {open && <Box sx={{ mt: 1 }}>{children}</Box>}
    </Box>
  );
}

interface OptionListProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  allLabel: string;
  emptyHint?: string;
}

/** A radio list for single-choice filters, with an optional search box. */
function OptionList({
  options,
  value,
  onChange,
  allLabel,
  emptyHint,
}: OptionListProps) {
  const [query, setQuery] = useState("");

  const searchable = options.length > SEARCHABLE_AFTER;

  const visibleOptions = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term
      ? options.filter((option) => option.toLowerCase().includes(term))
      : options;
  }, [options, query]);

  if (options.length === 0) {
    return (
      <Typography sx={{ fontSize: "0.85rem", color: "#AAB6C6 !important" }}>
        {emptyHint ?? "No options available."}
      </Typography>
    );
  }

  return (
    <Stack spacing={1}>
      {searchable && (
        <TextField
          size="small"
          placeholder="Search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          fullWidth
        />
      )}

      <Box
        sx={{
          maxHeight: 220,
          overflowY: "auto",
          overflowX: "hidden",
          overscrollBehavior: "contain",
          scrollbarWidth: "thin",
          scrollbarColor: "#344052 transparent",
        }}
      >
        <RadioGroup
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {!query && (
            <FormControlLabel
              value=""
              control={<Radio size="small" />}
              label={allLabel}
              sx={{ ml: 0, mr: 0 }}
            />
          )}

          {visibleOptions.map((option) => (
            <FormControlLabel
              key={option}
              value={option}
              control={<Radio size="small" />}
              label={option}
              sx={{ ml: 0, mr: 0 }}
            />
          ))}

          {query && visibleOptions.length === 0 && (
            <Typography
              sx={{ py: 1, fontSize: "0.85rem", color: "#AAB6C6 !important" }}
            >
              No matches.
            </Typography>
          )}
        </RadioGroup>
      </Box>
    </Stack>
  );
}

export default function ProductsPage() {
  const [minPriceInput, setMinPriceInput] = useState("0");
  const [maxPriceInput, setMaxPriceInput] = useState("0");
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useProducts();

  // The search text lives in the address (?search=...) and is typed in the navbar,
  // so the whole site has just one search box.
  const [searchParams, setSearchParams] = useSearchParams();
  const search = (searchParams.get("search") ?? "").trim();

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("search");
    setSearchParams(next, { replace: true });
  };

  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");

  // null = the full price range (nothing chosen yet).
  const [priceRange, setPriceRange] = useState<[number, number] | null>(
    null,
  );

  const [discountMinimum, setDiscountMinimum] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // A new search always starts from the first page of results.
  useEffect(() => {
    setPage(1);
  }, [search]);

  const activeProducts = useMemo(
    () => products.filter((product) => product.isActive),
    [products],
  );

  const categories = useMemo(
    () =>
      [
        ...new Set(
          activeProducts
            .map((product) => product.category?.trim())
            .filter((value): value is string => Boolean(value)),
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [activeProducts],
  );

  const subcategories = useMemo(
    () =>
      [
        ...new Set(
          activeProducts
            .filter((product) => !category || product.category === category)
            .map((product) => product.subcategory?.trim())
            .filter((value): value is string => Boolean(value)),
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [activeProducts, category],
  );

  const brands = useMemo(
    () =>
      [
        ...new Set(
          activeProducts
            .map((product) => product.brand?.trim())
            .filter((value): value is string => Boolean(value)),
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [activeProducts],
  );

  const maxAvailablePrice = useMemo(() => {
    const max = activeProducts.reduce(
      (highest, product) =>
        Math.max(
          highest,
          Number.isFinite(product.price) ? product.price : 0,
        ),
      0,
    );

    return Math.max(100, Math.ceil(max / 100) * 100);
  }, [activeProducts]);

  // Plain numbers (not an array) so the memo below only re-runs when the range really changes.
  const minPrice = Math.min(priceRange?.[0] ?? 0, maxAvailablePrice);
  const maxPrice = Math.min(
    priceRange?.[1] ?? maxAvailablePrice,
    maxAvailablePrice,
  );

  useEffect(() => {
    setMinPriceInput(String(minPrice));
    setMaxPriceInput(String(maxPrice));
  }, [minPrice, maxPrice]);

  const filteredProducts = useMemo(() => {
    // Every word typed must appear somewhere in the product's name, brand, SKU or categories,
    // so "cotton mop" finds "Premium Cotton Mop".
    const searchTerms = search
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    const filtered = activeProducts.filter((product) => {
      const searchableText = [
        product.name,
        product.brand,
        product.sku,
        product.category,
        product.subcategory,
      ]
        .map((value) => (value ?? "").toLowerCase())
        .join(" ");

      const matchesSearch = searchTerms.every((term) =>
        searchableText.includes(term),
      );

      const matchesCategory = !category || product.category === category;
      const matchesSubcategory =
        !subcategory || product.subcategory === subcategory;
      const matchesBrand = !brand || product.brand === brand;

      const price = Number.isFinite(product.price) ? product.price : 0;
      const matchesPrice = price >= minPrice && price <= maxPrice;

      const discount = Number.isFinite(product.discount)
        ? product.discount
        : 0;
      const matchesDiscount = discount >= discountMinimum;

      const matchesStock = !inStockOnly || product.stock > 0;
      const matchesFeatured = !featuredOnly || product.isFeatured;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesBrand &&
        matchesPrice &&
        matchesDiscount &&
        matchesStock &&
        matchesFeatured
      );
    });

    const sorted = [...filtered];

    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "discount":
        sorted.sort((a, b) => b.discount - a.discount);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
        sorted.sort(
          (a, b) => Number(b.isFeatured) - Number(a.isFeatured),
        );
        break;
      default:
        break;
    }

    return sorted;
  }, [
    activeProducts,
    search,
    category,
    subcategory,
    brand,
    minPrice,
    maxPrice,
    discountMinimum,
    inStockOnly,
    featuredOnly,
    sortBy,
  ]);

  const pageCount = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(pageCount, 1));

  const paginatedProducts = useMemo(
    () =>
      filteredProducts.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      ),
    [filteredProducts, currentPage],
  );

  const priceFilterActive = minPrice > 0 || maxPrice < maxAvailablePrice;

  const activeFilterCount = [
    category !== "",
    subcategory !== "",
    brand !== "",
    priceFilterActive,
    discountMinimum > 0,
    inStockOnly,
    featuredOnly,
  ].filter(Boolean).length;

  const hasAnyFilter = Boolean(search) || activeFilterCount > 0;

  const resetPage = () => setPage(1);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setSubcategory("");
    resetPage();
  };

  const handleSubcategoryChange = (value: string) => {
    setSubcategory(value);
    resetPage();
  };

  const handleBrandChange = (value: string) => {
    setBrand(value);
    resetPage();
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as SortOption);
    resetPage();
  };

  const clearFilters = () => {
    clearSearch();
    setCategory("");
    setSubcategory("");
    setBrand("");
    setPriceRange(null);
    setDiscountMinimum(0);
    setInStockOnly(false);
    setFeaturedOnly(false);
    setSortBy("relevance");
    setPage(1);
  };

  // The filter controls. The desktop panel shows its own heading;
  // the mobile drawer has a fixed top bar instead, so it hides it.
  const renderFilters = (showHeading: boolean) => (
    <Stack spacing={2}>
      {showHeading && (
        <>
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Filters
            </Typography>

            <Button
              onClick={clearFilters}
              size="small"
              sx={{ textTransform: "none" }}
            >
              Clear all
            </Button>
          </Stack>

          <Divider />
        </>
      )}

      <FilterSection title="Category" summary={category} defaultOpen>
        <OptionList
          options={categories}
          value={category}
          onChange={handleCategoryChange}
          allLabel="All categories"
        />
      </FilterSection>

      <Divider />

      <FilterSection
        title="Subcategory"
        summary={subcategory}
        defaultOpen={Boolean(category)}
      >
        <OptionList
          options={subcategories}
          value={subcategory}
          onChange={handleSubcategoryChange}
          allLabel="All subcategories"
          emptyHint="No subcategories for this selection."
        />
      </FilterSection>

      <Divider />

      <FilterSection title="Brand" summary={brand}>
        <OptionList
          options={brands}
          value={brand}
          onChange={handleBrandChange}
          allLabel="All brands"
        />
      </FilterSection>

      <Divider />

      <FilterSection
        title="Price range"
        summary={
          priceFilterActive
            ? `₹${formatPrice(minPrice)} – ₹${formatPrice(maxPrice)}`
            : undefined
        }
        defaultOpen
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "flex-start" }}
        >
          <TextField
            fullWidth
            size="small"
            label="Min ₹"
            type="number"
            value={minPriceInput}
            onChange={(event) => {
              const value = event.target.value;
              setMinPriceInput(value);

              if (value !== "") {
                const nextMin = Math.max(0, Number(value));
                setPriceRange([Math.min(nextMin, maxPrice), maxPrice]);
                resetPage();
              }
            }}
            onBlur={() => {
              const nextMin = Math.max(
                0,
                Math.min(
                  minPriceInput === "" ? 0 : Number(minPriceInput),
                  maxPrice,
                ),
              );

              setMinPriceInput(String(nextMin));
              setPriceRange([nextMin, maxPrice]);
            }}
            slotProps={{
              htmlInput: { min: 0, max: maxAvailablePrice },
            }}
          />

          <TextField
            fullWidth
            size="small"
            label="Max ₹"
            type="number"
            value={maxPriceInput}
            onChange={(event) => {
              const value = event.target.value;
              setMaxPriceInput(value);

              if (value !== "") {
                const nextMax = Math.min(
                  maxAvailablePrice,
                  Math.max(minPrice, Number(value)),
                );

                setPriceRange([minPrice, nextMax]);
                resetPage();
              }
            }}
            onBlur={() => {
              const nextMax = Math.min(
                maxAvailablePrice,
                Math.max(
                  minPrice,
                  maxPriceInput === ""
                    ? maxAvailablePrice
                    : Number(maxPriceInput),
                ),
              );

              setMaxPriceInput(String(nextMax));
              setPriceRange([minPrice, nextMax]);
            }}
            slotProps={{
              htmlInput: { min: 0, max: maxAvailablePrice },
            }}
          />
        </Stack>

        <Slider
          value={[minPrice, maxPrice]}
          onChange={(_, value) => {
            if (Array.isArray(value)) {
              setPriceRange([value[0], value[1]]);
              resetPage();
            }
          }}
          min={0}
          max={maxAvailablePrice}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `₹${formatPrice(value)}`}
          disableSwap
          sx={{
            mt: 2,
            // Keeps the slider handles and their price label inside the panel.
            mx: "12px",
            width: "calc(100% - 24px)",
          }}
        />
      </FilterSection>

      <Divider />

      <FilterSection
        title="Minimum discount"
        summary={discountMinimum > 0 ? `${discountMinimum}%+` : undefined}
      >
        {[0, 10, 20, 30, 50].map((value) => (
          <FormControlLabel
            key={value}
            control={
              <Checkbox
                checked={discountMinimum === value}
                onChange={() => {
                  setDiscountMinimum(value);
                  resetPage();
                }}
                size="small"
              />
            }
            label={value === 0 ? "Any discount" : `${value}% or more`}
            sx={{ display: "flex", ml: 0 }}
          />
        ))}
      </FilterSection>

      <Divider />

      <FilterSection
        title="Availability and type"
        defaultOpen
        summary={
          [inStockOnly && "In stock", featuredOnly && "Featured"]
            .filter(Boolean)
            .join(", ") || undefined
        }
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={inStockOnly}
              onChange={(event) => {
                setInStockOnly(event.target.checked);
                resetPage();
              }}
              size="small"
            />
          }
          label="In stock"
          sx={{ display: "flex", ml: 0 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={featuredOnly}
              onChange={(event) => {
                setFeaturedOnly(event.target.checked);
                resetPage();
              }}
              size="small"
            />
          }
          label="Featured products"
          sx={{ display: "flex", ml: 0 }}
        />
      </FilterSection>
    </Stack>
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={30} />
        <Typography color="text.secondary">
          Loading products...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">
          {error instanceof Error
            ? error.message
            : "Something went wrong while loading products."}
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F5F7FA",
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          // Same width cap as Best Sellers and New Arrivals, so cards stay a consistent size.
          maxWidth: 1400,
          py: { xs: 2, md: 4 },
        }}
      >
        <Stack spacing={2.5}>
          <Box>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "1.8rem", sm: "2.4rem" },
                fontWeight: 800,
                lineHeight: 1.2,
                color: "text.primary",
              }}
            >
              Shop all products
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Find the right products for your needs.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
            }}
          >
            <Typography color="text.secondary">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} found
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center" }}
            >
              <Button
                variant="outlined"
                startIcon={<TuneIcon />}
                onClick={() => setMobileFiltersOpen(true)}
                sx={{
                  display: { xs: "inline-flex", md: "none" },
                  textTransform: "none",
                  color: "#000000",
                  backgroundColor: "#FFFFFF",
                  borderColor: "#00D9FF",
                }}
              >
                Filters
                {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              </Button>

              <SortSelect
                id="sort-products"
                label="Sort by"
                value={sortBy}
                onChange={handleSortChange}
              >
                <MenuItem value="relevance">Relevance</MenuItem>
                <MenuItem value="price-low">Price: Low to high</MenuItem>
                <MenuItem value="price-high">Price: High to low</MenuItem>
                <MenuItem value="discount">Highest discount</MenuItem>
                <MenuItem value="name">Name: A–Z</MenuItem>
                <MenuItem value="featured">Featured first</MenuItem>
              </SortSelect>
            </Stack>
          </Stack>

          {hasAnyFilter && (
            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: "wrap", gap: 1, alignItems: "center" }}
            >
              {search && (
                <Chip
                  label={`Search: ${search}`}
                  onDelete={clearSearch}
                />
              )}

              {category && (
                <Chip
                  label={`Category: ${category}`}
                  onDelete={() => {
                    setCategory("");
                    setSubcategory("");
                    resetPage();
                  }}
                />
              )}

              {subcategory && (
                <Chip
                  label={`Subcategory: ${subcategory}`}
                  onDelete={() => {
                    setSubcategory("");
                    resetPage();
                  }}
                />
              )}

              {brand && (
                <Chip
                  label={`Brand: ${brand}`}
                  onDelete={() => {
                    setBrand("");
                    resetPage();
                  }}
                />
              )}

              {priceFilterActive && (
                <Chip
                  label={`₹${formatPrice(minPrice)} – ₹${formatPrice(maxPrice)}`}
                  onDelete={() => {
                    setPriceRange(null);
                    resetPage();
                  }}
                />
              )}

              {discountMinimum > 0 && (
                <Chip
                  label={`${discountMinimum}% discount or more`}
                  onDelete={() => {
                    setDiscountMinimum(0);
                    resetPage();
                  }}
                />
              )}

              {inStockOnly && (
                <Chip
                  label="In stock"
                  onDelete={() => {
                    setInStockOnly(false);
                    resetPage();
                  }}
                />
              )}

              {featuredOnly && (
                <Chip
                  label="Featured"
                  onDelete={() => {
                    setFeaturedOnly(false);
                    resetPage();
                  }}
                />
              )}

              <Button
                size="small"
                onClick={clearFilters}
                sx={{ textTransform: "none" }}
              >
                Clear all
              </Button>
            </Stack>
          )}

          <Box
            sx={{
              display: "flex",
              gap: 3,
              alignItems: "flex-start",
            }}
          >
            {/* Desktop filter panel: sticks below the top edge while the products scroll,
                and scrolls inside itself if it is taller than the screen.
                Everything is inline (no popup menus), so scrolling can never detach it. */}
            <Paper
              variant="outlined"
              sx={{
                display: { xs: "none", md: "block" },
                width: 260,
                flexShrink: 0,
                p: 2,
                borderRadius: 0,
                boxShadow: "none",

                position: "sticky",
                top: STICKY_TOP,
                maxHeight: `calc(100vh - ${STICKY_TOP + 16}px)`,
                overflowY: "auto",
                overscrollBehavior: "contain",
                overflowX: "hidden",
                scrollbarWidth: "thin",
                scrollbarColor: "#344052 transparent",

                backgroundColor: "#080B12",
                borderColor: "#273344",

                ...filterPanelSx,
              }}
            >
              {renderFilters(true)}
            </Paper>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              {filteredProducts.length === 0 ? (
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 3, sm: 5 },
                    textAlign: "center",
                    borderRadius: 2,
                    boxShadow: "none",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    No matching products
                  </Typography>

                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Try changing your search or filters.
                  </Typography>

                  <Button
                    onClick={clearFilters}
                    sx={{ mt: 2, textTransform: "none" }}
                  >
                    Clear all filters
                  </Button>
                </Paper>
              ) : (
                <>
                  <ProductGrid products={paginatedProducts} />

                  {pageCount > 1 && (
                    <Stack
                      sx={{
                        alignItems: "center",
                        mt: 4,
                      }}
                    >
                      <Pagination
                        count={pageCount}
                        page={currentPage}
                        onChange={(_, nextPage) => setPage(nextPage)}
                        disabled={isFetching}
                        siblingCount={1}
                        boundaryCount={1}
                      />

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Page {currentPage} of {pageCount}
                      </Typography>
                    </Stack>
                  )}
                </>
              )}
            </Box>
        </Box>
      </Stack>
    </Container>

      {/* Mobile filter drawer: fixed top bar and bottom button,
          only the filters in between scroll. */}
  <Drawer
    anchor="left"
    open={mobileFiltersOpen}
    onClose={() => setMobileFiltersOpen(false)}
    slotProps={{
      paper: {
        sx: {
          display: "flex",
          flexDirection: "column",
          width: { xs: "88vw", sm: 340 },
          maxWidth: "100%",
          p: 0,
          overflowY: "hidden",
          boxShadow: "none",
          backgroundColor: "#080B12",
          color: "#F5F7FA",
        },
      },
    }}
  >
    {/* Fixed top bar */}
    <Stack
      direction="row"
      sx={{
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 1.25,
        borderBottom: "1px solid #273344",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "#F5F7FA" }}
      >
        Filters
      </Typography>

      <Stack
        direction="row"
        spacing={0.5}
        sx={{ alignItems: "center" }}
      >
        <Button
          onClick={clearFilters}
          size="small"
          sx={{ textTransform: "none", color: "#00D9FF" }}
        >
          Clear all
        </Button>

        <IconButton
          aria-label="Close filters"
          onClick={() => setMobileFiltersOpen(false)}
          sx={{ color: "#F5F7FA" }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
    </Stack>

    {/* Scrollable filters */}
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        overscrollBehavior: "contain",
        p: 2,
        ...filterPanelSx,
      }}
    >
      {renderFilters(false)}
    </Box>

    {/* Fixed bottom button */}
    <Box
      sx={{
        flexShrink: 0,
        p: 2,
        borderTop: "1px solid #273344",
      }}
    >
      <Button
        fullWidth
        variant="contained"
        onClick={() => setMobileFiltersOpen(false)}
        sx={{
          minHeight: 46,
          borderRadius: 999,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          backgroundColor: "#00D9FF",
          color: "#04121A",
          "&:hover": {
            backgroundColor: "#00D9FF",
            boxShadow: "none",
          },
        }}
      >
        Show {filteredProducts.length} products
      </Button>
    </Box>
  </Drawer>
    </Box >
  );
}