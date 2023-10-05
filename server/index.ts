import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const appRouter = router({
  addUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string().min(4),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.user.create({
        data: {
          username: input.username,
          password: input.password,
        },
      });
    }),
  getUsers: publicProcedure.query(async () => {
    return await prisma.user.findMany({
      include: {
        todos: true,
      },
    });
  }),
  getUser: publicProcedure
    .input(
      z.object({
        user_id: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.user.findUnique({
        where: {
          user_id: input.user_id,
        },
      });
    }),
  getTodos: publicProcedure
    .input(
      z.object({
        user_id: z.string().uuid(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.todo.findMany({
        where: {
          user_id: input.user_id,
        },
      });
    }),
  addTodo: publicProcedure
    .input(
      z.object({
        content: z.string(),
        user_id: z.string().uuid(),
        updated_at: z.date(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.todo.create({
        data: {
          content: input.content,
          user_id: input.user_id,
          updated_at: input.updated_at,
        },
      });
    }),
  deleteTodo: publicProcedure
    .input(
      z.object({
        todo_id: z.string().uuid(),
        user_id: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.todo.delete({
        where: {
          todo_id: input.todo_id,
          user_id: input.user_id,
        },
      });
    }),
  getTodo: publicProcedure
    .input(
      z.object({
        todo_id: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.todo.findUnique({
        where: {
          todo_id: input.todo_id,
        },
      });
    }),
  editTodo: publicProcedure
    .input(
      z.object({
        todo_id: z.string().uuid(),
        content: z.string().min(2),
        updated_at: z.date(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.todo.update({
        where: {
          todo_id: input.todo_id,
        },
        data: {
          content: input.content,
          updated_at: input.updated_at,
        },
      });
    }),
});

export type AppRouter = typeof appRouter;
