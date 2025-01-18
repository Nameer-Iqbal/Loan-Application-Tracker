const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // to parse JSON requests

// Sample loan applications
let loanApplications = [];

// User routes
app.post('/api/loan-application', (req, res) => {
  const { email, loanAmount, tenure, purpose } = req.body;

  // Create a new loan application
  const newApplication = {
    id: loanApplications.length + 1,
    email,
    loanAmount,
    tenure,
    purpose,
    status: 'Pending',
    adminComment: '',
  };

  loanApplications.push(newApplication);

  return res.status(201).json(newApplication);
});

app.get('/api/loan-application/:email', (req, res) => {
  const { email } = req.params;

  // Filter loan applications by user email
  const userApplications = loanApplications.filter(app => app.email === email);

  return res.status(200).json(userApplications);
});

// Admin routes
app.get('/api/loan-applications', (req, res) => {
  return res.status(200).json(loanApplications);
});

app.put('/api/loan-application/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, comment } = req.body;

  // Find the application and update its status
  const application = loanApplications.find(app => app.id == id);
  
  if (application) {
    application.status = status;
    application.adminComment = comment;
    return res.status(200).json(application);
  } else {
    return res.status(404).json({ message: 'Application not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
