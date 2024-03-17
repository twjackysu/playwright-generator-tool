export { type Page } from "playwright";

export type StepOptions = {
  debug?: boolean;
  model?: string;
  openaiApiKey?: string;
};

export type TaskMessage = {
  task: string;
  snapshot: {
    dom: string;
  };
  options?: StepOptions;
};

export type TaskResult = {
  assertion?: boolean;
  query?: string;
  errorMessage?: string;
};
