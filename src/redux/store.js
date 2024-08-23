import {combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({user: userReducer});

const persisConfig = {
    key: "root",
    storage,
    version: 1,
}

const persistedReducer = persistReducer(persisConfig, rootReducer)


export const store = configureStore({
//   reducer: {user: userReducer},
    reducer : persistedReducer,
  middleware:(getDefualtMiddleware) =>getDefualtMiddleware({
    serializableCheck:false,
  })
})

export const persistor = persistStore(store)