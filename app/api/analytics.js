/* --- Implement In Root.jsx ---

/ Running the analytics tracker 
export const loader = async ({request}) => {
  await trackAnalytics({request});
  return ({ok: true});
}


export default function App() {
  useEffect(() => {
    let id = localStorage.getItem("visitorId");
    let isReturning = true;

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("visitorId", id);
      isReturning = false;
    }

    // Send to server
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isReturning })
    });
  }, []);

  return();
}
*/

import { PrismaClient } from "@prisma/client"
import 'dotenv/config';

const prisma = new PrismaClient()

export async function trackAnalytics({ request }) {
  const ref = () => {
    const r = (navigator.referrer || "").toLowerCase();
    if (r.includes("facebook.com")) return "facebook";
    if (r.includes("youtube.com")) return "youtube";
    if (r.includes("instagram.com")) return "instagram";
    if (r.includes("google.com")) return "google";
    return "direct";
  };

  const ua = request.headers.get('user-agent') || ''
  const device = /Mobile|Android/.test(ua)
    ? /iPhone|iPad/.test(ua) ? 'ios' : 'android'
    : /Tablet/.test(ua) ? 'tablet' : 'desktop';


  const analytics = await prisma.analytics.findUnique({
    where: { id: "67e33232778642571f666ddf" },
  });

  const updatedDeviceType = {
    ...analytics.device_type,
    desktop: (analytics.device_type[device] || 0) + 1,
  };

  const updatedReferralSource = {
    ...analytics.referral_source,
    direct: (analytics.referral_source[ref()] || 0) + 1,
  };

  await prisma.analytics.update({
    where: { id: process.env.ANALYTICS_ID },
    data: {
      total_visitors: { increment: 1 },
      device_type: updatedDeviceType,
      referral_source: updatedReferralSource,
    }
  })

}


export async function action ({ request }) {

  const { isReturning } = await request.json();

  console.log("Checking for new User on this website...")

  await prisma.analytics.update({
    where: { id: process.env.ANALYTICS_ID },
    data: {
      totalViews: { increment: 1 },
      ...(isReturning ? {} : { newVisitors: { increment: 1 } }),
    },
  });

};
