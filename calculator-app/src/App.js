import React,{useState,useEffect} from 'react';

import './App.css';
import Alert from './components/Alert';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import uuid from "uuid/v4";
//const initialExpenses=[
 // {id:uuid(),charge:"rent",amount:1600},
  //{id:uuid(),charge:"car",amount:800},
  //{id:uuid(),charge:"bike",amount:500},
//];
const initialExpenses=localStorage.getItem("expenses")?
JSON.parse(localStorage.getItem("expenses")):[];


function App() {
  const [expenses,setExpenses]=useState(initialExpenses);
 const [charge,setCharge]=useState("");
 const [amount,setAmount]=useState("");
 const [alert,setAlert]=useState("show:false");
 const [edit,setEdit]=useState(false)
 const [id,setId]=useState(0);
 useEffect(()=>{
console.log("we alled useEffect");
localStorage.setItem("expenses",JSON.stringify(expenses));
 },[expenses]);
 useEffect(()=>{
   localStorage.removeItem("expenses")
 },[]);
 const handleCharge=e=>{
   console.log(`charge:${e.target.value}`);
   setCharge(e.target.value);
 };
 const handleAmount=e=>{
   console.log(`amount:${e.target.value}`)
  setAmount(e.target.value);
};
const handleAlert=({type,text})=>{
setAlert({show:true,type,text});
setTimeout(()=>{
  setAlert({show:false});
},3000)
};
const handleSubmit= e => {
  e.preventDefault();
  if(charge!=="" && amount>0){
    if(edit){
  let tempExpenses=expenses.map(item => {
    return item.id===id?{...item,charge,amount}:item;
  }); 
  setExpenses(tempExpenses);
  setEdit(false);
  handleAlert({type:"success" , text:"item edited"});
    }else{
      const singleExpense={id:uuid(),charge,amount};
      setExpenses([...expenses,singleExpense]);
      handleAlert({type:"success",text:"item added"});
    }
 
 setCharge("");
 setAmount("");
  }
  else{
    handleAlert({type:"danger",
    text:`charge cant be empty value  and 
    amount value has to be bigger than zero`});
  }
};
const clearItems=()=>{
  setExpenses([]);
  handleAlert({type:"danger",text:"all items deleted"})
  console.log("cleared all items");
};
const handleDelete=(id)=>{
  let tempExpenses=expenses.filter(item=>item.id!==id);
  setExpenses(tempExpenses);
  handleAlert({type:"danger",text:"item deleted"})
  console.log(`item deleted:${id}`)
}
const handleEdit=(id)=>{
  let expense=expenses.find(item=>item.id===id);
  let {charge,amount}=expense;
  setCharge(charge);
  setAmount(amount);
  setEdit(true);
  setId(id);
  console.log(expense);
};

  return (
    <>
     {alert.show && <Alert type={alert.type} text={alert.text}/> }
     <Alert/>
     <h1>budget calculator</h1>
     <main className="App">
     <ExpenseForm charge={charge}
     amount={amount}
     handleAmount={handleAmount}
     handleCharge={handleCharge}
     handleSubmit={handleSubmit}
     edit={edit}/>
     <ExpenseList expenses={expenses}  
     handleDelete={handleDelete}
     handleEdit={handleEdit}
     clearItems={clearItems}/> 
     </main>
  <h1>total spending:{" "}
  <span className="total">
    ${expenses.reduce((acc,curr)=>{
      return(acc+=parseInt(curr.amount));
    },0)}

  </span>
  </h1>

     
     
     
     
    </>
  );
}

export default App;
