export function usePegboardSounds() {
  const playPick = () => {
    const audio = new Audio('/sounds/pick.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  const playPlace = () => {
    const audio = new Audio('/sounds/place.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  return { playPick, playPlace };
}
