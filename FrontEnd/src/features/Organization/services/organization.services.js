import organizationsApi from "./OrganizationApi";

export async function getMyOrganizationServices() {
  const response = await organizationsApi.get("/organizations/my");
  return response.data;
}

export async function createOrganizationServices(name) {
  const response = await organizationsApi.post(
    "/organizations/createOrganization",
    { name }
  );
  return response.data;
}

export async function updateOrganizationServices(
  organizationId,
  updatedName
) {
  const response = await organizationsApi.patch(
    `/organizations/UpdateOrganization/${organizationId}`,
    { name: updatedName }
  );

  return response.data;
}

export async function deleteOrganizationServices(organizationId) {
  const response = await organizationsApi.delete(
    `/organizations/deleteOrganization/${organizationId}`
  );

  return response.data;
}