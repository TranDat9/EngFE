import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist'

import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { useDispatch } from 'react-redux'
import storage from 'redux-persist/lib/storage'

import { AuthApi } from './services/Auth/auth'
import { blogApi } from './services/Blogs/blog.service'
import { categoryApi } from './services/Categories/category.service'
import { categoryBlogApi } from './services/CategoryBlog/CategoryBlog.service'
import { orderApi } from './services/Orders/orders.service'
import { productApi } from './services/Products/product.service'
import { userApi } from './services/Users/user.service'
import { authReducer } from './slices/auth.slice'
import { blogReducer } from './slices/blog.slice'
import { categoryReducer } from './slices/category.slice'
import { categoryBlogReducer } from './slices/categoryBlog.slice'
import { orderReducer } from './slices/order.slice'
import { themeReducer } from './slices/theme.slice'
import { userReducer } from './slices/user.slice'
import { productReducers } from './slices/product.slice'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth']
}

const rootReducer = combineReducers({
  auth: authReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const middlewares = [
  userApi.middleware,
  categoryApi.middleware,
  productApi.middleware,
  orderApi.middleware,
  blogApi.middleware,
  AuthApi.middleware,
  categoryBlogApi.middleware
]

export const store = configureStore({
  reducer: {
    /* redux toolkit query */
    [userApi.reducerPath]: userApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [categoryBlogApi.reducerPath]: categoryBlogApi.reducer,
    /* redux toolkit */
    persistedReducer,
    theme: themeReducer,
    categories: categoryReducer,
    products: productReducers,
    orders: orderReducer,
    blogs: blogReducer,
    user: userReducer,
    categoryBlog: categoryBlogReducer
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(...middlewares)
})

export const persistor = persistStore(store)
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
