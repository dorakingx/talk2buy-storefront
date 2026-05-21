import { NextResponse } from "next/server";
import { getProductById } from "@/lib/products";
import { getAppUrl, getStripe } from "@/lib/stripe";

function buildDemoSuccessUrl(
  productId: string,
  customerName?: string,
  userIntent?: string
): string {
  const appUrl = getAppUrl();
  const params = new URLSearchParams({
    demo: "1",
    productId,
    customerName: customerName ?? "Demo Guest",
  });
  if (userIntent?.trim()) {
    params.set("userIntent", userIntent.trim().slice(0, 200));
  }
  return `${appUrl}/checkout/success?${params.toString()}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, customerName, customerEmail, userIntent } = body;

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({
        demo: true,
        url: buildDemoSuccessUrl(productId, customerName, userIntent),
      });
    }

    const appUrl = getAppUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: product.currency,
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        productId: product.id,
        customerName: customerName ?? "",
        userIntent: (userIntent ?? "").slice(0, 500),
      },
      customer_email: customerEmail || undefined,
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Checkout session error:", e);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
