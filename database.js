const pg = require("pg");
const Pool = pg.Pool;
require("dotenv").config();

// extract env variables from .env
const { POSTGRES_USER, POSTGRES_PASS, DATABASE } = process.env;

// create database pool that can be queried from
const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: POSTGRES_USER,
    password: POSTGRES_PASS,
    database: DATABASE,
});

// validate all inputs and make sure they're not vulnerable to any sort of SQL injection
const validateInputs = ([...inputs] = []) => {
    const a = new RegExp("w*((%27)|(';?--))((%6F)|o|(%4F))((%72)|r|(%52))", "i");
    const b = new RegExp("(%27)|(';?--)|(%23)|(#)", "i");
    // eslint-disable-next-line
    const c = new RegExp("(()|(=))[^\n]*((%27)|(';?--)|(--)|(%3B)|(;))", "i");
    const d = new RegExp("((%27)|(';?--))union", "i");
    const e = new RegExp("(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})", "gi");

    // loop through inputs and output an array of true values if SQL injection detected
    const inputsFiltered = inputs.filter((input) =>
        (a.test(input) || b.test(input) || c.test(input) || d.test(input) || e.test(input)) && true
    );

    return !(inputsFiltered.length > 0);
};

module.exports = {
    pool, validateInputs
};