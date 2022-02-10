import { notify } from "@kyvg/vue3-notification";

type NotificationType = "warn" | "error" | "success";

const showNotification = (title: string, text: string, type: NotificationType, duration:number = 1000) => {
  notify({ title, text, type, duration });
};

const showSuccess = (title: string, text: string) => {
  showNotification(title, text, 'success');
};

const showWarning = (title: string, text: string) => {
  showNotification( title, text, 'warn');
};

const showError = (title: string, text: string) => {
  showNotification(title, text, 'error', 3000);
};

export {
  showNotification,
  showSuccess,
  showWarning,
  showError,
  NotificationType
};
