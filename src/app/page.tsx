import { HeroSlider } from '@/components/home/HeroSlider';
import { Categories } from '@/components/home/Categories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Deals } from '@/components/home/Deals';
import { Brands } from '@/components/home/Brands';
import { Newsletter } from '@/components/home/Newsletter';
import { Reviews } from '@/components/home/Reviews';
import { InstagramFeed } from '@/components/home/InstagramFeed';
import { FAQ } from '@/components/home/FAQ';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Slider */}
      <HeroSlider />

      {/* Categories */}
      <Categories />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Deals Section */}
      <Deals />

      {/* Brands */}
      <Brands />

      {/* Newsletter */}
      <Newsletter />

      {/* Customer Reviews */}
      <Reviews />

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* FAQ */}
      <FAQ />

      <Footer />
    </main>
  );
}
