import React from "react";
import useAuth from "../Auth/hooks/useAuth";
import { Link } from "react-router-dom";
const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between bg-white px-6 py-5 shadow-sm md:px-10">
        <h1 className="text-2xl font-bold text-indigo-600">DevCollab</h1>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
          S
        </div>

        <button onClick={() => logout()}>Logout</button>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <section className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Welcome Back
          </p>

          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Welcome to <span className="text-indigo-600">DevCollab</span>
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Manage your organizations, collaborate with your team, and keep your
            projects organized in one place.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl">
              🏢
            </div>

            <h3 className="text-xl font-bold text-slate-900">Organizations</h3>

            <p className="mt-3 leading-6 text-slate-600">
              Create and manage your organizations and workspace details.
            </p>

            <Link to="/organization">
              <button className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700">
                Manage Organizations →
              </button>
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
              👥
            </div>

            <h3 className="text-xl font-bold text-slate-900">Teams</h3>

            <p className="mt-3 leading-6 text-slate-600">
              Bring team members together and collaborate on your work.
            </p>

            <button className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700">
              View Teams →
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-2xl">
              🚀
            </div>

            <h3 className="text-xl font-bold text-slate-900">Projects</h3>

            <p className="mt-3 leading-6 text-slate-600">
              Organize projects, track progress, and manage upcoming work.
            </p>

            <button className="mt-6 rounded-xl bg-amber-500 px-5 py-3 font-semibold text-white transition hover:bg-amber-600">
              View Projects →
            </button>
          </div>
        </section>

        <section className="mt-8 flex items-center gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl">
            💡
          </div>

          <div>
            <h3 className="font-bold text-slate-900">
              Stay productive, stay connected
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Build great things together with DevCollab.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
