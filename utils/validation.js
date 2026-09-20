const { parse, isValid } = require("date-fns");

const parsePositiveInt = (value) => {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
};

const parsePositiveAmount = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const parseMonthDayYear = (value, fieldName = "date") => {
  if (typeof value !== "string") {
    return { error: `${fieldName} must use MM/dd/yyyy or yyyy-MM-dd format.` };
  }

  const format = /^\d{2}\/\d{2}\/\d{4}$/.test(value) ? "MM/dd/yyyy" : "yyyy-MM-dd";
  const parsed = parse(value, format, new Date());
  if (!isValid(parsed)) {
    return { error: `${fieldName} must use MM/dd/yyyy or yyyy-MM-dd format.` };
  }

  return { value: parsed };
};

module.exports = { parsePositiveInt, parsePositiveAmount, parseMonthDayYear };
