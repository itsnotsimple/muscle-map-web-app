const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
      authProvider: 'local'
    });
    await newUser.save();

    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:8080'}/verify/${verificationToken}`;
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; background-color: #f8fafc; padding: 40px 20px;">
        <div style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 2px;">MUSCLE MAP</h1>
          </div>
          <div style="padding: 40px 32px; text-align: center;">
            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 20px;">
              <tr>
                <td align="center" valign="middle" style="font-size: 48px; line-height: 1;">📩</td>
              </tr>
            </table>
            <h2 style="color: #0f172a; margin: 0 0 12px; font-size: 22px; font-weight: 800;">Welcome to Muscle Map!</h2>
            <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">To get started and unlock all features, please verify your email address by clicking the button below:</p>
            <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; letter-spacing: 0.5px;">Verify Email</a>
            <p style="color: #94a3b8; font-size: 12px; margin: 28px 0 0; line-height: 1.5;">If you didn't create an account, you can safely ignore this email.</p>
          </div>
          <div style="background: #f1f5f9; padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} Muscle Map. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    sendEmail({
      to: email,
      subject: 'Welcome to Muscle Map - Verify Your Email',
      html: emailHtml
    }).catch(err => console.error('Email sending failed:', err));

    res.status(201).json({ message: "User created successfully. Please check your email to verify." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) return res.status(400).json({ message: "Invalid or expired verification token" });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: "Email successfully verified!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.authProvider !== 'local') return res.status(400).json({ message: `Use ${user.authProvider} login.` });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        email: user.email,
        savedExercises: user.savedExercises,
        theme: user.theme || 'system',
        language: user.language || 'en',
        physicalProfile: user.physicalProfile,
        isVerified: user.isVerified,
        authProvider: user.authProvider,
        unlockedBadges: user.unlockedBadges,
        createdAt: user.createdAt,
        isPremium: user.isPremium
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token) return res.status(400).json({ message: "No access token provided" });

    const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    if (!googleResponse.ok) throw new Error("Failed to verify Google Token");

    const payload = await googleResponse.json();
    const email = payload.email;

    if (!email) return res.status(400).json({ message: "No email associated" });

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = new User({ email, password: hashedPassword, isVerified: true, authProvider: 'google' });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        email: user.email, savedExercises: user.savedExercises, theme: user.theme,
        language: user.language, physicalProfile: user.physicalProfile, isVerified: user.isVerified,
        authProvider: user.authProvider, unlockedBadges: user.unlockedBadges, createdAt: user.createdAt,
        isPremium: user.isPremium
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Google Authentication Failed" });
  }
};

// ... User Profile logic
exports.getUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('isVerified isPremium');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ isVerified: user.isVerified, isPremium: user.isPremium });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { theme, language } = req.body;
    const user = await User.findById(req.user.id);
    if (theme) user.theme = theme;
    if (language) user.language = language;
    await user.save();
    res.json({ message: "Preferences updated", theme: user.theme, language: user.language });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateProfile = async (req, res) => {
  try {
    const { age, gender, height, weight, activityLevel } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.physicalProfile) user.physicalProfile = {};
    if (age !== undefined) user.physicalProfile.age = age;
    if (gender !== undefined) user.physicalProfile.gender = gender;
    if (height !== undefined) user.physicalProfile.height = height;
    if (weight !== undefined) user.physicalProfile.weight = weight;
    if (activityLevel !== undefined) user.physicalProfile.activityLevel = activityLevel;

    await user.save();
    res.json({ message: "Profile updated successfully", physicalProfile: user.physicalProfile });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ... Bookmark logic
exports.addBookmark = async (req, res) => {
  try {
    const { exercise } = req.body;
    const user = await User.findById(req.user.id);

    if (user.savedExercises.find(ex => ex.name === exercise.name)) {
      return res.status(400).json({ message: "Already saved" });
    }

    // Limit free users to 10 bookmarks
    if (!user.isPremium && user.savedExercises.length >= 10) {
      return res.status(403).json({ message: "LIMIT_REACHED" });
    }

    const newBookmark = { name: exercise.name, muscleGroup: exercise.muscleGroup, gif: exercise.gif || "", difficulty: exercise.difficulty || "Beginner" };
    user.savedExercises.push(newBookmark);
    await user.save();

    res.json(user.savedExercises);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.savedExercises);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedExercises.pull({ _id: req.params.id });
    await user.save();
    res.json(user.savedExercises);
  } catch (err) { res.status(500).json({ message: "Error" }); }
};

exports.addBadge = async (req, res) => {
  try {
    const { badgeId } = req.body;
    if (!badgeId) return res.status(400).json({ message: "Badge ID required" });
    const user = await User.findByIdAndUpdate(req.user.id, { $addToSet: { unlockedBadges: badgeId } }, { new: true });
    res.json({ message: "Badge unlocked", unlockedBadges: user.unlockedBadges });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.authProvider === 'local') {
      if (!password) return res.status(400).json({ message: "Password required" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Incorrect password" });
    }
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Account deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.authProvider !== 'local') return res.status(400).json({ message: "No standard account found with this email. You may have signed up with Google." });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 300000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:8080'}/reset-password/${resetToken}`;
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; background-color: #f8fafc; padding: 40px 20px;">
        <div style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 2px;">MUSCLE MAP</h1>
          </div>
          <div style="padding: 40px 32px; text-align: center;">
            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 20px;">
              <tr>
                <td align="center" valign="middle" style="font-size: 48px; line-height: 1;">🔒</td>
              </tr>
            </table>
            <h2 style="color: #0f172a; margin: 0 0 12px; font-size: 22px; font-weight: 800;">Reset Your Password</h2>
            <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">We received a request to reset your password. Click the button below to choose a new password:</p>
            <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; letter-spacing: 0.5px;">Reset Password</a>
            <p style="color: #94a3b8; font-size: 12px; margin: 28px 0 0; line-height: 1.5;">This link expires in 5 minutes. If you didn't request a password reset, you can safely ignore this email.</p>
          </div>
          <div style="background: #f1f5f9; padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} Muscle Map. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    sendEmail({ to: user.email, subject: 'Muscle Map - Password Reset', html: emailHtml }).catch(console.error);
    res.json({ message: "Reset link sent" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Token invalid/expired" });

    const isSame = await bcrypt.compare(password, user.password);
    if (isSame) return res.status(400).json({ message: "New password must be different" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "Password reset" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
