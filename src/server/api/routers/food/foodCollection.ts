//src/server/api/routers/food/foodCollection.ts
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";



export const foodCollectionRouter = createTRPCRouter({
   // Define a private route that retrieves all saved meals for a user
   getSavedMeals: privateProcedure
   .input(z.object({ userId: z.string() }))
   .query(async ({ ctx, input }) => {
     return ctx.prisma.savedMeal.findMany({ where: { userId: input.userId } });
   }),

 // Update SavedMeal
 updateSavedMeal: privateProcedure
   .input(
     z.object({
       userId: z.string(),
       mealId: z.string(),
       data: z.object({
         name: z.string().optional(),
         protein: z.number().optional(),
         carbs: z.number().optional(),
         fat: z.number().optional(),
       }),
     })
   )
   .mutation(async ({ ctx, input }) => {
     const meal = await ctx.prisma.savedMeal.findFirst({
       where: { id: input.mealId, userId: input.userId },
     });

     if (!meal) {
       throw new TRPCError({
         code: 'NOT_FOUND',
         message: 'No meal found for the given ID and user',
       });
     }

     const updatedMeal = await ctx.prisma.savedMeal.update({
       where: { id: input.mealId },
       data: input.data,
     });

     return updatedMeal;
   }),

 // Add meal to the meal log
 addMealToLog: privateProcedure
   .input(z.object({ userId: z.string(), mealId: z.string(), date: z.string() }))
   .mutation(async ({ ctx, input }) => {
     const meal = await ctx.prisma.savedMeal.findFirst({ where: { id: input.mealId, userId: input.userId } });

     if (!meal) {
       throw new TRPCError({
         code: 'NOT_FOUND',
         message: 'No meal found for the given ID and user',
       });
     }

     const food = await ctx.prisma.foodEntry.create({
       data: {
         name: meal.name,
         protein: meal.protein,
         carbs: meal.carbs,
         fat: meal.fat,
         date: new Date(input.date),
         userId: input.userId,
       },
     });

     return food;
   }),



 // Define a private route that deletes a saved meal for a user
 deleteSavedMeal: privateProcedure
   .input(z.object({ userId: z.string(), mealId: z.string() }))
   .mutation(async ({ ctx, input }) => {
     const meal = await ctx.prisma.savedMeal.findFirst({ where: { id: input.mealId, userId: input.userId } });

     if (!meal) {
       throw new TRPCError({
         code: 'NOT_FOUND',
         message: 'No meal found for the given ID and user',
       });
     }

     await ctx.prisma.savedMeal.delete({ where: { id: input.mealId } });

     return { id: input.mealId };
   }),
 // Create SavedMeal
 createSavedMeal: privateProcedure
   .input(
     z.object({
       userId: z.string(),
       data: z.object({
         name: z.string(), // make it required
         protein: z.number(),
         carbs: z.number(),
         fat: z.number(),
       }),
     })
   )
   .mutation(async ({ ctx, input }) => {
     const savedMeal = await ctx.prisma.savedMeal.create({
       data: {
         ...input.data,
         userId: input.userId,
       },
     });

     return savedMeal;
   }),

});
