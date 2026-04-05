"use client";
import { useState, FormEvent } from "react";
import UserForm from "../components/userForm";


export default function Users() {
    return (
        <div className="min-h-screen bg-zinc-100 px-4">
            <h1 className="text-4xl font-bold flex justify-center text-center py-10 text-black">
                Gerenciamento de Usuários
            </h1>

            <div className="flex flex-col md:flex-row gap-10 px-5 justify-start ">
                <div className="w-full md:w-[40%]">
                    <UserForm></UserForm>
                </div>
                {/* <div className="w-full md:flex">
                    
                </div> */}
            </div>
        </div>
    );
}