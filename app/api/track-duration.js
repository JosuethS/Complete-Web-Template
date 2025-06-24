import { PrismaClient } from "@prisma/client"
import 'dotenv/config';

const prisma = new PrismaClient()


export async function action ({ request }) {
    const { duration } = await request.json()

    await prisma.analytics.update({
      where: { id: process.env.ANALYTICS_ID },
      data: { sessionDuration: { increment: duration } },
    })

  return json({ status: "ok" });
};