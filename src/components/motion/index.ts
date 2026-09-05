// Simple motion constants/helpers for transition classes and animations
export const FADE_IN = "animate-[fadeIn_0.3s_ease_both]";

export const getDelayStyle = (index: number) => {
  return {
    animationDelay: `${Math.min(index, 20) * 15}ms`,
  };
};
