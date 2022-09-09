export const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: 2,
      ease: "easeInOut",
      when: "beforeChildren",
    },
  },
};
