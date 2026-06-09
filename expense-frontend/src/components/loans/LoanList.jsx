import LoanItem from "./LoanItem";

const LoanList = ({ loans , onDelete, onEdit }) => {
  if (loans.length === 0) return <p>No loans found</p>;

  return (
    <div>
      {loans.map((loan) => (
        <LoanItem key={loan._id} loan={loan}
        onDelete={onDelete}
          onEdit={onEdit} />
        
      ))}
    </div>
  );
};

export default LoanList;
