// app/root.jsx

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  LiveReload,
  useLoaderData,
} from "@remix-run/react";
import { useEffect } from "react";
import "./tailwind.css";
import { trackAnalytics } from "./api/analytics";


export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];


// Running the analytics tracker 
export const loader = async ({request}) => {
  await trackAnalytics({request});
  return ({status: true});
}


export default function App() {

useEffect(() => {
  console.log("useEffect is working!!!!!!!!!");

  const start = Date.now();

  const handleBeforeUnload = () => {
    const duration = Math.round((Date.now() - start) / 60000);
    console.log(`this is the duration: ${duration}`);

    const data = JSON.stringify({ duration });
    const blob = new Blob([data], { type: "application/json" });

    navigator.sendBeacon('/api/track-duration', blob);
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
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
