import { PrismaClient } from "@prisma/client";
import { json } from "@remix-run/react";
import 'dotenv/config';

const prisma = new PrismaClient();

export async function action({ request }) {
  try {
    const { duration } = await request.json();

    console.log(duration);

    await prisma.analytics.update({
      where: { id: process.env.ANALYTICS_ID },
      data: { session_duration: { increment: duration } },
    });

    return json({ status: "ok" });
  } catch (error) {
    console.error(error);
    return json({ status: "error", message: error.message }, { status: 500 });
  }
}
