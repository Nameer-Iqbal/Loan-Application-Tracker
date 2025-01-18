import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Hardcoded credentials
  const adminCredentials = { email: 'admin@loantracker.com', password: 'admin123' };
  const userCredentials = { email: 'user@loantracker.com', password: 'user123' };

  const handleLogin = () => {
    if (email === adminCredentials.email && password === adminCredentials.password) {
      window.location.href = '/admin-dashboard';
    } else if (email === userCredentials.email && password === userCredentials.password) {
      window.location.href = '/user-dashboard';
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center', backgroundColor: '#f5f0ff', padding: '20px', borderRadius: '8px' }}>
        <h1>Loan Application</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [purpose, setPurpose] = useState('');
  const [applications, setApplications] = useState([]);
  const email = 'user@loantracker.com'; // Replace with dynamic user email

  const submitLoanApplication = async () => {
    const response = await fetch('http://localhost:5000/api/loan-application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, loanAmount, tenure, purpose })
    });
    const result = await response.json();
    if (response.ok) {
      setApplications((prev) => [...prev, result]);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      const response = await fetch(`http://localhost:5000/api/loan-application/${email}`);
      const result = await response.json();
      setApplications(result);
    };
    fetchApplications();
  }, [email]);

  return (
    <div>
      <h1>User Dashboard</h1>
      <input type="number" placeholder="Loan Amount" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
      <input type="number" placeholder="Tenure" value={tenure} onChange={(e) => setTenure(e.target.value)} />
      <input type="text" placeholder="Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
      <button onClick={submitLoanApplication}>Submit Application</button>
      <h2>Submitted Applications</h2>
      <ul>
        {applications.map((app) => (
          <li key={app.id}>
            <p>Loan Amount: {app.loanAmount}</p>
            <p>Tenure: {app.tenure}</p>
            <p>Status: {app.status}</p>
            <p>Comment: {app.adminComment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AdminDashboard = () => {
  const [loanApplications, setLoanApplications] = useState([]);

  const fetchLoanApplications = async () => {
    const response = await fetch('http://localhost:5000/api/loan-applications');
    const result = await response.json();
    setLoanApplications(result);
  };

  const updateStatus = async (id, status, comment) => {
    const response = await fetch(`http://localhost:5000/api/loan-application/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, comment })
    });
    const result = await response.json();
    if (response.ok) {
      fetchLoanApplications(); // Refresh list
    }
  };

  useEffect(() => {
    fetchLoanApplications();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        {loanApplications.map((app) => (
          <li key={app.id}>
            <p>Loan Amount: {app.loanAmount}</p>
            <p>Tenure: {app.tenure}</p>
            <p>Status: {app.status}</p>
            <button onClick={() => updateStatus(app.id, 'Approved', 'Approved by admin')}>Approve</button>
            <button onClick={() => updateStatus(app.id, 'Rejected', 'Rejected by admin')}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
);

export default App;
