const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newLoan = {
      amount: loanAmount,
      tenure: loanTenure,
      purpose: loanPurpose,
    };
  
    try {
      const response = await fetch('http://localhost:5003/api/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLoan),
      });
  
      const data = await response.json();
      console.log('Loan submitted:', data);
      setLoanApplications([...loanApplications, data.loan]); // Update local state if needed
    } catch (error) {
      console.error('Error submitting loan:', error);
    }
  };
  