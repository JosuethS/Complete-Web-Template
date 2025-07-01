import { PrismaClient } from "@prisma/client";
import { createCookie } from "@remix-run/node";
import 'dotenv/config';

const prisma = new PrismaClient();
const visitorCookie = createCookie("visitor_id", {
  maxAge: 60 * 60 * 24 * 365, // 1 year
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
});

function getReferralSource(referer) {
  const ref = (referer || "").toLowerCase();
  if (ref.includes("facebook.com")) return "facebook";
  if (ref.includes("youtube.com")) return "youtube";
  if (ref.includes("instagram.com")) return "instagram";
  if (ref.includes("google.com")) return "google";
  return "direct";
}

function getDeviceType(userAgent) {
  if (!userAgent) return "desktop";
  if (/Mobile|Android/.test(userAgent)) {
    return /iPhone|iPad/.test(userAgent) ? "ios" : "android";
  }
  if (/Tablet/.test(userAgent)) return "tablet";
  return "desktop";
}

export async function trackAnalytics({ request }) {
  try {
    const cookieHeader = request.headers.get("Cookie");
    const cookies = await visitorCookie.parse(cookieHeader);

    const referer = request.headers.get("referer") || "";
    const userAgent = request.headers.get("user-agent") || "";
    const device = getDeviceType(userAgent);
    const referralSource = getReferralSource(referer);

    const analytics = await prisma.analytics.findUnique({
      where: { id: process.env.ANALYTICS_ID },
    });

    if (!analytics) {
      console.warn("Analytics record not found");
      return;
    }

    const updatedDeviceType = {
      ...analytics.device_type,
      [device]: (analytics.device_type?.[device] || 0) + 1,
    };

    const updatedReferralSource = {
      ...analytics.referral_source,
      [referralSource]: (analytics.referral_source?.[referralSource] || 0) + 1,
    };

    const isNewVisitor = !cookies;
    await prisma.analytics.update({
      where: { id: process.env.ANALYTICS_ID },
      data: {
        total_visitors: { increment: 1 },
        new_visitors: isNewVisitor ? { increment: 1 } : undefined,
        device_type: updatedDeviceType,
        referral_source: updatedReferralSource,
      },
    });

    // Return response headers to set cookie
    if (isNewVisitor) {
      const newCookie = await visitorCookie.serialize("unique"); // could use UUID
      return {
        headers: {
          "Set-Cookie": newCookie,
        },
      };
    }
  } catch (error) {
    console.error("Error tracking analytics:", error);
  }
}
