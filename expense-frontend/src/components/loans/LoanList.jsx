import LoanItem from "./LoanItem";
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';

const LoanList = ({ loans, onDelete, onEdit }) => {
  const handleExportCSV = () => {
    const formattedData = loans.map((loan) => ({
      LoanName: loan.name,
      Principal: loan.principal,
      InterestRate: loan.interestRate,
      EMI: loan.emi,
      RemainingBalance: loan.remainingBalance,
      NextDueDate: new Date(loan.nextDueDate).toLocaleDateString(),
    }));
    exportToCSV(formattedData, `loans_${Date.now()}.csv`);
  };

  const handleExportPDF = () => {
    const columns = [
      { key: 'name', label: 'Loan Name' },
      { key: 'principal', label: 'Principal' },
      { key: 'emi', label: 'EMI' },
      { key: 'remaining', label: 'Remaining' },
      { key: 'dueDate', label: 'Next Due' },
    ];

    const formattedData = loans.map((loan) => ({
      name: loan.name,
      principal: `Rs.${loan.principal}`,
      emi: `Rs.${loan.emi}`,
      remaining: `Rs.${loan.remainingBalance}`,
      dueDate: new Date(loan.nextDueDate).toLocaleDateString(),
    }));

    exportToPDF(formattedData, columns, 'Loan Summary', `loans_${Date.now()}.pdf`);
  };

  if (loans.length === 0) return <p>No loans found</p>;

  return (
    <div>
      <div className="export-buttons">
        <button onClick={handleExportCSV}>Export CSV</button>
        <button onClick={handleExportPDF}>Export PDF</button>
      </div>

      {loans.map((loan) => (
        <LoanItem
          key={loan._id}
          loan={loan}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default LoanList;