
export enum Mood {
  HAPPY = '开心',
  CALM = '平静',
  SHY = '害羞',
  SLEEPY = '困倦',
  TEASING = '戏谑',
  FOCUS = '专注'
}

export interface Dialogue {
  text: string;
  mood: Mood;
}

export interface GameState {
  affection: number;
  mood: Mood;
  currentMessage: string;
  isAudioPlaying: boolean;
  interactionCount: number;
  unlockedEvents: string[];
  isFocusMode: boolean;
  focusTimeLeft: number; // 秒
}
