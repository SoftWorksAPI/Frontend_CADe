"use client";

import { User } from "../users/page";

type Props = {
    usuarios: User[];
};

export default function UserList({ usuarios }: Props) {
    return (
        <div className="w-full bg-white rounded-xl shadow-md border border-slate-200 p-6">

            <h2 className="text-xl text-center font-bold mb-4 text-slate-800">
                Lista de Usuários
            </h2>

            {usuarios.length === 0 ? (
                <p className="text-sm text-slate-500 text-center">
                    Nenhum usuário cadastrado
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {usuarios.map((user) => (
                        <div key={user.id} className="p-4 bg-white border border-slate-200 rounded-md  rounded-xl shadow-md">
                            <p className="font-semibold">{user.nome}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}