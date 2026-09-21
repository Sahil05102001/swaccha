import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import PromoMarquee from "@/components/ui/PromoMarquee";
import CategoryCircles from "@/components/ui/CategoryCircles";
import { useStoreSettings } from "@/features/admin/hooks/useStoreSettings";
import { useCategoryCircles } from "@/features/admin/categoryCircles/hooks/useCategoryCircles";
import BestSellers from "@/components/ui/BestSellers";
import AdBanner from "@/components/ui/AdBanner";
import HomepageVideos from "@/components/ui/HomepageVideos";
import BrandStatement from "@/components/ui/BrandStatement";


export default function HomePage() {
  const { data: settings } = useStoreSettings();

  const {
    data: categories = [],
  } = useCategoryCircles();

  return (
    <>
      <PromoMarquee
        text={
          settings?.announcementTopText ??
          "🔥 BUY 1 GET 1 FREE • FREE SHIPPING ON ORDERS ABOVE ₹999 • USE CODE: SWACHHA10"
        }
      />

      <Hero />

      <PromoMarquee
        text={
          settings?.announcementBottomText ??
          "✨ NEW ARRIVALS • BULK ORDERS AVAILABLE • QUALITY CLEANING PRODUCTS • SHOP NOW"
        }
      />

      <CategoryCircles
        categories={categories}
      />

      <BestSellers />
      <AdBanner />

      <HomepageVideos />
      <FeaturedProducts />
      <BrandStatement />
    </>
  );
}