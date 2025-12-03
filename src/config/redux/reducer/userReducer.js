const initialState = {
  isAuth: false,
}
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return {
        ...state,
        ...action.payload,
      }
    case 'USER_LOGOUT':
      return { isAuth: false }
    default:
      return state
  }
}
export default userReducer
