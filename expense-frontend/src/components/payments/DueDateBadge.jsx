const DueDateBadge = ({ nextDueDate, isClosed }) => {
  if (isClosed || !nextDueDate) return null;

  const due = new Date(nextDueDate);
  const now = new Date();
  const daysUntil = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  let label, bg, color;
  if (daysUntil < 0) {
    label = `Overdue by ${Math.abs(daysUntil)}d`;
    bg = "#fee2e2"; color = "#991b1b";
  } else if (daysUntil === 0) {
    label = "Due today";
    bg = "#fef3c7"; color = "#92400e";
  } else if (daysUntil <= 3) {
    label = `Due in ${daysUntil}d`;
    bg = "#fef3c7"; color = "#92400e";
  } else {
    label = `Due ${due.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
    bg = "#f3f4f6"; color = "#6b7280";
  }

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.3rem",
      fontSize: "0.7rem", fontWeight: 600, padding: "0.18rem 0.6rem",
      borderRadius: "20px", background: bg, color,
    }}>
      📅 {label}
    </span>
  );
};

export default DueDateBadge;