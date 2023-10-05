import { revalidatePath } from 'next/cache';
import { serverClient } from './_trpc/serverClient';
import { TrashIcon } from '@heroicons/react/20/solid';
import EditBtn from '@/components/EditBtn';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Home() {
  const loggedInUser = cookies().get('user_id')?.value;
  if (!loggedInUser) redirect('/login');

  // find user in our db
  const userData = await serverClient.getUser({
    user_id: loggedInUser,
  });

  const todos = await serverClient.getTodos({
    user_id: loggedInUser,
  });

  const addTodo = async (formData: FormData) => {
    'use server';

    const new_todo = formData.get('todo') as string;
    if (!new_todo) return;

    await serverClient.addTodo({
      content: new_todo,
      updated_at: new Date(),
      user_id: loggedInUser,
    });

    revalidatePath('/');
  };

  const deleteTodo = async (formData: FormData) => {
    'use server';

    const todo_id = formData.get('todo_id') as string;
    if (!todo_id) return;

    await serverClient.deleteTodo({
      todo_id,
      user_id: loggedInUser,
    });

    revalidatePath('/');
  };

  return (
    <main>
      <form action={addTodo} className="flex items-center gap-3 mb-5">
        <input
          type="text"
          placeholder="Add a todo..."
          className="rounded-lg border px-4 py-2"
          name="todo"
        />
        <button className="px-4 py-2 bg-blue-500 rounded-md text-center text-white">
          Add
        </button>
      </form>
      <h1 className="text-xl mb-3">Welcome {userData?.username}, Your Todos</h1>
      <div className="space-y-3">
        {todos?.map((todo) => (
          <div className="flex items-center justify-between py-2 border rounded-lg px-4">
            <p className="text-sm">{todo.content}</p>
            <div className="flex items-center gap-3">
              <EditBtn todo_id={todo.todo_id} />
              <form>
                <input type="hidden" name="todo_id" value={todo.todo_id} />
                <button formAction={deleteTodo} className="hover:text-red-500">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
