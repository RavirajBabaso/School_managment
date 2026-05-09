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
                '#111827',
              color: '#FFFFFF',
              border:
                '1px solid rgb(30 41 59)',
              borderRadius:
                '16px',
              padding:
                '14px 16px',
              boxShadow:
                '0 10px 30px rgba(0,0,0,0.35)'
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

        <div className="min-h-screen bg-[#020817] text-white">
          <AppRouter />
        </div>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;