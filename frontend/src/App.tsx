import { RouterConfig } from '@navigation/RouterConfig';
import { reload, store } from '@store';
import 'antd/dist/antd.css';
import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';

// const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
// store={createStoreWithMiddleware(
//   store,
//   (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
//     (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
// )}

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <AppWithStore>
          <RouterConfig />
        </AppWithStore>
      </div>
    </Provider>
  );
}

function AppWithStore({ children }: { children?: JSX.Element }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(reload());
  }, []);

  return <>{children}</>;
}

export default App;
