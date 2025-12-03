import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import rootReducer from './config/redux/reducer/rootReducer'

const persistConfig = {
  key: 'root',
  storage,
  // whitelist: ['auth'],   // only persist some reducers (optional)
  // blacklist: ['temp'],   // or exclude some
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false, // required for redux-persist
    }),
  devTools: true, // ensures dev tools enabled
})

export const persistor = persistStore(store)
