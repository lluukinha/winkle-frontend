// src/types/custom.d.ts

interface ToggleEvent extends Event {
  readonly newState: string;
  readonly oldState: string;
}
