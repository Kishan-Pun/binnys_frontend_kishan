import { User } from "../modules/users/user.model.js";

export const ensureSuperAdmin = async () => {
  try {
    const {
      SUPERADMIN_NAME,
      SUPERADMIN_EMAIL,
      SUPERADMIN_PASSWORD,
    } = process.env;

    // If env vars are not set, skip seeding
    if (!SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD) {
      console.log("[SuperAdmin] Env vars not set, skipping seeding.");
      return;
    }

    // Check if any superadmin already exists
    const existingSuperadmin = await User.findOne({ role: "superadmin" });

    if (existingSuperadmin) {
      console.log(
        `[SuperAdmin] Existing superadmin found (${existingSuperadmin.email}), skipping seeding.`
      );
      return;
    }

    // If none, create one
    const user = await User.create({
      name: SUPERADMIN_NAME || "Super Admin",
      email: SUPERADMIN_EMAIL,
      password: SUPERADMIN_PASSWORD, // will be hashed by pre-save hook
      role: "superadmin",
    });

    console.log(
      `[SuperAdmin] Superadmin created with email: ${user.email}. Remember to keep credentials safe.`
    );
  } catch (err) {
    console.error("[SuperAdmin] Failed to ensure superadmin:", err);
  }
};
