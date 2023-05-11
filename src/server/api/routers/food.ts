//src/server/api/routers/food.ts
//src/server/api/routers/food.ts
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";

export const foodRouter = createTRPCRouter({
  getAll: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.foodEntry.findMany({ where: { userId: ctx.userId } });
  }),
  create: privateProcedure
  .input(
    z.object({
      name: z.string(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.userId;

    if (!userId) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "User ID not found" });
    }

    const food = await ctx.prisma.foodEntry.create({
      data: {
        ...input,
        date: new Date(), 
        userId,
      },
    });

    return food;
  }),
});

