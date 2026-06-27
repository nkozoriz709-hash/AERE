// ============================================
// JSONBin API Module - для сайта и админ-панели
// ============================================

const JSONBIN_API_KEY = '$2a$10$YXfbuwQuOthOnCbHadJ75OyTetnutOeB.VTMH2BYysqk9vaRa5f6S';
const JSONBIN_BIN_ID = '6a365392da38895dfee1fac8';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

class JSONBinAPI {
    static async getData() {
        try {
            const response = await fetch(JSONBIN_URL, {
                headers: {
                    'X-Master-Key': JSONBIN_API_KEY
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.record;
        } catch (error) {
            console.error('❌ Ошибка загрузки данных из JSONBin:', error);
            return null;
        }
    }

    static async updateData(data) {
        try {
            const response = await fetch(JSONBIN_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JSONBIN_API_KEY
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('❌ Ошибка обновления данных в JSONBin:', error);
            return null;
        }
    }

    // Синхронизация товаров
    static async syncProducts(products) {
        const data = await this.getData();
        if (!data) return false;
        data.products = products;
        await this.updateData(data);
        return true;
    }

    // Синхронизация пользователей
    static async syncUsers(users) {
        const data = await this.getData();
        if (!data) return false;
        data.users = users;
        await this.updateData(data);
        return true;
    }

    // Синхронизация заказов
    static async syncOrders(orders) {
        const data = await this.getData();
        if (!data) return false;
        data.orders = orders;
        await this.updateData(data);
        return true;
    }

    // Синхронизация уведомлений
    static async syncNotifications(notifications) {
        const data = await this.getData();
        if (!data) return false;
        data.notifications = notifications;
        await this.updateData(data);
        return true;
    }

    // Получение всех данных
    static async getAllData() {
        return await this.getData();
    }

    // Инициализация структуры данных
    static async initDatabase() {
        const initialData = {
            products: [],
            users: [],
            orders: [],
            notifications: [],
            statistics: {
                totalOrders: 0,
                totalRevenue: 0,
                lastUpdate: new Date().toISOString()
            }
        };
        return await this.updateData(initialData);
    }
}

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JSONBinAPI;
}