import { ErrorOptions } from '../types/custom-error';
import { FirewallOptions } from '../types/firewall';
import { Middleware } from '../types/middleware';

const validateFirewallOptions = (
  userConfig: FirewallOptions,
) : void => {
  if (userConfig.field === undefined
      || userConfig.operator === undefined
      || userConfig.value === undefined) {
    throw new Error('Invalid firewall configuration. Please check that you provided proper settings.');
  }
  const fields = new Set(['country', 'continent', 'asn', 'ip', 'hostname', 'user-agent']);
  const operators = new Set(['equal', 'not equal', 'greater', 'less', 'in', 'not in', 'contain', 'not contain', 'match']);
  if (fields.has(userConfig.field) === false) {
    throw new Error('Invalid firewall field configuration');
  }
  if (operators.has(userConfig.operator) === false) {
    throw new Error('Invalid firewall operator configuration');
  }
  if (Array.isArray(userConfig.value) === false) {
    if (typeof userConfig.value !== 'string'
          || typeof userConfig.value !== 'number') {
      throw new Error('Invalid firewall value configuration');
    }
  }
};

const validateErrorOptions = (
  userConfig : ErrorOptions,
) : void => {
  if (userConfig.errorCode === undefined || userConfig.responsePath === undefined) {
    throw new Error('Invalid customized error configuration.');
  }
};

export const useValidate: Middleware = (
  context,
  next,
) => {
  const { options } = context;
  const {
    upstream,
    firewall,
    error,
  } = options;

  if (upstream === undefined) {
    throw new Error("The required field 'upstream' in the configuration is missing.");
  }

  if (Array.isArray(upstream)) {
    upstream.forEach((upstreamOptions) => {
      if (upstreamOptions.domain === undefined) {
        throw new Error("The required field 'domain' in the configuration is missing.");
      }
    });
  } else if (upstream.domain === undefined) {
    throw new Error("The required field 'domain' in the configuration is missing.");
  }

  if (firewall !== undefined) {
    if (Array.isArray(firewall)) {
      firewall.forEach(validateFirewallOptions);
    } else {
      validateFirewallOptions(firewall);
    }
  }

  if (error !== undefined) {
    if (Array.isArray(error)) {
      error.forEach(validateErrorOptions);
    } else {
      validateErrorOptions(error);
    }
  }
  return next();
};
