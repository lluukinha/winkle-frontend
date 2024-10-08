import { notify } from "@kyvg/vue3-notification";

type NotificationType = "warn" | "error" | "success";

const showNotification = (title: string, text: string, type: NotificationType, duration:number = 1000) => {
  notify({ title, text, type, duration });
};

const showSuccess = (title: string, text: string, timeout: number = 1000) => {
  showNotification(title, text, 'success', timeout);
};

const showWarning = (title: string, text: string, timeout: number = 1000) => {
  showNotification( title, text, 'warn', timeout);
};

const showError = (title: string, text: string, timeout: number = 3000) => {
  showNotification(title, text, 'error', timeout);
};

export {
  showNotification,
  showSuccess,
  showWarning,
  showError,
  NotificationType
};
