import { ref } from 'vue';

const title = ref('');
const description = ref('');
const isShowing = ref(false);

const showWarning = (newTitle: string, newDescription: string, timeout: number = 3000) => {
  title.value = newTitle;
  description.value = newDescription;
  isShowing.value = true;
  setTimeout(() => { isShowing.value = false }, timeout);
};

export default { title, description, isShowing, showWarning }
