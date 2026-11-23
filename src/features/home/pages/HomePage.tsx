import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import PromoMarquee from "@/components/ui/PromoMarquee";
import CategoryCircles from "@/components/ui/CategoryCircles";
import LightningDeals from "@/components/ui/LightningDeals";
import BestSellers from "@/components/ui/BestSellers";
import AdBanner from "@/components/ui/AdBanner";
import HomepageVideos from "@/components/ui/HomepageVideos";
import BrandStatement from "@/components/ui/BrandStatement";
import WhoWeSupply from "@/components/ui/WhoWeSupply";
import { useStoreSettings } from "@/features/admin/hooks/useStoreSettings";
import { useCategoryCircles } from "@/features/admin/categoryCircles/hooks/useCategoryCircles";
import LazyMount from "@/components/ui/LazyMount";

export default function HomePage() {
  const { data: settings } = useStoreSettings();
  const { data: categories = [] } = useCategoryCircles();

  return (
    <>
      <Hero />

      <PromoMarquee
        variant="benefits"
        text={
          settings?.announcementBottomText ??
          "✨ NEW ARRIVALS • BULK ORDERS AVAILABLE • QUALITY CLEANING PRODUCTS • SHOP NOW"
        }
      />

      <CategoryCircles categories={categories} />

      <LazyMount minHeight={650}>
        <LightningDeals />
      </LazyMount>

      <LazyMount minHeight={500}>
        <WhoWeSupply />
      </LazyMount>

      <LazyMount minHeight={600}>
        <BestSellers />
      </LazyMount>

      <LazyMount minHeight={300}>
        <AdBanner />
      </LazyMount>

      <LazyMount minHeight={600}>
        <FeaturedProducts />
      </LazyMount>

      <LazyMount minHeight={500}>
        <HomepageVideos />
      </LazyMount>

      <LazyMount minHeight={300}>
        <BrandStatement />
      </LazyMount>
    </>
  );
}