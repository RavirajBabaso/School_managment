import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';

import { Toaster } from 'react-hot-toast';

import { Provider } from 'react-redux';

import AppRouter from './routes/AppRouter';

import { store } from './store';

const queryClient =
  new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider
        client={queryClient}
      >
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,

            style: {
              background:
                '#FFFFFF',
              color: '#0F172A',
              border:
                '1px solid rgb(226 232 240)',
              borderRadius:
                '16px',
              padding:
                '14px 16px',
              boxShadow:
                '0 16px 40px rgba(15,23,42,0.14)'
            },

            success: {
              iconTheme: {
                primary:
                  '#10B981',
                secondary:
                  '#FFFFFF'
              }
            },

            error: {
              iconTheme: {
                primary:
                  '#EF4444',
                secondary:
                  '#FFFFFF'
              }
            }
          }}
        />

        <div className="min-h-screen bg-[#F5F7FB] text-slate-950">
          <AppRouter />
        </div>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
