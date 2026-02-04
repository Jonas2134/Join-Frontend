export type ToastType = "success" | "error";

export interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number;
}
