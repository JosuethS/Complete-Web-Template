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
    console.log("useEffect is working!!!!!!!!!")

    let start = Date.now()
    window.addEventListener('beforeunload', async () => {
      const duration = Math.round((Date.now() - start) / 60000)
      console.log(`this is the duration: ${duration}`)
      await fetch('/api/track-duration', {
        method: 'POST',
        body: JSON.stringify({ duration }),
      })
    })
  }, [])
  
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
