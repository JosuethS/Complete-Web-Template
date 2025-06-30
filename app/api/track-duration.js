import { PrismaClient } from "@prisma/client";
import { json } from "@remix-run/node"; // or '@remix-run/server-runtime'
import 'dotenv/config';

const prisma = new PrismaClient();

export async function action({ request }) {
  const { duration } = await request.json();

  console.log(`duration from api script ${duration}`);

  await prisma.analytics.update({
    where: { id: process.env.ANALYTICS_ID },
    data: { sessionDuration: { increment: duration } },
  });

  return json({ status: "ok" });
}

