//src/server/api/routers/food.ts
// Import necessary dependencies
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";

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

});

// End of src/server/api/routers/food.ts

