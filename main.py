import os
import sqlite3
import asyncio
from dotenv import load_dotenv
from telegram import Update, Bot
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes, PreCheckoutQueryHandler, MessageHandler, filters
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Загружаем переменные из .env
load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
if not BOT_TOKEN:
    raise ValueError("BOT_TOKEN не найден в переменных окружения")

# Инициализируем FastAPI
app = FastAPI()

# Настраиваем CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://max27347.github.io"],  # Разрешаем запросы с вашего GitHub Pages
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # Разрешаем нужные методы
    allow_headers=["Content-Type", "Authorization"],
)

# Инициализируем SQLite базу данных
def init_db():
    conn = sqlite3.connect("payments.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS payments
                 (chat_id TEXT, payment_id TEXT, TEXT PRIMARY KEY, amount INTEGER, payload TEXT, timestamp TEXT)''')
    conn.commit()
    conn.close()

init_db()

# Функция для команды /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Привет! Я бот для донатов через Telegram Stars 🎁")

# Функция для создания счёта
@app.post("/create-invoice")
async def create_invoice(data: dict):
    try:
        product = data.get("product", "100 Diamonds")
        amount = data.get("amount", 100)
        chat_id = data.get("chat_id", "")

        bot = await Bot.create(token=BOT_TOKEN)
        invoice = await bot.create_invoice_link(
            title=product,
            description=f"Donate {amount} Diamonds to support World of Consoles",
            payload=json.dumps({"product": product, "amount": amount, "chat_id": chat_id}),
            currency="XTR",
            prices=[{"label": product, "amount": amount * 100}]
        )
        return {"invoiceLink": invoice}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Обработка предпроверки платежа
async def pre_checkout_query(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.pre_checkout_query.answer(ok=True)

# Обработка успешного платежа
async def successful_payment(update: Update, context: ContextTypes.DEFAULT_TYPE):
    payment = update.message.successful_payment
    chat_id = update.message.chat_id
    payment_id = payment.telegram_payment_charge_id
    amount = payment.total_amount // 100
    payload = payment.invoice_payload

    # Сохраняем платеж в базу данных
    conn = sqlite3.connect("payments.db")
    c = conn.cursor()
    c.execute("INSERT INTO payments (chat_id, payment_id, amount, payload, timestamp) VALUES (?, ?, ?, ?, datetime('now'))",
              (str(chat_id), payment_id, amount, payload))
    conn.commit()
    conn.close()

    await update.message.reply_text(f"Спасибо за донат! Вы получили {amount} алмазов!")

# Асинхронная функция для запуска бота
async def run_bot():
    bot_app = await ApplicationBuilder().token(BOT_TOKEN).build()
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