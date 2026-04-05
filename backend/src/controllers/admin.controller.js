import { User } from "../models/user.model.js";
import { transporter } from "../utils/mailer.js";

const ALLOWED_ROLES = ["candidate", "interviewer", "admin"];
const DEFAULT_PASSWORD = "Password123!";

const normalizeRole = (role) => String(role || "").toLowerCase();

const createUniqueUsername = async (email) => {
  const localPart = email.split("@")[0] || "user";
  const sanitizedBase = localPart.toLowerCase().replace(/[^a-z0-9._-]/g, "") || "user";

  let username = sanitizedBase;
  let counter = 1;

  while (await User.exists({ username })) {
    username = `${sanitizedBase}${counter}`;
    counter += 1;
  }

  return username;
};

const sendNewUserMail = async ({ name, email, role }) => {
  await transporter.sendMail({
    from: '"Meet App" <anmolearn2120@gmail.com>',
    to: email,
    subject: "Your MeetPro account is ready",
    text: `Hi ${name},\n\nYour MeetPro account has been created by admin.\nRole: ${role}\nPassword: ${DEFAULT_PASSWORD}\n\nPlease log in and update your password after first login.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 12px;">MeetPro Account Access</h2>
        <p>Hi ${name},</p>
        <p>Your MeetPro account has been created by admin.</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Password:</strong> ${DEFAULT_PASSWORD}</p>
        <p>Please log in and update your password after first login.</p>
      </div>
    `,
  });
};

const sendRoleChangedMail = async ({ name, email, previousRole, updatedRole }) => {
  await transporter.sendMail({
    from: '"Meet App" <anmolearn2120@gmail.com>',
    to: email,
    subject: "Your MeetPro role has been updated",
    text: `Hi ${name},\n\nYour role in MeetPro has been updated.\nPrevious role: ${previousRole}\nNew role: ${updatedRole}\n\nIf this was not expected, please contact support.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 12px;">Role Update Notification</h2>
        <p>Hi ${name},</p>
        <p>Your role in MeetPro has been updated.</p>
        <p><strong>Previous role:</strong> ${previousRole}</p>
        <p><strong>New role:</strong> ${updatedRole}</p>
        <p>If this was not expected, please contact support.</p>
      </div>
    `,
  });
};

export const getAllUsersForAdmin = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return res.status(200).json({ users });
  } catch (err) {
    console.error("ADMIN GET USERS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const addUserByAdmin = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: "Name, email and role are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedRole = normalizeRole(role);

    if (!ALLOWED_ROLES.includes(normalizedRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const username = await createUniqueUsername(normalizedEmail);

    const user = await User.create({
      name: String(name).trim(),
      username,
      email: normalizedEmail,
      password: DEFAULT_PASSWORD,
      role: normalizedRole,
      provider: "local",
      isVerified: true,
      hasLoginAccess: true,
    });

    await sendNewUserMail({
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({
      message: "User added successfully",
      user: userObj,
    });
  } catch (err) {
    console.error("ADMIN ADD USER ERROR:", err);
    return res.status(500).json({ message: "Failed to add user" });
  }
};

export const updateUserRoleByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const normalizedRole = normalizeRole(role);

    if (!ALLOWED_ROLES.includes(normalizedRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const previousRole = user.role;

    if (previousRole === normalizedRole) {
      const sameRoleUser = await User.findById(userId).select("-password");
      return res.status(200).json({
        message: "Role is already set",
        user: sameRoleUser,
      });
    }

    user.role = normalizedRole;
    await user.save();

    await sendRoleChangedMail({
      name: user.name,
      email: user.email,
      previousRole,
      updatedRole: user.role,
    });

    const updatedUser = await User.findById(userId).select("-password");

    return res.status(200).json({
      message: "Role updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("ADMIN UPDATE ROLE ERROR:", err);
    return res.status(500).json({ message: "Failed to update role" });
  }
};
