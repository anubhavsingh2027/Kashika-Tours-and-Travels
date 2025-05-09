require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static("public"));

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Check required environment variables on server start
if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
  console.error("❌ GMAIL_USER or GMAIL_PASS is not defined in the environment variables.");
  process.exit(1); // Exit the app if critical config is missing
}

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Route to handle "Book Your Package" form
app.post("/book-package", (req, res) => {
  const { name, mobile, email, city, date, adults, children, message } = req.body;

  // Admin Email (Notification)
  const adminMailOptions = {
    from: `Kashika Travel <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: 'New Travel Package Booking Request Received ',
    html: `
      <h2>New Booking Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>City:</strong> ${city}</p>
      <p><strong>Date of Travel:</strong> ${date}</p>
      <p><strong>Adults:</strong> ${adults}</p>
      <p><strong>Children:</strong> ${children}</p>
      <p><strong>Message:</strong> ${message || 'No message provided.'}</p>
    `,
  };

  // User Confirmation Email (Thank You)
  const userMailOptions = {
    from: `Kashika Travel <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Thank you for reaching out to Kashika Travel',
    html: `
      <h2>Thank you for Booking in Kashika Travel!</h2>
      <p>Dear ${name},</p>
      <p> Here are the details you submitted:</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>City:</strong> ${city}</p>
      <p><strong>Date of Travel:</strong> ${date}</p>
      <p><strong>Adults:</strong> ${adults}</p>
      <p><strong>Children:</strong> ${children}</p>
      <p><strong>Message:</strong> ${message || 'No message provided.'}</p>
      <p>We will get back to you soon with more details.</p>
      <p>For any help contact: 7355026966</p>
      <p>Best regards,<br>Kashika Travel Team</p>
    `,
  };

  // Send email to admin
  transporter.sendMail(adminMailOptions, (error, info) => {
    if (error) {
      console.error("Error sending admin email:", error);
      return res.status(500).json({ success: false, message: "Failed to send email to admin." });
    }
    console.log("Admin email sent:", info.response);
  });

  // Send confirmation email to the user
  transporter.sendMail(userMailOptions, (error, info) => {
    if (error) {
      console.error("Error sending user email:", error);
      return res.status(500).json({ success: false, message: "Failed to send email to user." });
    }
    console.log("User confirmation email sent:", info.response);
    return res.status(200).json({ success: true, message: "Emails sent successfully." });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
