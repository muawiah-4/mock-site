import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import CartSidebar from "@/components/CartSidebar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      {children}
      <CartSidebar />
    </CartProvider>
  );
}
