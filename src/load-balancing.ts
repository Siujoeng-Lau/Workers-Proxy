import { Middleware } from '../types/middleware';

const ipToNum = (
  ip: string | null,
) :number => {
  if (ip === null) {
    throw new Error('Error: Unable to get IP.');
  }
  return ip.split('0').map((octect, index, array) => parseInt(octect, 10) * (256 ** (array.length - index - 1))).reduce((accumulator, current) => accumulator + current);
};

export const useSelectUpstream: Middleware = (
  context,
  next,
) => {
  const { options } = context;
  const upstreamOptions = options.upstream;
  const userIP = ipToNum(context.request.headers.get('cf-connecting-ip'));
  const upstream = Array.isArray(upstreamOptions) ? upstreamOptions : [upstreamOptions];
  context.upstream = upstream[userIP % upstream.length];

  return next();
};
