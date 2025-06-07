import mysql.connector
from mysql.connector import Error


def connect_to_database():
    connection = None
    cursor = None
    try:
        # Устанавливаем соединение
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            port=3306
        )

        if connection.is_connected():
            print("Успешно подключено к MySQL")
            cursor = connection.cursor()

            # Выбираем базу данных
            cursor.execute("USE progame;")
            print("База данных 'progame' выбрана")

            # Создание таблицы Users
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS Users (
                    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    diamonds BIGINT DEFAULT 0,
                    stars BIGINT DEFAULT 0,
                    `rank` INT,
                    wallet_address VARCHAR(100),
                    telegram_id VARCHAR(50),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            print("Таблица Users создана или уже существует")

            # Создание таблицы Quests
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS Quests (
                    quest_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                    title VARCHAR(100) NOT NULL,
                    description TEXT,
                    reward_diamonds BIGINT,
                    reward_stars BIGINT,
                    is_active BOOLEAN DEFAULT TRUE
                );
            """)
            print("Таблица Quests создана или уже существует")

            # Создание таблицы Inventory
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS Inventory (
                    inventory_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                    user_id BIGINT NOT NULL,
                    item_id BIGINT NOT NULL,
                    quantity INT DEFAULT 1,
                    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES Users(user_id)
                );
            """)
            print("Таблица Inventory создана или уже существует")

            # Создание таблицы Leaderboard
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS Leaderboard (
                    leaderboard_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                    user_id BIGINT NOT NULL,
                    username VARCHAR(50),
                    diamonds BIGINT,
                    `rank` INT,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES Users(user_id)
                );
            """)
            print("Таблица Leaderboard создана или уже существует")

            # Создание таблицы Donations
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS Donations (
                    donation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
                    user_id BIGINT NOT NULL,
                    amount DECIMAL(10, 2),
                    currency VARCHAR(20) CHECK (currency IN ('TON', 'Stars', 'RUB')),
                    donated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed')),
                    FOREIGN KEY (user_id) REFERENCES Users(user_id)
                );
            """)
            print("Таблица Donations создана или уже существует")

            # Вставка данных в таблицу Users
            cursor.execute("""
                INSERT INTO Users (username, diamonds, stars, telegram_id) 
                VALUES ('Player1', 1000, 50, '123456789');
            """)
            print("Данные успешно вставлены в таблицу Users")

            # Фиксация изменений
            connection.commit()

    except Error as e:
        print(f"Произошла ошибка: {e}")
        if connection:
            connection.rollback()  # Откат изменений в случае ошибки

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
            print("Соединение с базой данных закрыто")


# Вызов функции
connect_to_database()