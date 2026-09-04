{expenses.map(expense=>{
    <div key = {expense._id}>
        {expense.title} - {expense.amount}
    </div>
})}

const foodExpenses = expenses.filter(expense => expense.category === "Food");
const totalFood = foodExpenses.reduce((total,foodExpense)=> total+foodExpense.amount , 0);
const expenseStrings = expenses.filter(expense => expense.amount > 500);
{expenseStrings.map(expense => (
    <div key = {expense._id}>
        {expense.title},
        {expense.amount}
    </div>
))}
const total = expenses.reduce((totall,expense) => totall + expense.amount ,0);
{expenseString.map((key ,index) => (
    <p key ={index}>{item}
    </p>
))}


const total = expenses
       .filter(expense => expense.category  === "Food")
       .filter(expense => expense.amount > 500)
       .reduce((totall , expense) => totall+expense.amount,0);

const updatedExpenses = [...expenses , newExpenses];
const updatedExpenses = [newExpenses , ...expenses];
const updatedExpenses = [...expenses , amount : 900];


const ExpenseDashboard = () => {
const [expenses, setExpenses] = useState([]);
const [loading, setLoading] = useState(false);


useEffect(() => {
    const update = async() => {
        setLoading(true);
        const {data} = await API.get("/expenses");
        setExpenses(data);
        setLoading(false);
    }
    update();
    } , [])
 
const handleDelete = async(id) => {

   await API.delete(`/expenses/${id}`);
   setExpenses(prev => prev.filter(expense => expense_.id !== id));
   
}
const handleUpdate = async(id,formData ) => {
    const {data} = await API.put(`/expenses/${id}`, formData);
    setExpenses(prev => prev.map(expense => expense._id === id ? {...expense,...data} : expense));
    
}

    if (loading) return <p>Loading...</p> ;
return(
    expenses.map(expense =>(
        <div key = {expense._id}>
            {expense.title} - ${expense.amount};
        </div>


    )))
}

const Update = ({id}) =>{

  const [formData, setFormData] = useState({
  title: "",
  amount: "",
  category: "",
  date: ""
});

function handleChange(e){
    setFormData(prev => ({
        ...prev,[e.target.name]
    :e.target.value}))
}

useEffect(() => {
    const update = async(id) => {
        
        const {data} = await API.get(`/expenses/${id}`);
        setFormData(data);
        
    }
    update(id);
    } , [id])
 
const handleSubmit = async(e) => {
    e.preventDefault();
    try{
    const {data} = await API.put(`/expenses/${id}` , formData);
    
    }catch(err)
    {console.log(err);}
}
    return (
        <div><form onSubmit={handleSubmit}>
        <input name="title" value={formData.title} onChange={handleChange} />
<input name="amount" value={formData.amount} onChange={handleChange} />
<input name="category" value={formData.category} onChange={handleChange}  />
<input name="date" value={formData.date} onChange={handleChange} />
<button >Click</button>
    </form></div>
    )

}
