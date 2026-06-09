import ExpenseItem from "./ExpenseItem";

const ExpenseList = ({ expenses, onDelete, onEdit }) => {
  if (expenses.length === 0) {
    return <p>No expenses found</p>;
  }

  return (
    <div className="expense-list">
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
