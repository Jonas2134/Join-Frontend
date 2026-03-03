export type ToastType = "success" | "error" | "info";

export interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number;
}
