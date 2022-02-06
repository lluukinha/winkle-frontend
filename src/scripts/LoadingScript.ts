import { ref } from "vue"

const isLoading = ref(false);
const setLoading = (newValue : boolean) => { isLoading.value = newValue; }

export default { isLoading, setLoading }
