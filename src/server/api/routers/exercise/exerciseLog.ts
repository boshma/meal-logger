//src/server/api/routers/exercise/exerciseLog.ts
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const exerciseLogRouter = createTRPCRouter({
  create: privateProcedure
  .input(
    z.object({
      name: z.string(),
      weight: z.number(),
      reps: z.number(),
      date: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.userId;
    if (!userId) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "User ID not found" });
    }

    const exercise = await ctx.prisma.exerciseEntry.create({
      data: {
        ...input,
        date: new Date(input.date),
        userId,
      },
    });

    return exercise;
  }),

update: privateProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string(),
      weight: z.number(),
      reps: z.number(),
      date: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { id, ...rest } = input;
    const exerciseEntry = await ctx.prisma.exerciseEntry.findFirst({
      where: {
        id,
        userId: ctx.userId,
      },
    });

    if (!exerciseEntry) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No exercise entry found for the given ID and user",
      });
    }

    const updatedExercise = await ctx.prisma.exerciseEntry.update({
      where: { id },
      data: rest,
    });

    return updatedExercise;
  }),

    
  // Fetch all exercise records of a user for a particular date  
  getByDate: privateProcedure
    .input(z.object({ date: z.string(), userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const date = new Date(input.date);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      nextDate.setHours(0, 0, 0, 0);  

      return ctx.prisma.exerciseEntry.findMany({
        where: {
          userId: input.userId,
          date: {
            gte: date,
            lt: nextDate,
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
    }),

  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const userId = ctx.userId;

      const exerciseEntry = await ctx.prisma.exerciseEntry.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!exerciseEntry) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No exercise entry found for the given ID and user',
        });
      }

      await ctx.prisma.exerciseEntry.delete({
        where: { id },
      });

      return { id };
    }),
});
