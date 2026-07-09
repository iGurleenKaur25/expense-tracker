import ExpenseItem from "./ExpenseItem";
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';

const ExpenseList = ({ expenses, onDelete, onEdit }) => {
  const handleExportCSV = () => {
    const formattedData = expenses.map((exp) => ({
      Date: new Date(exp.date).toLocaleDateString(),
      Category: exp.category,
      Description: exp.description,
      Amount: exp.amount,
      Type: exp.type,
    }));
    exportToCSV(formattedData, `expenses_${Date.now()}.csv`);
  };

  const handleExportPDF = () => {
    const columns = [
      { key: 'date', label: 'Date' },
      { key: 'category', label: 'Category' },
      { key: 'description', label: 'Description' },
      { key: 'amount', label: 'Amount' },
      { key: 'type', label: 'Type' },
    ];

    const formattedData = expenses.map((exp) => ({
      date: new Date(exp.date).toLocaleDateString(),
      category: exp.category,
      description: exp.description,
      amount: `Rs.${exp.amount}`,
      type: exp.type,
    }));

    exportToPDF(formattedData, columns, 'Expense History', `expenses_${Date.now()}.pdf`);
  };

  if (expenses.length === 0) {
    return <p>No expenses found</p>;
  }

  return (
    <div className="expense-list">
      <div className="export-buttons">
        <button onClick={handleExportCSV}>Export CSV</button>
        <button onClick={handleExportPDF}>Export PDF</button>
      </div>

      {expenses.map((expense) => (
        <ExpenseItem
          key={expense._id}
          expense={expense}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default ExpenseList;
