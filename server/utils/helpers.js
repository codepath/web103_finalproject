import bcrypt from "bcrypt";

const saltRounds = 10;

const hashPassword = (password) => {
  console.log("hasing password");
  console.log(password);
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

const comparePassword = (raw, hash) => {
  console.log(raw);
  console.log(hash);
  return bcrypt.compareSync(raw, hash);
};

export { hashPassword, comparePassword };
