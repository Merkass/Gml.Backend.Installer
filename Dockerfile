# Используем базовый образ с .NET
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 5000

# Установка дополнительных зависимостей
RUN apt-get update && \
    apt-get install -y \
    curl \
    wget \
    git \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Копируем установочные скрипты
COPY . /app/

# Делаем скрипты исполняемыми
RUN chmod +x /app/*.sh

# Создаем директорию для данных
RUN mkdir -p /app/data

# Настройка переменных окружения
ENV ASPNETCORE_URLS=http://+:5000
ENV GML_DATA_PATH=/app/data
ENV GML_CONFIG_PATH=/app/config

# Создаем пользователя для безопасности
RUN useradd -m -u 1001 gmluser && \
    chown -R gmluser:gmluser /app
USER gmluser

# Команда запуска
CMD ["./start-render.sh"]
