//src/server/api/routers/food.ts
// Import necessary dependencies
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";


// Create a new ratelimiter, that allows 2 requests per 5 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "7 s"),
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
  // Define a private route that sets or updates target macros for a user
  setTargetMacros: privateProcedure
    .input(
      z.object({
        protein: z.number(),
        carbs: z.number(),
        fat: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      const targetMacros = await ctx.prisma.targetMacros.upsert({
        where: { userId },
        create: {
          ...input,
          userId,
          isSet: true,
        },
        update: {
          ...input,
          isSet: true,
        },
      });

      return targetMacros;
    }),
  // Define a private route that retrieves the latest target macros for a user
  getTargetMacros: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    const targetMacros = await ctx.prisma.targetMacros.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return targetMacros;
  }),
  // Define a private route that removes target macros for a user
  removeTargetMacros: privateProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.userId;

    // Update the isSet flag to false for all target macros for this user
    const targetMacros = await ctx.prisma.targetMacros.updateMany({
      where: { userId },
      data: {
        isSet: false, // isSet flag is false when user removes macros
      },
    });

    return targetMacros;
  }),

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
        ...meal,
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

// End of src/server/api/routers/food.ts

