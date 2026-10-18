import mongoose from "mongoose";
import Organization from "../models/organization.model.js";
import OrganizationMemberShip from "../models/organizationMembership.model.js";

export async function createOrganizationController(req, res) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { name } = req.body;

    const owner = req.user._id;

    // Check if organization already exists
    const isOrganizationAlreadyExists = await Organization.findOne({
      name,
      owner,
    }).session(session);

    if (isOrganizationAlreadyExists) {
      await session.abortTransaction();

      return res.status(409).json({
        success: false,
        message: "Organization already exists",
      });
    }

    // Create organization
    const [organization] = await Organization.create(
      [
        {
          name,
          owner,
        },
      ],
      { session },
    );

    // Create owner membership
    const [organizationMembership] = await OrganizationMemberShip.create(
      [
        {
          user: req.user._id,
          organization: organization._id,
          role: "owner",
        },
      ],
      { session },
    );

    // Save both operations permanently
    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Organization Created Successfully",
      organization,
      organizationMembership,
    });
  } catch (error) {
    await session.abortTransaction();

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create organization",
    });
  } finally {
    await session.endSession();
  }
}

export async function getMyOrganization(req, res) {
  try {
    const user = req.user._id;

    const organizationMemberShip = await OrganizationMemberShip.find({
      user,
    }).populate("organization");

    if (!organizationMemberShip) {
      return res.status(404).json({
        success: false,
        message: "Dont have any organization",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Organization Fetched Successfully",
      organizations,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function updateOrganizationController(req, res) {
  try {
    let user = req.user._id;
    let organization = req.params.id;

    const membership = await OrganizationMemberShip.findOne({
      user,
      organization,
      role: { $in: ["admin", "owner"] },
    });

    console.log(membership);

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "you are not allowed to update",
      });
    }

    const { name } = req.body;

    const updatedOrganization = await Organization.findByIdAndUpdate(
      membership.organization,
      { name },
      { new: true, runValidators: true },
    );

    if (!updatedOrganization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Organization updated successfully",
      updatedOrganization,
    });
  } catch (errpr) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}



export async function deleteOrganization(req, res) {
    const user = req.user._id;
    const organizationId = req.params.organizationId;

    try {
        // 1. Authorization — owner only
        const membership = await OrganizationMemberShip.findOne({
            user,
            organization: organizationId,
            role: "owner",
        });

        if (!membership) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this organization",
            });
        }

        // 2. Start transaction only after authorization
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            // 3. Delete organization
            const deletedOrganization =
                await Organization.findByIdAndDelete(
                    organizationId,
                    { session }
                );

            if (!deletedOrganization) {
                await session.abortTransaction();

                return res.status(404).json({
                    success: false,
                    message: "Organization not found",
                });
            }

            // 4. Delete organization memberships
            await OrganizationMemberShip.deleteMany(
                { organization: organizationId },
                { session }
            );

            // 5. Commit
            await session.commitTransaction();

            return res.status(200).json({
                success: true,
                message: "Organization deleted successfully",
            });

        } catch (error) {
            await session.abortTransaction();
            throw error;

        } finally {
            await session.endSession();
        }

    } catch (error) {
        console.error("Delete organization error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}
