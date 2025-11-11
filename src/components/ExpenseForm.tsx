import { ChangeEvent, useState, FormEvent, useEffect } from "react";
import type { DraftExpense, Value } from "../types";
import { categories } from "../data/categories";
import DatePicker from "react-date-picker";
import 'react-calendar/dist/Calendar.css'
import 'react-date-picker/dist/DatePicker.css'
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {

  const [expense, setExpense] = useState<DraftExpense>({
    amount: 0,
    expenseName: '',
    category: '',
    date: new Date()
  })

  const [error, setError] = useState('')
  const [previousAmount, setPreviousAmount] = useState(0)
  const { dispatch, state, remainingBudget } = useBudget()

  useEffect(() => {
    if (state.editingId) {
      const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)
      [0]
      setExpense(editingExpense)
      setPreviousAmount(editingExpense.amount)
    }
  }, [state.editingId])

  const handleChangeDate = (value : Value) => {
    setExpense({
      ...expense,
      date: value
    })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    const isAmountField = ['amount'].includes(name)
    setExpense({
      ...expense,
      [name] : isAmountField ? +value : value
    })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (Object.values(expense).includes('')){
      setError('All fields are required')
      return
    }

    if ((expense.amount - previousAmount) > remainingBudget) {
      setError("This expense exceeds the budget");
      return;
    }

    if (state.editingId) {
      dispatch({type: 'update-expense', payload: {expense: {id: state.editingId, ...expense}}})
    } else {
      dispatch({ type: 'add-expense', payload: { expense } })
    }
    
    setExpense({ amount: 0, expenseName: "", category: "", date: new Date() });
    setPreviousAmount(0)
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
        {state.editingId ? "Update Expense" : "New Expense"}
      </legend>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div className="flex flex-col gap-2">
        <label htmlFor="number" className="text-xl">
          Expense Date:
        </label>
        <DatePicker
          className="bg-slate-100 p-2 border-0"
          value={expense.date}
          onChange={handleChangeDate}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="expenseName" className="text-xl">
          Expense Name:
        </label>
        <input
          type="text"
          id="expenseName"
          placeholder="Enter the expense name"
          className="bg-slate-100 p-2"
          name="expenseName"
          onChange={handleChange}
          value={expense.expenseName}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="number" className="text-xl">
          Amount:
        </label>
        <input
          type="number"
          id="amount"
          placeholder="Enter the expense amount, e.g., 300"
          className="bg-slate-100 p-2"
          name="amount"
          onChange={handleChange}
          value={expense.amount}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-xl">
          Category:
        </label>
        <select
          id="category"
          className="bg-slate-100 p-2 cursor-pointer"
          name="category"
          onChange={handleChange}
          value={expense.category}
        >
          <option value=""> -- Select -- </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <input
        type="submit"
        className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
        value={state.editingId ? 'Save Changes' : "Add Expense"}
      />
    </form>
  );
}
