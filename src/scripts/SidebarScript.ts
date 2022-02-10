import { ref } from "vue"

const isOpen = ref(false);
const toggleSidebar = (newValue : boolean) => { isOpen.value = newValue; }

export default { isOpen, toggleSidebar }
