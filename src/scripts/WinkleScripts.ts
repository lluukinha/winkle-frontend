import { ref } from "vue"
import { IImportedPassword } from "../repositories/passwords/IImportedPassword";
import UserRepository from "../repositories/user/UserRepository";
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

const timeTo = (date: Date) : string => {
  var millisecondsPerDay = 24 * 60 * 60 * 1000;
  const days = (date.getTime() - new Date().getTime()) / millisecondsPerDay;
  return t('time-convert.days-to', { days: Math.round(days) });
};

const timeSince = (date: Date) : string => {
  const currentDateTime = (new Date()).getTime();
  const seconds = Math.floor((currentDateTime - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    const time = Math.floor(interval);
    return t('time-convert.years', { time });
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    const time = Math.floor(interval);
    return t('time-convert.months', { time });
  }

  interval = seconds / 86400;
  if (interval > 1) {
    const time = Math.floor(interval);
    return t('time-convert.days', { time });
  }

  interval = seconds / 3600;
  if (interval > 1) {
    const time = Math.floor(interval);
    return t('time-convert.hours', { time });
  }

  interval = seconds / 60;
  if (interval > 1) {
    const time = Math.floor(interval);
    return t('time-convert.minutes', { time });
  }

  return t('time-convert.seconds');
}


const csvToArray = (str: string, delimiter = ',') : IImportedPassword[] | undefined => {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  if (rows.length > 300) {
    showError(
      t('api-errors.password-import.too-many-rows'),
      t('api-errors.password-import.too-many-rows-description'),
      10000
    );
    return undefined;
  }

  if (
    !headers.includes('name') ||
    !headers.includes('url') ||
    !headers.includes('username') ||
    !headers.includes('password')
  ) {
    showError(
      t('api-errors.password-import.column-missing'),
      t('api-errors.password-import.column-missing-description')
    );
    return undefined;
  }

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  const arr = rows.map((row) => {
    const values = row.split(delimiter);
    const el = headers.reduce((object: any, header, index) => {
      object[header] = values[index];
      return object;
    }, {});
    el.isShowingPassword = false;
    return el;
  });

    // return the array
    return arr;
}

export default {
  isLoading,
  setLoading,
  copyText,
  urlTypes,
  deviceType,
  timeSince,
  timeTo,
  csvToArray
}
