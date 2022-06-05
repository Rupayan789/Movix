import { persistReducer, persistStore } from "redux-persist";

import { legacy_createStore as createStore, applyMiddleware } from "redux";
import rootReducer from "./root-reducer";
import storage from "redux-persist/lib/storage";
import logger from "redux-logger";
const persistConfig = {
  key: "root",
  storage,
  blacklist: [],
};
const middlewares = [];
if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(...middlewares));
const persistor = persistStore(store);

export { store, persistor };
