'use client';

import { PencilIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';

function EditBtn({ todo_id }: { todo_id: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.push(`/edit/${todo_id}`);
      }}
    >
      <PencilIcon className="w-4 h-4" />
    </button>
  );
}

export default EditBtn;
