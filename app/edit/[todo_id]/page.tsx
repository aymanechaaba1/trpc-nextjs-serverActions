import { serverClient } from '@/app/_trpc/serverClient';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  params: {
    todo_id: string;
  };
};
async function EditTodoPage({ params: { todo_id } }: Props) {
  const todo = await serverClient.getTodo({
    todo_id,
  });

  const editTodo = async (formData: FormData) => {
    'use server';

    const new_content = formData.get('new_content') as string;
    if (!new_content) return;

    await serverClient.editTodo({
      todo_id,
      content: new_content,
      updated_at: new Date(),
    });

    // update todos
    revalidatePath('/');

    // redirect users to todos list
    redirect('/');
  };

  return (
    <>
      <form action={editTodo} className="flex items-center gap-3">
        <input
          type="text"
          placeholder="new todo..."
          className="border rounded-lg px-4 py-2"
          defaultValue={todo?.content}
          name="new_content"
        />
        <button
          type="submit"
          className="bg-blue-500 rounded-lg px-4 py-2 text-white text-center"
        >
          Edit
        </button>
      </form>
    </>
  );
}

export default EditTodoPage;
