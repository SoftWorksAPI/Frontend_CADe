"use client";

import { User } from "../users/page";

type Props = {
    usuarios: User[];
    setUsuarios: React.Dispatch<React.SetStateAction<User[]>>;
};

export default function UserList({ usuarios, setUsuarios }: Props) {

    function handleDelete(id: number) {
        setUsuarios((prev) => prev.filter((user) => user.id !== id));
    }

    return (
        <div className="w-full bg-white rounded-xl shadow-md border border-slate-200 p-6">

            <h2 className="text-xl text-center font-bold mb-4 text-slate-800">
                Lista de Usuários
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {usuarios.map((user) => (
                    <div key={user.id} className="p-4 bg-white border border-slate-300 rounded-md  rounded-xl shadow-md">

                        <p className="font-semibold">{user.nome}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>

                        <button
                            onClick={() => handleDelete(user.id)}
                            className="mt-3 px-3 py-1 bg-red-700 text-white rounded-md hover:bg-red-600"
                        >
                            Excluir
                        </button>

                    </div>
                ))}
            </div>
        </div>
    );
}