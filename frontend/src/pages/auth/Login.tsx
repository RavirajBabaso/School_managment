import {
  FormEvent,
  useState
} from 'react';

import axios from 'axios';

import {
  useNavigate
} from 'react-router-dom';

import {
  setCredentials
} from '../../store/authSlice';

import {
  useAppDispatch
} from '../../store/hooks';

import {
  useAuth
} from '../../hooks/useAuth';

function Login() {

  const dispatch =
    useAppDispatch();

  const { login } =
    useAuth();

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState(
      'chairman@adhira.edu'
    );

  const [password, setPassword] =
    useState(
      'Admin@123'
    );

  const [rememberMe, setRememberMe] =
    useState(true);

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    setError('');

    setIsLoading(true);

    try {

      /* Use API login for all users (Chairman, Director, Property, Finance, etc.) */
      await login({
        email,
        password
      });

      if (!rememberMe) {

        localStorage.removeItem(
          'refreshToken'
        );
      }

    } catch (loginError) {

      if (
        axios.isAxiosError(
          loginError
        ) &&
        loginError.response
          ?.status === 401
      ) {

        setError(
          'Invalid email or password.'
        );

      } else {

        setError(
          'Unable to sign in. Please try again.'
        );
      }

    } finally {

      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020817] px-4 py-10 text-white">

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute left-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute bottom-[-120px] right-[-120px] h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Login Card */}
      <section className="relative z-10 w-full max-w-[430px] rounded-[32px] border border-slate-800 bg-[#111827]/95 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">

        {/* Logo */}
        <div className="flex flex-col items-center text-center">

          <div className="flex h-[68px] w-[68px] items-center justify-center rounded-[22px] bg-gradient-to-br from-[#185FA5] to-[#3B82F6] text-xl font-bold text-white shadow-lg">
            EP
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-white">
            EduTask Pro
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            School Staff Task Management
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8"
        >

          {/* Email */}
          <label
            className="block text-sm font-medium text-slate-300"
            htmlFor="email"
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            autoComplete="email"
            placeholder="chairman@adhira.edu"
            required
            className="mt-2 h-12 w-full rounded-[16px] border border-slate-700 bg-[#0F172A] px-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-[#185FA5] focus:bg-[#111827]"
          />

          {/* Password */}
          <label
            className="mt-6 block text-sm font-medium text-slate-300"
            htmlFor="password"
          >
            Password
          </label>

          <div className="relative mt-2">

            <input
              id="password"
              type={
                showPassword
                  ? 'text'
                  : 'password'
              }
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              autoComplete="current-password"
              placeholder="Enter password"
              required
              className="h-12 w-full rounded-[16px] border border-slate-700 bg-[#0F172A] px-4 pr-20 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-[#185FA5] focus:bg-[#111827]"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (
                    current
                  ) => !current
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#60A5FA] transition hover:text-white focus:outline-none active:outline-none"
            >
              {showPassword
                ? 'Hide'
                : 'Show'}
            </button>
          </div>

          {/* Remember */}
          <label className="mt-5 flex items-center gap-3 text-sm text-slate-400">

            <input
              type="checkbox"
              checked={
                rememberMe
              }
              onChange={(event) =>
                setRememberMe(
                  event.target.checked
                )
              }
              className="h-4 w-4 rounded border-slate-600 bg-[#0F172A] accent-[#185FA5]"
            />

            Remember me
          </label>

          {/* Error */}
          {error ? (
            <div className="mt-5 rounded-[16px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
              {error}
            </div>
          ) : null}

          {/* Submit */}
          <button
            type="submit"
            disabled={
              isLoading
            }
            className="mt-7 flex h-12 w-full items-center justify-center rounded-[16px] bg-[#185FA5] px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#226fc0] focus:outline-none active:outline-none disabled:cursor-not-allowed disabled:opacity-70"
          >

            {isLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;