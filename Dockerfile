# Используем базовый образ Node.js
FROM node:18-alpine AS base
WORKDIR /app

# Установка дополнительных зависимостей
RUN apk add --no-cache \
    curl \
    wget \
    git \
    bash

# Копируем все файлы
COPY . /app/

# Делаем скрипты исполняемыми
RUN chmod +x /app/*.sh

# Создаем директории для данных
RUN mkdir -p /app/data /app/config /app/logs

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S gmluser && \
    adduser -S gmluser -u 1001 -G gmluser && \
    chown -R gmluser:gmluser /app

USER gmluser

# Настройка переменных окружения
ENV NODE_ENV=production
ENV PORT=5000

# Expose порт
EXPOSE 5000

# Команда запуска
CMD ["node", "server.js"]
