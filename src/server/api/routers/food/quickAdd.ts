//src/server/api/routers/nutritionix.ts
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import axios from 'axios';
import { clerkClient } from "@clerk/nextjs/server";
import { filterUserForClient } from "../../../helpers/filterUserForClient";
import { searchFoodInDatabase } from "~/server/helpers/searchFoodInDatabase";

// Create a new ratelimiter, that allows 2 requests per 5 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "7 s"),
  analytics: true,
});



export const quickAddRouter = createTRPCRouter({
   // Define a private route that creates a new food entry for a user
   create: privateProcedure
   .input(
     z.object({
       name: z.string(),
       protein: z.number(),
       carbs: z.number(),
       fat: z.number(),
       servingSize: z.number().default(1),
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

});