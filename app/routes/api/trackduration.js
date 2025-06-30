// app/routes/api/trackduration.jsx

import { json } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function action({ request }) {
  try {
    const { duration } = await request.json();

    await prisma.analytics.update({
      where: { id: Number(process.env.ANALYTICS_ID) },
      data: { sessionDuration: { increment: duration } },
    });

    return json({ status: "ok" });
  } catch (error) {
    console.error(error);
    return json({ status: "error", message: error.message }, { status: 500 });
  }
}
