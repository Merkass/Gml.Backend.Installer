const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

// HTML контент для главной страницы
const indexHTML = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GML Launcher - Render</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .status {
            color: #28a745;
            font-weight: bold;
        }
        .info {
            background: #e9ecef;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .btn {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎮 GML Launcher</h1>
        <p class="status">✅ Сервер запущен и работает</p>
        
        <div class="info">
            <h3>Информация о сервере:</h3>
            <p><strong>Порт:</strong> ${PORT}</p>
            <p><strong>Время запуска:</strong> ${new Date().toLocaleString('ru-RU')}</p>
            <p><strong>Платформа:</strong> Render.com</p>
            <p><strong>Статус:</strong> Готов к работе</p>
        </div>
        
        <h3>Доступные эндпоинты:</h3>
        <ul>
            <li><a href="/health" class="btn">Health Check</a></li>
            <li><a href="/api/status" class="btn">API Status</a></li>
            <li><a href="/admin" class="btn">Панель администратора</a></li>
        </ul>
        
        <div class="info">
            <h3>Следующие шаги:</h3>
            <p>1. Интегрируйте реальный GML Backend</p>
            <p>2. Настройте базу данных</p>
            <p>3. Добавьте аутентификацию</p>
            <p>4. Настройте файловое хранилище</p>
        </div>
    </div>
</body>
</html>
`;

// Обработчик запросов
const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    
    console.log(`${method} ${url} - ${new Date().toISOString()}`);
    
    // Установка CORS заголовков
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Обработка OPTIONS запросов
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Роутинг
    switch (url) {
        case '/':
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(indexHTML);
            break;
            
        case '/health':
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                status: 'healthy', 
                timestamp: new Date().toISOString(),
                port: PORT,
                uptime: process.uptime()
            }));
            break;
            
        case '/api/status':
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                service: 'GML Launcher',
                version: '1.0.0',
                status: 'running',
                platform: 'Render.com',
                node_version: process.version,
                memory_usage: process.memoryUsage(),
                uptime: process.uptime()
            }));
            break;
            
        case '/admin':
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>GML Admin</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; }
                        .admin-panel { background: #f8f9fa; padding: 20px; border-radius: 8px; }
                    </style>
                </head>
                <body>
                    <div class="admin-panel">
                        <h2>🔧 GML Launcher - Панель администратора</h2>
                        <p>Здесь будет панель управления GML Launcher</p>
                        <p><strong>Статус:</strong> В разработке</p>
                        <a href="/">← Назад на главную</a>
                    </div>
                </body>
                </html>
            `);
            break;
            
        default:
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <html>
                <body>
                    <h1>404 - Страница не найдена</h1>
                    <p>Запрашиваемая страница ${url} не существует</p>
                    <a href="/">← Вернуться на главную</a>
                </body>
                </html>
            `);
    }
});

// Запуск сервера
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 GML Launcher сервер запущен на порту ${PORT}`);
    console.log(`📡 Доступен по адресу: http://0.0.0.0:${PORT}`);
    console.log(`⏰ Время запуска: ${new Date().toLocaleString('ru-RU')}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Получен сигнал SIGTERM, завершаем работу...');
    server.close(() => {
        console.log('✅ Сервер успешно остановлен');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 Получен сигнал SIGINT, завершаем работу...');
    server.close(() => {
        console.log('✅ Сервер успешно остановлен');
        process.exit(0);
    });
});
