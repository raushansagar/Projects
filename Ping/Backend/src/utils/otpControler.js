import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import { Otp } from "../models/user.model.js";
import bcrypt from "bcryptjs";



// ====================== SEND OTP ======================
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Sending OTP to:", email);

    // Generate a 6-digit OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // Hash the OTP before saving
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    // Remove old OTPs if any
    await Otp.deleteMany({ email });

    // Save new OTP
    await Otp.create({ email, otp: hashedOtp });
    console.log("Generated OTP:", otp);

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for port 465
      auth: {
        user:"thephoenix.ping@gmail.com",
        pass:"bxdkcdxrfqxoguxo",
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🔐 Your Ping Verification Code - Secure Access",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Ping Verification Code</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #334155;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
          }
          .header {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            padding: 45px 30px;
            text-align: center;
            color: white;
          }
          .ping-logo {
            font-size: 40px;
            font-weight: 700;
            letter-spacing: 2px;
            margin-bottom: 8px;
          }
          .otp-code {
            display: inline-block;
            font-size: 42px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: 10px;
            background: #f8fafc;
            padding: 25px 35px;
            border-radius: 12px;
            border: 2px dashed #3b82f6;
            font-family: 'Courier New', monospace;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="ping-logo">PING</div>
            <h2>Your Verification Code</h2>
            <p>Use this OTP to verify your account</p>
          </div>
          <div style="text-align:center; padding:40px;">
            <div class="otp-code">${otp}</div>
            <p style="margin-top:20px; color:#475569;">Expires in 5 minutes</p>
          </div>
          <div style="background:#0f172a; color:#94a3b8; text-align:center; padding:25px;">
            <strong>PING</strong>
            <p>Secure • Fast • Reliable</p>
            <p>© ${new Date().getFullYear()} Ping. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
      `,
      text: `Your Ping Verification Code: ${otp}\n\nThis code expires in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};




// ====================== VERIFY OTP ======================
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email });

    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Compare entered OTP with hashed OTP
    const isMatch = await bcrypt.compare(otp, record.otp);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Once verified, delete OTP
    await Otp.deleteMany({ email });

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};





// ====================== SEND ACCOUNT CREATED MESSAGE ======================
const sendWelcomeEmail = async (req, res) => {
  try {
    const { email, username, loginLink } = req.body; // ✅ fixed: added destructuring for username & loginLink

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🎉 Welcome to Ping WebChat – Your Account is Ready!",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to Ping WebChat</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #334155;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
          }
          .header {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            padding: 45px 30px;
            text-align: center;
            color: white;
          }
          .ping-logo {
            font-size: 40px;
            font-weight: 700;
            letter-spacing: 2px;
            margin-bottom: 8px;
          }
          .content {
            padding: 40px 35px;
            line-height: 1.7;
          }
          .button {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 8px;
            font-weight: 600;
          }
          .button:hover {
            background-color: #1e40af;
          }
          .footer {
            background: #0f172a;
            color: #94a3b8;
            text-align: center;
            padding: 35px 25px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="ping-logo">PING</div>
            <h1>Welcome to Ping WebChat!</h1>
            <p>Your account has been created successfully</p>
          </div>

          <div class="content">
            <p>Hi ${username || "there"},</p>
            <p>We're excited to have you join <strong>Ping WebChat</strong> — your secure space for fast, real-time conversations.</p>

            <div style="background:#eff6ff; padding:15px; border-left:5px solid #3b82f6; border-radius:8px;">
              💬 You can now log in and start chatting instantly.
            </div>

            <p style="text-align:center; margin-top:25px;">
              <a href="${loginLink || "#"}" class="button">Go to Ping WebChat</a>
            </p>
          </div>

          <div class="footer">
            <strong>PING</strong>
            <p>Connect • Chat • Share</p>
            <p>© ${new Date().getFullYear()} Ping. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Welcome email sent successfully!" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Failed to send welcome email" });
  }
};

export { sendOtp, verifyOtp, sendWelcomeEmail };
