/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import { allPass, compose, flip, gt, length, lt, partial, prop, tap } from "ramda";
import Api from "../tools/api";
function composeAsync() {
  const fns = Array.prototype.slice.call(arguments, 0);

  return function composed(initial) {
    return fns.reduceRight((promise, fn) => {
      return promise.then(fn).catch(() => {
        console.log("ERRRRRR");
      });
    }, Promise.resolve(initial));
  };
}
const api = new Api();
const getValue = prop("value");
const getWriteLog = prop("writeLog");
const getHandleSuccess = prop("handleSuccess");
const gethHandleError = prop("handleError");

const getApi = api.get;

//   validation
const pattern = /^[0-9.]+$/;
const ValidationErrorMessage = "ValidationError";

const hasNumberValidCharacters = (string) => pattern.test(string);
const isValueLess10 = gt(10);
const isValueMore2 = lt(2);
const isLengthOfNumberLess10 = compose(isValueLess10, length);
const isLengthOfNumberMore2 = compose(isValueMore2, length);
const isPositiveNumber = (string) => Number(string) >= 0;
const squareNumber = partial(flip(Math.pow), [2]);
const remainderDivided = (divider, value) => value % divider;
const remainderDividedByThree = partial(remainderDivided, [3]);

const isStringValid = allPass([
  hasNumberValidCharacters,
  isLengthOfNumberLess10,
  isLengthOfNumberMore2,
  isPositiveNumber,
]);

const validationString = (value, handleError) => {
  if (!isStringValid(value)) {
    handleError(ValidationErrorMessage);
  }
};
//   rounding
const roundingNumber = compose(Math.round, Number);
//   convert number
const getResult = prop("result");
const numberBaseQueryUrl = "https://api.tech/numbers/base";
const numberBaseQueryParamsFrom10To2 = (number) => {
  return { from: 10, to: 2, number };
};
const convertNumberBaseApi = partial(getApi, [numberBaseQueryUrl]);
const convertNumberBaseApiFrom10To2 = compose(convertNumberBaseApi, numberBaseQueryParamsFrom10To2);
const asyncConvertNumberBaseApiFrom10To2 = composeAsync(getResult, convertNumberBaseApiFrom10To2);
//   get animal
const animalQueryUrl = "https://animals.tech/";
const animalQueryParamId = (value) => {
  return { id: value };
};
const getAnimalApi = partial(getApi, [animalQueryUrl]);
const getAnimalApiById = compose(getAnimalApi, animalQueryParamId);
const asyncGetAnimalApiById = composeAsync(getResult, getAnimalApiById);

const writeLogOfValue = (obj) => {
  getWriteLog(obj)(getValue(obj));
};
const validationValueProcess = (obj) => {
  validationString(getValue(obj), gethHandleError(obj));
};
const roundingValueProcess = (obj) => {
  return { ...obj, value: compose(roundingNumber, getValue)(obj) };
};
const convertValueToBinaryProcess = async (obj) => {
  return { ...obj, value: await asyncConvertNumberBaseApiFrom10To2(getValue(obj)) };
};
const getLengthByValueProcess = (obj) => {
  return { ...obj, value: length(getValue(obj)) };
};
const getSquareByValueProcess = (obj) => {
  return { ...obj, value: squareNumber(getValue(obj)) };
};
const getRemainderDividedByThreeByValueProcess = (obj) => {
  return { ...obj, value: remainderDividedByThree(getValue(obj)) };
};
const getAnimalByValueProcess = async (obj) => {
  return { ...obj, value: await asyncGetAnimalApiById(getValue(obj)) };
};
const handleSuccessOfValue = (obj) => {
  getHandleSuccess(obj)(getValue(obj));
};
const processSequence = composeAsync(
  tap(handleSuccessOfValue),
  getAnimalByValueProcess,
  tap(writeLogOfValue),
  getRemainderDividedByThreeByValueProcess,
  tap(writeLogOfValue),
  getSquareByValueProcess,
  tap(writeLogOfValue),
  getLengthByValueProcess,
  tap(writeLogOfValue),
  convertValueToBinaryProcess,
  tap(writeLogOfValue),
  roundingValueProcess,
  tap(validationValueProcess),
  tap(writeLogOfValue)
);

export default processSequence;
