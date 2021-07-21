import { Middleware } from '../types/middleware';

const ipToNum = (
  ip: string | null,
) :number => {
  if (ip === null) {
    return -1;
  }
  return ip.split('.').map((octect, index, array) => parseInt(octect, 10) * (256 ** (array.length - index - 1))).reduce((accumulator, current) => accumulator + current);
};

export const useSelectUpstream: Middleware = (
  context,
  next,
) => {
  const { options } = context;
  const upstreamOptions = options.upstream;
  const userIP = ipToNum(context.request.headers.get('cf-connecting-ip'));
  const upstream = Array.isArray(upstreamOptions) ? upstreamOptions : [upstreamOptions];
  context.upstream = userIP === -1
    ? upstream[Math.floor(Math.random() * upstream.length)]
    : upstream[userIP % upstream.length];

  return next();
};
