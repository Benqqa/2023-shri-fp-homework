/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import
  {
    all,
    allPass,
    and,
    any,
    anyPass,
    compose,
    count,
    equals,
    filter,
    flip,
    gt,
    keys,
    length,
    mapObjIndexed,
    not,
    partial,
    values,
  } from "ramda";

const isTrue = equals(true);
const isAllTrue = all(isTrue);
const isAnyTrue = any(isTrue);

const isWhite = equals("white");
const isRed = equals("red");
const isGreen = equals("green");
const isOrange = equals("orange");
const isBlue = equals("blue");

const isNotWhite = compose(not, isWhite);
const isNotGreen = compose(not, isGreen);
const isNotRed = compose(not, isRed);
const isNotOrange = compose(not, isOrange);

const isAnyColor = anyPass([isWhite, isRed, isGreen, isOrange, isBlue]);
const isAnyColorOfObject = compose(isAnyColor, values);
const isAllWhite = all(isWhite);
const isAllRed = all(isRed);
const isAllOrange = all(isOrange);
const isAllGreen = all(isGreen);
const isAllBlue = all(isBlue);

const isAllWhiteOfObject = compose(isAllWhite, values);
const isAllRedOfObject = compose(isAllRed, values);
const isAllOrangeOfObject = compose(isAllOrange, values);
const isAllGreenOfObject = compose(isAllGreen, values);
const isAllBlueOfObject = compose(isAllBlue, values);

const filteredByGreen = partial(filter, [isGreen]);
const filteredByRed = partial(filter, [isRed]);
const filteredByBlue = partial(filter, [isBlue]);
const filteredByOrange = partial(filter, [isOrange]);

const lengthOfFilteredByGreen = compose(length, keys, filteredByGreen);
const lengthOfFilteredByRed = compose(length, keys, filteredByRed);
const lengthOfFilteredByBlue = compose(length, keys, filteredByBlue);

const isOne = equals(1);
const isTwo = equals(2);
const isThree = equals(3);
const isFour = equals(4);

const isCountOfGreenTwo = compose(isTwo, lengthOfFilteredByGreen);
const isCountOfRedOne = compose(isOne, lengthOfFilteredByRed);
const isCountThreeAndMore = partial(flip(gt), [2]);

const objectOfNotWhiteAndThreeAndMoreEqualsValuesOfObject = mapObjIndexed((num, key, obj) => {
  const isNum = equals(num);
  const countOfEqualsValues = count(isNum);
  const countOfEqualsValuesOfObject = compose(countOfEqualsValues, values);
  const isCountThreeAndMoreCountOfEqualsValuesOfObject = compose(isCountThreeAndMore, countOfEqualsValuesOfObject);
  return and(isNotWhite(num), isCountThreeAndMoreCountOfEqualsValuesOfObject(obj));
});

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = ({ star, square, ...args }) =>
  isAllTrue([isRed(star), isGreen(square), isAllWhiteOfObject(args)]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = ({ ...args }) => gt(lengthOfFilteredByGreen(args), 1);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = ({ ...args }) => equals(lengthOfFilteredByRed(args), lengthOfFilteredByBlue(args));

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = ({ star, square, circle, triangle }) =>
  isAllTrue([isRed(star), isOrange(square), isBlue(circle), isAnyColor(triangle)]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = ({ ...args }) =>
  compose(isAnyTrue, values, objectOfNotWhiteAndThreeAndMoreEqualsValuesOfObject)(args);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = ({ ...args }) =>
  isAllTrue([isCountOfGreenTwo(args), isGreen(args.triangle), isCountOfRedOne(args)]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = ({ ...args }) => isAllOrangeOfObject(args);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = ({ star }) => allPass([isNotRed, isNotWhite])(star);

// 9. Все фигуры зеленые.
export const validateFieldN9 = ({ ...args }) => isAllGreenOfObject(args);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = ({ triangle, square, ...args }) =>
  isAllTrue([isNotWhite(triangle), isNotWhite(square), equals(triangle, square)]);
