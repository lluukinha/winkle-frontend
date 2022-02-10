import { ref } from "vue"
import i18n from "./internacionalization/i18n";
import { showError, showSuccess } from "./NotificationScript";
const { t } = i18n.element.global;

const isLoading = ref(false);
const setLoading = (newValue : boolean) => { isLoading.value = newValue; }
const copyText = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    showSuccess(t('text-copied'), t('text-copied-description'));
  } catch (err) {
    showError(t('text-copy-error'), t('text-copy-error-description'));
  }
};

export default { isLoading, setLoading, copyText }
