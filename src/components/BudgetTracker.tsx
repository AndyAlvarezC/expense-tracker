import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import { useBudget } from "../hooks/useBudget";
import AmountDisplay from "./AmountDisplay";
import "react-circular-progressbar/dist/styles.css"
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react/jsx-runtime';

export default function BudgetTracker() {

  const { state, totalExpenses, remainingBudget, dispatch } = useBudget()
  const percentatge = +((totalExpenses / state.budget) * 100).toFixed(2)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="flex justify-center">
        <CircularProgressbar
          value={percentatge}
          styles={buildStyles({
            pathColor: percentatge === 100 ? "#DC2626" : "#3b82f6",
            trailColor: "#F5F5F5",
            textSize: 8,
            textColor: percentatge === 100 ? "#DC2626" : "#3b82f6",
          })}
          text={`${percentatge}% Spent`}
        />
      </div>

      <div className="flex flex-col justify-center items-center gap-8">
        <button
          type="button"
          className="bg-pink-600 w-full p-2 text-white uppercase font-bold rounded-lg cursor-pointer"
          onClick={() => dispatch({type: 'show-reset-modal'})}
        >
          Reset Budget
        </button>

        <Transition appear show={state.resetModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => dispatch({type: 'close-reset-modal'})}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/40 bg-opacity-50" />
            </Transition.Child>

            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                  <h2 className="text-lg mb-4 font-bold">
                    Are you sure you want to reset the budget?
                  </h2>
                  <div className="flex gap-4 justify-end">
                    <button
                      className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 font-bold"
                      onClick={() => dispatch({ type: 'close-reset-modal' })}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold"
                      onClick={() => dispatch({ type: 'reset-app' })}
                    >
                      Reset
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>



        <AmountDisplay label="Budget" amount={state.budget} />

        <AmountDisplay label="Available" amount={remainingBudget} />

        <AmountDisplay label="Spent" amount={totalExpenses} />
      </div>
    </div>
  );
}
