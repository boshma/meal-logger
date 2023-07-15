//src/server/api/routers/food/nutritionix.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { searchFoodInDatabase } from "~/server/helpers/searchFoodInDatabase";

export const nutrititionixRouter = createTRPCRouter({
  search: privateProcedure
  .input(z.object({ query: z.string() }))
  .query(async ({ ctx, input }) => {
    // Use a food database API to search for the food
    const food = await searchFoodInDatabase(input.query);

    return food;
  }),
// Add a searched meal to the meal log
addSearchedMealToLog: privateProcedure
  .input(
    z.object({
      userId: z.string(),
      meal: z.object({
        name: z.string(),
        protein: z.number(),
        carbs: z.number(),
        fat: z.number(),
      }),
      date: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const food = await ctx.prisma.foodEntry.create({
      data: {
        name: input.meal.name,
        protein: input.meal.protein,
        carbs: input.meal.carbs,
        fat: input.meal.fat,
        date: new Date(input.date),
        userId: input.userId,
      },
    });

    return food;
  }),
});