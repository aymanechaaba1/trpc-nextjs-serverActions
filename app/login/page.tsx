import { serverClient } from '../_trpc/serverClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function LoginPage() {
  const login = async (formData: FormData) => {
    'use server';

    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) return;

    const { user_id } = await serverClient.addUser({
      username,
      password,
    });

    const res = cookies().set('user_id', user_id);
    if (!res) return;

    if (res) redirect('/');
  };

  const users = await serverClient.getUsers();
  console.log(users);

  return (
    <form className="grid grid-cols-2 gap-3" action={login}>
      <input
        type="text"
        placeholder="username..."
        className="rounded-lg border px-4 py-2"
        name="username"
      />
      <input
        type="password"
        placeholder="password..."
        className="rounded-lg border px-4 py-2"
        name="password"
      />
      <button
        type="submit"
        className="bg-blue-500 rounded-lg text-center text-white px-4 py-2"
      >
        Login
      </button>
    </form>
  );
}

export default LoginPage;
