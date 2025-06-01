import os
import sqlite3
import asyncio
from dotenv import load_dotenv
from telegram import Update, Bot
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes, PreCheckoutQueryHandler, MessageHandler, filters
from fastapi import FastAPI, HTTPException
import uvicorn

# Загружаем переменные из .env
load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
if not BOT_TOKEN:
    raise ValueError("BOT_TOKEN не найден в переменных окружения")

# Инициализируем FastAPI для HTTP-запросов
app = FastAPI()

# Инициализируем SQLite базу данных
def init_db():
    conn = sqlite3.connect("payments.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS payments
                 (chat_id TEXT, payment_id TEXT, amount INTEGER, payload TEXT, timestamp TEXT)''')
    conn.commit()
    conn.close()

init_db()

# Создаем функцию для команды /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Привет! Я бот для донатов через Telegram Stars 🎁")

# Функция для создания счёта
@app.post("/create-invoice")
async def create_invoice(data: dict):
    try:
        product = data.get("product", "100 Diamonds")
        amount = data.get("amount", 100)  # Цена в Telegram Stars
        chat_id = data.get("chat_id", 0)

        bot = Bot(token=BOT_TOKEN)
        invoice = await bot.create_invoice_link(
            title=product,
            description=f"Donate {amount} Diamonds to support World of Consoles",
            payload=f"diamonds_{amount}_{chat_id}",
            currency="XTR",  # Telegram Stars
            prices=[{"label": product, "amount": amount * 100}]  # Цена в минимальных единицах
        )
        return {"invoiceLink": invoice}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Обработка предпроверки платежа
async def pre_checkout_query(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.pre_checkout_query.answer(ok=True)  # Подтверждаем платеж

# Обработка успешного платежа
async def successful_payment(update: Update, context: ContextTypes.DEFAULT_TYPE):
    payment = update.message.successful_payment
    chat_id = update.message.chat_id
    payment_id = payment.telegram_payment_charge_id
    amount = payment.total_amount // 100  # Конвертируем из минимальных единиц в Stars
    payload = payment.invoice_payload

    # Сохраняем платеж в базу данных
    conn = sqlite3.connect("payments.db")
    c = conn.cursor()
    c.execute("INSERT INTO payments (chat_id, payment_id, amount, payload, timestamp) VALUES (?, ?, ?, ?, datetime('now'))",
              (str(chat_id), payment_id, amount, payload))
    conn.commit()
    conn.close()

    # Отправляем подтверждение пользователю
    await update.message.reply_text(f"Спасибо за донат! Вы получили {amount} алмазов!")

# Асинхронная функция для запуска бота
async def run_bot():
    bot_app = ApplicationBuilder().token(BOT_TOKEN).build()
    bot_app.add_handler(CommandHandler("start", start))
    bot_app.add_handler(PreCheckoutQueryHandler(pre_checkout_query))
    bot_app.add_handler(MessageHandler(filters.SuccessfulPayment, successful_payment))
    await bot_app.initialize()
    await bot_app.start()
    await bot_app.updater.start_polling()
    print("Бот запущен в режиме polling...")

# Асинхронная функция для запуска FastAPI
async def run_server():
    config = uvicorn.Config(app, host="0.0.0.0", port=8000)
    server = uvicorn.Server(config)
    await server.serve()
    print("FastAPI сервер запущен...")

# Главная функция для запуска обоих
async def main():
    print("Запускаем сервер и бота...")
    await asyncio.gather(run_bot(), run_server())

if __name__ == "__main__":
    asyncio.run(main())