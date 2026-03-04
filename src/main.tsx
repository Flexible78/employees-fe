import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider as ChakraProvider } from './components/ui/provider'
import { RouterProvider } from 'react-router-dom'
import router from './router/routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <ChakraProvider>
              <QueryClientProvider client={new QueryClient()}>
                <RouterProvider router={router}></RouterProvider>
              </QueryClientProvider>
        </ChakraProvider>
  </StrictMode>,
)
