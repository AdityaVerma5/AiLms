import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // This is the url to which the customer will be redirected when they are done
    // managing their billing with the portal.
    const returnUrl = 'https://strea-music.vercel.app/';
    const {customerId} = await req.json();

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    });

    return NextResponse.json({portalSession});
}