import LoanItem from "./LoanItem";

const LoanList = ({ loans }) => {
  if (loans.length === 0) return <p>No loans found</p>;

  return (
    <div>
      {loans.map((loan) => (
        <LoanItem key={loan._id} loan={loan} />
      ))}
    </div>
  );
};

export default LoanList;
