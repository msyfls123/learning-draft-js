import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import RootReducer from '../reducers'

export function configureStore(initialState) {
  const store = createStore(
    RootReducer,
    initialState,
    compose(
      applyMiddleware(thunk),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')['default']
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
