import os
from dotenv import load_dotenv
from telegram import Bot

# Загружаем переменные из .env
load_dotenv()

# Получаем токен из окружения
BOT_TOKEN = os.getenv("BOT_TOKEN")

if not BOT_TOKEN:
    raise ValueError("BOT_TOKEN не найден в переменных окружения")

# Создаем экземпляр бота
bot = Bot(token=BOT_TOKEN)

# Пример: отправка сообщения
def send_gift(user_id, gift_name):
    message = f"🎁 Вам выпал подарок: {gift_name}"
    bot.send_message(chat_id=user_id, text=message)

# Пример вызова
# send_gift(123456789, "Домашний торт")
