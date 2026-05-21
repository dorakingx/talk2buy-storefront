import type { Product } from "@/types";
import { formatPrice } from "@/lib/products";
import { CheckoutButton } from "./CheckoutButton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="glass-card rounded-2xl p-6 flex flex-col h-full hover:border-cyan-500/30 transition-colors">
      <h3 className="text-lg font-semibold text-slate-100 mb-2">{product.name}</h3>
      <p className="text-xs text-cyan-400/80 mb-2">{product.shortBenefit}</p>
      <p className="text-sm text-slate-400 flex-1 mb-4">{product.description}</p>
      <div className="flex items-center justify-between gap-4 mt-auto">
        <span className="text-xl font-bold text-cyan-400">
          {formatPrice(product.price, product.currency)}
        </span>
        <CheckoutButton productId={product.id} label="Buy now" />
      </div>
    </article>
  );
}
