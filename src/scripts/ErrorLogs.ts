import { AxiosError } from "axios";
import i18n from "./internacionalization/i18n";
import { showError } from "./NotificationScript";

const { t } = i18n.element.global;

interface ErrorSource {
  parameter: string;
}

interface ApiError {
  detail: string;
  meta: Object;
  source: ErrorSource;
  status: string;
  title: string;
};

const showErrorMessage = (e: AxiosError) => {
  const errors : ApiError[] = e.response?.data.errors;
  if (!errors) {
    showError(t('api-errors.title'), e.response?.statusText || '');
    return;
  }

  errors.forEach((error: ApiError) => {
    const param = t(`api-errors.params.${error.source.parameter}`);
    const translation = t(`api-errors.${error.title}`, { param });
    showError(t('api-errors.title'), translation);
  });
};

export default showErrorMessage;