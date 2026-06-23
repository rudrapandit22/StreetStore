import { Provider } from 'react-redux'
import { store } from './app.store.js'
import './App.css'
import { RouterProvider } from 'react-router'
import { routes } from './app.routes.jsx'

function App() {
  return (
   <Provider store={store}>
     <RouterProvider router={routes} />
   </Provider>
  )
}

export default App
