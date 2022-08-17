import { ref, Ref } from "vue";
import { INote } from "../../repositories/notes/INote";
import NoteRepository from "../../repositories/notes/NoteRepository";
import WinkleScripts from "../../scripts/WinkleScripts";

const emptyNote = { id: '', note: '' };
const notes : Ref<INote[]> = ref([]);
const listIsLoaded = ref<boolean>(false);

const loadNotes = async () => {
  WinkleScripts.setLoading(true);
  const result = await NoteRepository.list();
  notes.value = result;
  WinkleScripts.setLoading(false);
  return result;
};

const createNote = async (note: INote) => {
  WinkleScripts.setLoading(true);
  const result = await NoteRepository.create(note.note);
  notes.value.push(result);
  WinkleScripts.setLoading(false);
  return result;
};

const updateNote = async (note: INote) => {
  WinkleScripts.setLoading(true);
  const result = await NoteRepository.update(note);
  const index = notes.value.findIndex(n => n.id === result.id);
  notes.value[index] = result;
  WinkleScripts.setLoading(false);
  return result;
}

const removeNote = async (noteId: string) => {
  if (noteId === '') return emptyNote;

  WinkleScripts.setLoading(true);
  const result = await NoteRepository.remove(noteId);
  const index = notes.value.findIndex(n => n.id === noteId);
  notes.value.splice(index, 1);
  WinkleScripts.setLoading(false);
  if (!result) return emptyNote;

  const currentIndex = notes.value.findIndex(n => n.id === noteId);
  notes.value.splice(currentIndex, 1);
  const newSelectedNote = currentIndex > 0 ? notes.value[currentIndex - 1] : emptyNote;
  return newSelectedNote;
};

export default {
  notes,
  listIsLoaded,
  loadNotes,
  createNote,
  updateNote,
  removeNote,
  emptyNote
}
