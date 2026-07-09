import IncomeItem from "./IncomeItem";

const IncomeList = ({ income, onDelete, onEdit }) => {
  if (income.length === 0) return <p style={{ color: "#9ca3af", fontSize: "0.875rem", textAlign: "center", padding: "1rem" }}>No income recorded yet</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {income.map((i) => (
        <IncomeItem key={i._id} income={i} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default IncomeList;