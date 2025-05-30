import os
from dotenv import load_dotenv
from telegram import Update, Bot
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

# Загружаем переменные из .env
load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
if not BOT_TOKEN:
    raise ValueError("BOT_TOKEN не найден в переменных окружения")

# Создаем функцию для команды /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Привет! Я бот для отправки Telegram подарков 🎁")

# Функция отправки подарка
async def send_gift(user_id, gift_name):
    bot = Bot(token=BOT_TOKEN)
    message = f"🎁 Вам выпал подарок: {gift_name}"
    await bot.send_message(chat_id=user_id, text=message)

# Запускаем бота
if __name__ == "__main__":
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    # Добавляем обработчик команды /start
    app.add_handler(CommandHandler("start", start))

    print("Бот запущен...")
    app.run_polling()



import asyncio
from tonpy import TonWallet

async def send_nft_gift(sender_seed_phrase, recipient_address, nft_address):
    # Инициализация кошелька отправителя
    sender_wallet = TonWallet(seed_phrase=sender_seed_phrase)
    await sender_wallet.connect()

    # Отправка NFT
    await sender_wallet.transfer_nft(
        nft_address=nft_address,
        recipient_address=recipient_address
    )

    print(f"NFT-подарок {nft_address} отправлен на адрес {recipient_address}")

# Пример использования
sender_seed = "ваша seed-фраза отправителя"
recipient = "TON-адрес получателя"
nft = "адрес NFT-подарка"

asyncio.run(send_nft_gift(sender_seed, recipient, nft))
