import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  addTodo: protectedProcedure
    .input(
      z.object({
        title: z.string().optional(),
        text: z.string().min(1),
        isCompleted: z.boolean().default(false),
      })
    )
    .mutation(({ input, ctx }) => {
      const { title, text, isCompleted } = input;
      const { prisma, session } = ctx;
      const userId = session.user.id;
      return ctx.prisma.toDo.create({
        data: {
          title,
          text,
          isCompleted,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
  getAllToDos: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.toDo.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.toDo.findMany({
      where: {
        id: input,
      },
    });
  }),
  deleteToDoById: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.toDo.delete({
        where: {
          id: input,
        },
      });
    }),
  deleteToDoCompleted: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.toDo.deleteMany({
      where: {
        isCompleted: {
          equals: true,
        },
      },
    });
  }),
  toggleToDo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        isCompleted: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, isCompleted } = input;
      await ctx.prisma.toDo.update({
        where: {
          id,
        },
        data: {
          isCompleted,
        },
      });
    }),
});
