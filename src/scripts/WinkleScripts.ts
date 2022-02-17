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

const deviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
  }
  else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return "mobile";
  }
  return "desktop";
};

interface UrlType {
  name: string;
  url: string;
};

const urlTypes : UrlType[] = [
  { name: 'Anchor', url: 'https://anchor.fm/' },
  { name: 'Amazon', url: 'https://www.amazon.com.br/' },
  { name: 'Disney+', url: 'https://www.disneyplus.com/pt-br' },
  { name: 'Facebook', url: 'https://www.facebook.com.br' },
  { name: 'HBO Max', url: 'https://www.hbomax.com/br/pt' },
  { name: 'Hotmart', url: 'https://www.hotmart.com/pt-BR' },
  { name: 'Instagram', url: 'https://www.instagram.com/' },
  { name: 'ICloud', url: 'https://www.icloud.com/' },
  { name: 'Mercado Livre', url: 'https://www.mercadolivre.com.br/' },
  { name: 'Netflix', url: 'https://www.netflix.com/' },
  { name: 'Spotify', url: 'https://www.spotify.com/' },
  { name: 'Star Plus', url: 'https://www.starplus.com/' },
  { name: 'Twitter', url: 'https://twitter.com/' },
  { name: 'Youtube', url: 'https://www.youtube.com/' }
];

export default { isLoading, setLoading, copyText, urlTypes, deviceType }
