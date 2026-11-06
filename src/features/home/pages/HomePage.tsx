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
import WhoWeSupply from "@/components/ui/WhoWeSupply";

export default function HomePage() {
  const { data: settings } = useStoreSettings();

  const { data: categories = [] } =
    useCategoryCircles();

  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Benefits / Promotional Strip */}
      <PromoMarquee
        variant="benefits"
        text={
          settings?.announcementBottomText ??
          "✨ NEW ARRIVALS • BULK ORDERS AVAILABLE • QUALITY CLEANING PRODUCTS • SHOP NOW"
        }
      />

      {/* Categories */}
      <CategoryCircles categories={categories} />

      <WhoWeSupply/>

      {/* Best Sellers */}
      <BestSellers />

      {/* Promotional Banner */}
      <AdBanner />

      {/* New Arrivals */}
      <FeaturedProducts />

      {/* Customer / Visual Content */}
      <HomepageVideos />

      {/* Brand Statement */}
      <BrandStatement />
    </>
  );
}