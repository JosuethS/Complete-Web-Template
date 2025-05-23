// app/routes/index.jsx
import { useEffect, useState } from "react";
import Analytics, { analyticsData } from "../utils/analytics/analytics";
import { useFetcher } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";

export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};



const prisma = new PrismaClient();



export const action = async ({ request }) => {
  const formData = await request.formData();
  const analytics = formData.get("data");

  console.log(analytics)



  return {ok: true}
}

export default function Index() {
  // mirror analyticsData into React state
  const [metrics, setMetrics] = useState({
    totalViews: 0,
    newVisitors: 0,
    sessionDuration: 0,
    deviceType: {},
    referrers: {},
  });

  const fetcher = useFetcher();


   useEffect( () => {
    // kick off analytics tracking
    Analytics.initialize();

    

    // poll every 2s for updates
    const interval = setInterval(() => {
      setMetrics({
        totalViews: analyticsData.totalViews,
        newVisitors: analyticsData.newVisitors,
        sessionDuration: analyticsData.sessionDuration,
        deviceType: { ...analyticsData.deviceType },
        referrers:  { ...analyticsData.referrers },
      });

      const update = async() => {
        await prisma.Analytics.update({
                where: {
                  id: "67e33232778642571f666ddf",
                },
                data: {
                  total_visitors: analytics.newVisitors,
                  new_visitors: analytics.totalViews,
                  session_duration: analytics.sessionDuration,
                  device_type: {...analytics.deviceType},
                  referal_source: {...analytics.referrers},
                },
              });
      } 

      update()

      fetcher.submit(
        { 
          data: analyticsData 
        }, 
        { 
          action: "/" 
        });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to <span className="sr-only">Remix</span>
          </h1>
          {/* your logos… */}
        </header>

        {/* Analytics dashboard */}
        <section className="w-full max-w-md rounded-2xl border p-6 shadow-sm dark:border-gray-700">
          <h2 className="mb-4 text-xl font-semibold">Live Analytics</h2>
          <ul className="space-y-2">
            <li>
              <strong>Total Views:</strong> {metrics.totalViews}
            </li>
            <li>
              <strong>New Visitors:</strong> {metrics.newVisitors}
            </li>
            <li>
              <strong>Session Duration:</strong> {metrics.sessionDuration}{" "}
              minute{metrics.sessionDuration !== 1 ? "s" : ""}
            </li>
          </ul>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">By Device</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {Object.entries(metrics.deviceType).map(([device, count]) => (
                  <li key={device}>
                    {device.charAt(0).toUpperCase() + device.slice(1)}:{" "}
                    {count}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium">By Referrer</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {Object.entries(metrics.referrers).map(([ref, count]) => (
                  <li key={ref}>
                    {ref.charAt(0).toUpperCase() + ref.slice(1)}: {count}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* your existing nav/resources… */}
        <nav className="flex flex-col items-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
          <p className="leading-6 text-gray-700 dark:text-gray-200">
            What&apos;s next?
          </p>
          <ul>
            {resources.map(({ href, text, icon }) => (
              <li key={href}>
                <a
                  className="group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {icon}
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

const resources = [
  /* … your existing resources … */
];
