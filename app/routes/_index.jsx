// app/routes/index.jsx
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { prisma } from '../utils/prisma.server'
import 'dotenv/config';


export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }) {
  const analytics = await prisma.analytics.findUnique({
    where: { id: process.env.ANALYTICS_ID }
  });

  return (analytics);
}

export default function Index() {
  const data = useLoaderData();
  const [metrics, setMetrics] = useState(data);

  useEffect(() => {
    let id = localStorage.getItem("visitorId");
    let isReturning = true;

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("visitorId", id);
      isReturning = false;
    }

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isReturning }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Analytics updated:", data);
      })
      .catch((err) => {
        console.error("❌ Tracking error:", err.message);
      });
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
              <strong>Total Views:</strong> {metrics.total_visitors}
            </li>
            <li>
              <strong>New Visitors:</strong> {metrics.new_visitors}
            </li>
            <li>
              <strong>Session Duration:</strong> {metrics.session_duration}{" "}
              minute{metrics.session_duration !== 1 ? "s" : ""}
            </li>
          </ul>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">By Device</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {Object.entries(metrics.device_type).map(([device, count]) => (
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
                {Object.entries(metrics.referral_source).map(([ref, count]) => (
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
