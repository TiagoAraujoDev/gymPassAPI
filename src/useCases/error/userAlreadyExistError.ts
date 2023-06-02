class UserAlreadyExistError extends Error {
  constructor() {
    super("User Already Exist!");
  }
}

export { UserAlreadyExistError };
