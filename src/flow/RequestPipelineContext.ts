import type { Request, Response } from 'express';
import type { RequestLocals } from './RequestLocals';

export type ExternalResponse = {
  description: string;
  externalUrl: string;
  raw: Response;
  decodedChunks?: string;
  parsed?: Record<string, any>;
  error?: Error;
};

export type RequestPipelineContext<T> = {
  data: T;
  defaults?: {
    pipelineName?: string;
    responseStatus?: number;
  };
  errors?: any[];
  pipeline: {
    starting?: string;
    finished?: string;
  };
  req: Request & {
    locals: RequestLocals;
    files?: any[];
    status: number;
  };
  res: Response & { flush: () => void };
  response: {
    isUpstreamError?: boolean;
    json?: Record<string, any>;
    status?: number;
    upstreamResponse?: {
      raw: Response;
      json: Record<string, any>;
      text: string;
    };
  };
  stopProcessing: boolean;
  isFinalized?: boolean;
};
