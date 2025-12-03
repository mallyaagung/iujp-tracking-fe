const initialState = {
  sidebarShow: true,
  theme: 'light',
}

const interfaceReducer = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

export default interfaceReducer
