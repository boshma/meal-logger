// src/server/api/root.ts
import { createTRPCRouter } from "~/server/api/trpc";
import { foodCollectionRouter } from "./routers/food/foodCollection";
import { mealLogRouter } from "./routers/food/mealLog";
import { nutrititionixRouter } from "./routers/food/nutritionix";
import { targetMacrosRouter } from "./routers/food/targetMacros";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  foodCollection: foodCollectionRouter,
  mealLog: mealLogRouter,
  nutritionix: nutrititionixRouter,
  targetMacros: targetMacrosRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
