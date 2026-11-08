
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  username: z.string().min(1, 'User Name or Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setAuthError(null);

    try {
      // Mock login credentials
      const MOCK_EMAIL = 'admin@tqms.com';
      const MOCK_PASSWORD = 'password123';

      const enteredUsername = data.username.trim().toLowerCase();

      if (
        enteredUsername === MOCK_EMAIL &&
        data.password === MOCK_PASSWORD
      ) {
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Save logged-in user's email for the Profile page
        localStorage.setItem('tqms_logged_in_email', MOCK_EMAIL);

        // Save login preference
        localStorage.setItem(
          'tqms_remember_me',
          data.rememberMe ? 'true' : 'false'
        );

        // Navigate to the existing dashboard destination
        router.push('/admin/change-password');
      } else {
        setAuthError('Invalid email or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthError('An error occurred during login. Please try again.');
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center py-12 px-4">

      {/* BACKGROUND IMAGE */}
      <Image
        src="/background.jpg"
        alt="City Skyline Background"
        fill
        priority
        sizes="100vw"
        style={{
          objectFit: 'cover',
          objectPosition: 'bottom',
          zIndex: 0,
        }}
      />

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-[500px] bg-white rounded-lg shadow-xl overflow-hidden mb-6">

        <div className="h-28 w-full bg-[#b06000]" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 md:p-10 flex flex-col gap-5"
        >

          {/* HEADING */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Sign In
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Enter your user name and password to access admin panel.
            </p>
          </div>

          {/* AUTHENTICATION ERROR */}
          {authError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md font-medium">
              {authError}
            </div>
          )}

          {/* USERNAME / EMAIL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              User Name
            </label>

            <input
              type="text"
              placeholder="example@gmail.com, 9800000000"
              className={`w-full px-3 py-2 border rounded-md outline-none text-sm text-gray-700 transition ${
                errors.username
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-[#b06000]'
              }`}
              {...register('username')}
            />

            {errors.username && (
              <span className="text-xs text-red-500 font-medium">
                {errors.username.message}
              </span>
            )}
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1.5">

            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-xs text-gray-400 hover:text-gray-600 transition"
              >
                Forgot your password?
              </a>
            </div>

            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="******"
                className={`w-full pl-3 pr-10 py-2 border rounded-md outline-none text-sm text-gray-700 transition ${
                  errors.password
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-[#b06000]'
                }`}
                {...register('password')}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </button>
            </div>

            {errors.password && (
              <span className="text-xs text-red-500 font-medium">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* REMEMBER ME */}
          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              id="rememberMe"
              className="w-4 h-4 rounded text-[#b06000] focus:ring-[#b06000] border-gray-300 accent-[#b06000] cursor-pointer"
              {...register('rememberMe')}
            />

            <label
              htmlFor="rememberMe"
              className="text-sm font-semibold text-gray-700 cursor-pointer select-none"
            >
              Remember me
            </label>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 bg-[#b06000] hover:bg-[#905000] text-white font-medium rounded-md flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              />
            </svg>

            {isSubmitting ? 'Logging In...' : 'Log In'}
          </button>

        </form>
      </div>

      {/* SIGN UP */}
      <div className="relative z-10 text-sm text-gray-400 select-none">
        Don't have an account?{' '}

        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="text-gray-500 hover:text-amber-700 font-semibold underline transition"
        >
          Sign Up
        </a>
      </div>

    </main>
  );
}
