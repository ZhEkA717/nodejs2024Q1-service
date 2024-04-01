export const ErrorHandler = (err: unknown) => {
  const getClassOf = Function.prototype.call.bind(Object.prototype.toString);
  console.log(getClassOf(err));
};
