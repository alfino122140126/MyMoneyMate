import { configureStore } from '@reduxjs/toolkit';

import transactionReducer from './transactionSlice';
import categoryReducer from './categorySlice';
import debtReducer from './debtSlice';
import recurringExpenseReducer from './recurringExpenseSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    transaction: transactionReducer,
    category: categoryReducer,
    debt: debtReducer,
    recurringExpense: recurringExpenseReducer,
    auth: authReducer,
  },
});