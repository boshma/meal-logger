//src/server/api/routers/food.ts
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const foodRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.foodEntry.findMany();
  }),
});
