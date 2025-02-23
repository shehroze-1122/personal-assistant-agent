"use client";

import { login } from "@/lib/actions";
import { useActionState } from "react";

const initialState = {
  message: "",
};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-tertiary p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
        <form action={formAction}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <p aria-live="polite" className="text-red-400 my-3">
            {state?.message}
          </p>
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            {pending ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
