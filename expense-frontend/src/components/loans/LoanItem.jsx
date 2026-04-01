const LoanItem = ({ loan }) => {
  return (
    <div className="loan-item">
      <h4>Loan: ₹{loan.loanAmount}</h4>

      <p>Interest Rate: {loan.interestRate}%</p>
      <p>EMI: ₹{loan.emi}</p>
      <p>Months Saved: {loan.monthsSaved || 0}</p>
      <p>Interest Saved: ₹{loan.interestSaved || 0}</p>
      <p>Status: {loan.status}</p>

      <p>
        Estimated End Date:{" "}
        {loan.estimatedEndDate
          ? new Date(loan.estimatedEndDate).toLocaleDateString()
          : "N/A"}
      </p>
    </div>
  );
};

export default LoanItem;
