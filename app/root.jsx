import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useEffect } from "react";
import "./tailwind.css";
import { trackAnalytics } from "./api/analytics"; // This is a server utility, NOT a route!

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href:
      "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// Run server-side analytics on every page load via loader
export const loader = async ({ request }) => {
  await trackAnalytics({ request });
  return { status: true };
};

export default function App() {
  useEffect(() => {
    console.log("useEffect is working!");

    const start = Date.now();

    // Use sendBeacon to send data when page unloads (reliable for unload events)
    const handleBeforeUnload = () => {
      const duration = Math.round((Date.now() - start) / 60000);
      console.log(`this is the duration: ${duration}`);

      const data = JSON.stringify({ duration });

      navigator.sendBeacon("/api/trackduration", data);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup event listener when component unmounts (best practice)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
