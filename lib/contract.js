/**
  Design by Contract module (c) OptimalBits 2011.

  Roadmap:
    - Optional parameters. ['(string)', 'array']
    - Variable number of parameters.['number','...']

  api?:

  contract(arguments)
    .params('string', 'array', '...')
    .params('number')
    .end()

*/

const noop = {};
const _ = require('lodash');

noop.params = function () {
  return this;
};
noop.end = function () {};

const contract = function (args) {
  if (contract.debug === true) {
    contract.fulfilled = false;
    contract.args = _.toArray(args);
    contract.checkedParams = [];
    return contract;
  }
  return noop;
};

contract.params = function () {
  let i,
    len;
  this.fulfilled |= checkParams(this.args, _.toArray(arguments));
  if (this.fulfilled) {
    return noop;
  }
  this.checkedParams.push(arguments);
  return this;
};
contract.end = function () {
  if (!this.fulfilled) {
    printParamsError(this.args, this.checkedParams);
    throw new Error('Broke parameter contract');
  }
};

const typeOf = function (obj) {
  return Array.isArray(obj) ? 'array' : typeof obj;
};

const checkParams = function (args, contract) {
  let fulfilled,
    types,
    type,
    i,
    j;

  if (args.length !== contract.length) {
    return false;
  }
  for (i = 0; i < args.length; i += 1) {
    try {
      types = contract[i].split('|');
    } catch (e) {
      console.log(e, args);
    }
    if (args[i]) {
      type = typeOf(args[i]);
      fulfilled = false;
      for (j = 0; j < types.length; j += 1) {
        if (type === types[j]) {
          fulfilled = true;
          break;
        }
      }
    }
    if (fulfilled === false) {
      return false;
    }
  }
  return true;
};

const printParamsError = function (args, checkedParams) {
  let msg = 'Parameter mismatch.\nInput:\n( ',
    type,
    input,
    i;
  _.each(args, (input, key) => {
    type = typeOf(input);
    if (key !== 0) {
      msg += ', ';
    }
    msg += `${input}: ${type}`;
  });

  msg += ')\nAccepted:\n';

  for (i = 0; i < checkedParams.length; i += 1) {
    msg += `(${argsToString(checkedParams[i])})\n`;
  }

  console.log(msg);
};

const argsToString = function (args) {
  let res = '';
  _.each(args, (arg, key) => {
    if (key !== 0) {
      res += ', ';
    }
    res += arg;
  });
  return res;
};

exports = module.exports = contract;
