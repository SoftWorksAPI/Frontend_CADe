"use client";

import { User } from "../users/page";

type Props = {
    usuarios: User[];
    setUsuarios: React.Dispatch<React.SetStateAction<User[]>>;
    setEditingUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export default function UserList({ usuarios, setUsuarios, setEditingUser }: Props) {

    function handleDelete(id: number) {
        setUsuarios((prev) => prev.filter((user) => user.id !== id));
    }

    return (
        <div className="w-full bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <h2 className="text-xl text-center font-bold mb-4 text-slate-800">
                Listar Usuários
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {usuarios.map((user) => (
                    <div key={user.id} className="p-4 bg-white rounded-xl shadow-md border border-slate-200">

                        <p className="font-semibold">{user.nome}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>

                        <div className="mt-3 flex gap-2">
                            <button
                                onClick={() => setEditingUser(user)}
                                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700 "
                            >
                                Editar
                            </button>

                            <button
                                onClick={() => handleDelete(user.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-700 "
                            >
                                Excluir
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}