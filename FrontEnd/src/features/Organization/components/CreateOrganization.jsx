import React, { useState } from "react";
import useOrganization from "../hooks/useOrganization";

const CreateOrganization = () => {
  const [orgName, setOrgName] = useState("");
  const [validationError, setValidationError] = useState("");

  const {
    createOrganization,
    createError,
    createLoading,
  } = useOrganization();

  async function handleCreateOrganization(e) {
    e.preventDefault();

    // Empty name validation
    if (!orgName.trim()) {
      setValidationError("Organization name is required.");
      return;
    }

    // Clear previous validation error
    setValidationError("");

    // Call provider function
    const success = await createOrganization(orgName.trim());

    // Clear input only after success
    if (success) {
      setOrgName("");
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Create Organization
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Create an organization to organize your team and projects.
        </p>
      </div>

      <form onSubmit={handleCreateOrganization} className="space-y-5">
        <div>
          <label
            htmlFor="orgName"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Organization Name
          </label>

          <input
            id="orgName"
            type="text"
            value={orgName}
            onChange={(e) => {
              setOrgName(e.target.value);
              setValidationError("");
            }}
            placeholder="Enter organization name"
            disabled={createLoading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-gray-100"
          />

          {validationError && (
            <p className="mt-2 text-sm text-red-600">
              {validationError}
            </p>
          )}
        </div>

        {createError && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {createError}
          </p>
        )}

        <button
          type="submit"
          disabled={createLoading}
          className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createLoading ? "Creating Organization..." : "Create Organization"}
        </button>
      </form>
    </div>
  );
};

export default CreateOrganization;