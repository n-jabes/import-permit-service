// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = 8000; // Choose any port you prefer

app.use(bodyParser.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nshutij7@gmail.com', // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
});

// Endpoint to handle form data submission
app.post('/api/v1/registerDetails', (req, res) => {
  // Retrieve data from the request body
  const {
    nationalId,
    passportId,
    otherNames,
    surname,
    nationality,
    telephone,
    email,
    businessType,
    companyName,
    tinNumber,
    regDate,
    businessDistrict,
    purpose,
    category,
    productName,
    weight,
    unit,
    quantity,
    description,
    citizenship,
    district,
    otherpurpose,
  } = req.body;

  const mailOptions = {
    from: 'nshutij7@gmail.com',
    to: email, // g.ishimwe@irembo.com
    subject: 'Service Payload',
    html: `
      <p><strong>Business Owner Details:</strong></p>
      <p>Citizenship: ${citizenship}</p>
      <p>National ID: ${nationalId}</p>
      <p>Passport ID: ${passportId}</p>
      <p>Other Names: ${otherNames}</p>
      <p>Surname: ${surname}</p>
      <p>Nationality: ${nationality}</p>
      <p>Telephone: ${telephone}</p>
      <p>Email: ${email}</p>
      <p>Location: ${district}</p>
      <hr>
      <p><strong>Business Details:</strong></p>
      <p>Business Type: ${businessType}</p>
      <p>Company Name: ${companyName}</p>
      <p>TIN Number: ${tinNumber}</p>
      <p>Registration Date: ${regDate}</p>
      <p>Business Location: ${businessDistrict}</p>
      <hr>
      <p><strong>Product Information:</strong></p>
      <p>Purpose of Importation: ${purpose}</p>
      <p>Other Purpose: ${otherpurpose}</p>
      <p>Category: ${category}</p>
      <p>Product Name: ${productName}</p>
      <p>Weight (kg): ${weight}</p>
      <p>Unit of Measurement: ${unit}</p>
      <p>Quantity: ${quantity}</p>
      <p>Description: ${description}</p>
    `,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'An error occurred while sending email' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Details registered successfully' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
