export const useTelegram = () => {
  const tg = window.Telegram.WebApp;
  const user = tg.initDataUnsafe?.user;

  return {
    tg,
    user,
    close: tg.close,
    expand: tg.expand,
  };
};
