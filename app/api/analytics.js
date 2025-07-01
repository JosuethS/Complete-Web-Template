import { PrismaClient } from "@prisma/client";
import 'dotenv/config';

const prisma = new PrismaClient();

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
  if (/Tablet/.test(userAgent)) {
    return "tablet";
  }
  return "desktop";
}

export async function trackAnalytics({ request }) {
  try {
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

    await prisma.analytics.update({
      where: { id: process.env.ANALYTICS_ID },
      data: {
        total_visitors: { increment: 1 },
        device_type: updatedDeviceType,
        referral_source: updatedReferralSource,
      },
    });
  } catch (error) {
    console.error("Error tracking analytics:", error);
  }
}