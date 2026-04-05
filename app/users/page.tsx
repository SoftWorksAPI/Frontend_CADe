"use client";

import { useState } from "react";
import UserForm from "../components/userForm";
import UserList from "../components/userList";

export type User = {
    id: number;
    nome: string;
    email: string;
    senha: string;
};

export default function Users() {
    const [usuarios, setUsuarios] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    return (
        <div className="min-h-screen bg-zinc-100 px-4">
            <h1 className="text-4xl font-bold flex justify-center text-center py-10 text-black">
                Gerenciamento de Usuários
            </h1>

            <div className="flex flex-col md:flex-row gap-10 px-5">

                <div className="w-full md:w-[40%]">
                    <UserForm
                        setUsuarios={setUsuarios}
                        editingUser={editingUser}
                        setEditingUser={setEditingUser}
                    />
                </div>

                <div className="w-full md:flex">
                    <UserList
                        usuarios={usuarios}
                        setUsuarios={setUsuarios}
                        setEditingUser={setEditingUser}
                    />
                </div>

            </div>
        </div>
    );
}