import { notify } from "@kyvg/vue3-notification";

type NotificationType = "warn" | "error" | "success";

const showNotification = (title: string, text: string, type: NotificationType) => {
  notify({ title, text, type });
};

export { showNotification, NotificationType };
