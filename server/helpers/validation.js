const isValidId = (id) => /^\d+$/.test(id);
const isValidDate = (value) => !Number.isNaN(Date.parse(value));
const isValidBudget = (value) => !Number.isNaN(Number(value));
const isValidTime = (value) => !Number.isNaN(Date.parse(`1970-01-01T${value}`));

export { isValidId, isValidDate, isValidBudget, isValidTime };
