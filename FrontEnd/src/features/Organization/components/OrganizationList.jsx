import React from "react";
import useOrganization from "../hooks/useOrganization";
import { useState } from "react";

const OrganizationList = () => {
  const {
    organizations,
    organizationLoading,
    fetchError,
    updateOrganization,
    updateError,
    updateLoading,
    deleteOrganization,
    deleteError,
    deleteLoading,
  } = useOrganization();

  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");

  if (organizationLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
        <p className="text-sm font-medium text-slate-500">
          Loading organizations...
        </p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-xl">
            ⚠️
          </span>
          <div>
            <h3 className="font-bold">Unable to load organizations</h3>
            <p className="mt-1 text-sm">{fetchError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-14 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
          🏢
        </div>
        <h2 className="mt-5 text-xl font-bold text-slate-800">
          No organizations yet
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Create your first organization to start managing your workspace.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            Workspace
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Your Organizations
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage your organizations and workspace details.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          {organizations.length}{" "}
          {organizations.length === 1 ? "Organization" : "Organizations"}
        </div>
      </div>

      {/* Error messages */}
      {updateError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          Update failed: {updateError}
        </div>
      )}

      {deleteError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          Delete failed: {deleteError}
        </div>
      )}

      {/* Organization cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {organizations.map((org) => (
          <div
            key={org._id}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50"
          >
            {/* Decorative top line */}
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

            <div className="p-5 sm:p-6">
              {/* Organization information */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-2xl transition-transform duration-300 group-hover:scale-110">
                  🏢
                </div>

                <div className="min-w-0 flex-1">
                  {editingId === org.organization._id ? (
                    <div>
                      <label
                        htmlFor={`org-name-${org.organization._id}`}
                        className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500"
                      >
                        Organization name
                      </label>

                      <input
                        id={`org-name-${org.organization._id}`}
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        autoFocus
                        className="w-full rounded-xl border border-indigo-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                        placeholder="Enter organization name"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="break-words text-lg font-bold text-slate-900">
                        {org.organization.name}
                      </h3>

                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {org.role}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 border-t border-slate-100 pt-4">
                {editingId === org.organization._id ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={async (e) => {
                        if (!editedName.trim()) return;

                        const success = await updateOrganization(
                          org.organization._id,
                          editedName,
                        );

                        if (success) {
                          setEditingId(null);
                          setEditedName("");
                        }
                      }}
                      disabled={updateLoading}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {updateLoading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <span>✓</span>
                          Save Changes
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setEditedName("");
                      }}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        setEditingId(org.organization._id);
                        setEditedName(org.organization.name);
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    >
                      <span>✎</span>
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        const confirmed = window.confirm(
                          `Are you sure you want to delete "${org.organization.name}"?`,
                        );

                        if (!confirmed) return;

                        await deleteOrganization(org.organization._id);
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
                    >
                      <span>🗑</span>
                      {deleteLoading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizationList;