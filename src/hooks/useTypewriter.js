import { useEffect, useRef, useState } from "react";

/*
  Печатающаяся и стирающаяся строка: набирает фразу по символу, держит её,
  стирает и переходит к следующей. Используется как живой плейсхолдер
  AI-поиска.

  paused — набор останавливается, когда пользователь начал печатать сам.
  При prefers-reduced-motion анимации нет: показывается первая фраза целиком,
  чтобы подсказка всё равно читалась.
*/
export function useTypewriter(phrases, paused = false, options = {}) {
  const { typeMs = 55, deleteMs = 26, holdMs = 1900, gapMs = 350 } = options;

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [erasing, setErasing] = useState(false);

  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (paused || reduced.current || phrases.length === 0) return undefined;

    const phrase = phrases[index % phrases.length];
    let delay;
    let step;

    if (!erasing) {
      if (text.length < phrase.length) {
        delay = typeMs;
        step = () => setText(phrase.slice(0, text.length + 1));
      } else {
        delay = holdMs;
        step = () => setErasing(true);
      }
    } else if (text.length > 0) {
      delay = deleteMs;
      step = () => setText(phrase.slice(0, text.length - 1));
    } else {
      delay = gapMs;
      step = () => {
        setErasing(false);
        setIndex((i) => (i + 1) % phrases.length);
      };
    }

    const timer = setTimeout(step, delay);
    return () => clearTimeout(timer);
  }, [text, erasing, index, paused, phrases, typeMs, deleteMs, holdMs, gapMs]);

  if (reduced.current) return phrases[0] || "";
  return text;
}
