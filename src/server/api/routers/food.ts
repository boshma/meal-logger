//src/server/api/routers/food.ts
// Import necessary dependencies
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";


// Create a new ratelimiter, that allows 1 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "30 s"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  //prefix: "@upstash/ratelimit",
});

// Create and export a router for food-related routes
export const foodRouter = createTRPCRouter({
  // Define a private route that retrieves all food entries for a user
  getAll: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.foodEntry.findMany({ where: { userId: ctx.userId } });
  }),

  // Define a private route that retrieves all food entries for a user on a given date
  getByDate: privateProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ ctx, input }) => {
      const date = new Date(input.date);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      nextDate.setHours(0, 0, 0, 0);  // Set the time to the start of the day

      return ctx.prisma.foodEntry.findMany({
        where: {
          userId: ctx.userId,
          date: {
            gte: date,
            lt: nextDate,
          },
        },
      });
    }),

  // Define a private route that creates a new food entry for a user
  create: privateProcedure
    .input(
      z.object({
        name: z.string(),
        protein: z.number(),
        carbs: z.number(),
        fat: z.number(),
        date: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      const { success } = await ratelimit.limit(userId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      // Check if the user ID exists. If not, throw an error.
      if (!userId) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "User ID not found" });
      }

      // Create a new food entry and return it
      const food = await ctx.prisma.foodEntry.create({
        data: {
          ...input,
          date: new Date(input.date),
          userId,
        },
      });

      return food;
    }),
  // Define a private route that deletes a food entry for a user   
  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const userId = ctx.userId;

      const foodEntry = await ctx.prisma.foodEntry.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!foodEntry) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No food entry found for the given ID and user',
        });
      }

      await ctx.prisma.foodEntry.delete({
        where: { id },
      });

      return { id };
    }),
  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        protein: z.number(),
        carbs: z.number(),
        fat: z.number(),
        date: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;

      // Verify that the food entry exists and belongs to the user
      const foodEntry = await ctx.prisma.foodEntry.findFirst({
        where: {
          id,
          userId: ctx.userId,
        },
      });

      if (!foodEntry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No food entry found for the given ID and user",
        });
      }

      // Update the food entry
      const updatedFood = await ctx.prisma.foodEntry.update({
        where: { id },
        data: {
          ...rest,
          date: new Date(input.date),
        },
      });

      return updatedFood;
    }),

});

// End of src/server/api/routers/food.ts

