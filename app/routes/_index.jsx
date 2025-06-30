import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { prisma } from '../utils/prisma.server';

export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }) {
  const analytics = await prisma.analytics.findUnique({
    where: { id: process.env.ANALYTICS_ID },
  });

  return analytics ?? {
    total_visitors: 0,
    newVisitors: 0,
    session_duration: 0,
    device_type: {},
    referral_source: {},
  };
}

export default function Index() {
  const data = useLoaderData();

  const [metrics, setMetrics] = useState(data);

  
  const totalVisitors = metrics.total_visitors ?? metrics.totalVisitors ?? 0;
  const newVisitors = metrics.new_visitors ?? metrics.newVisitors ?? 0;
  const sessionDuration = metrics.session_duration ?? 0;
  const deviceType = metrics.device_type ?? {};
  const referralSource = metrics.referral_source ?? {};

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
              <strong>Total Views:</strong> {totalVisitors}
            </li>
            <li>
              <strong>New Visitors:</strong> {newVisitors}
            </li>
            <li>
              <strong>Session Duration:</strong> {sessionDuration}{" "}
              minute{sessionDuration !== 1 ? "s" : ""}
            </li>
          </ul>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">By Device</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {Object.entries(deviceType).length === 0 ? (
                  <li>No data</li>
                ) : (
                  Object.entries(deviceType).map(([device, count]) => (
                    <li key={device}>
                      {device.charAt(0).toUpperCase() + device.slice(1)}: {count}
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-medium">By Referrer</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {Object.entries(referralSource).length === 0 ? (
                  <li>No data</li>
                ) : (
                  Object.entries(referralSource).map(([ref, count]) => (
                    <li key={ref}>
                      {ref.charAt(0).toUpperCase() + ref.slice(1)}: {count}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
