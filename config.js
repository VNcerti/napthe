// =================== CẤU HÌNH TELEGRAM BOT ===================
// Thay đổi thông tin Telegram Bot của bạn tại đây
const TELEGRAM_CONFIG = {
    BOT_TOKEN: "8500770716:AAEjU7-NvX7OucCa_7QarvggUlUFLdW_qT4", // Thay bằng Bot Token của bạn
    CHAT_ID: "-1003057128724" // Thay bằng Chat ID của bạn
};

// =================== CẤU HÌNH CHIẾT KHẤU ===================
// Thay đổi tỷ lệ chiết khấu tại đây (tính theo %)
const DISCOUNT_CONFIG = {
    VIETTEL: 15.5,   // Chiết khấu Viettel (%)
    VINAPHONE: 14,   // Chiết khấu Vinaphone (%)
    MOBIFONE: 15     // Chiết khấu Mobifone (%)
};

// =================== CẤU HÌNH KHÁC ===================
const SYSTEM_CONFIG = {
    SITE_NAME: "GẠCH THẺ CÀO",
    SUPPORT_TELEGRAM: "@TalmV",
    SUPPORT_EMAIL: "support@gachthecao.com",
    PROCESSING_TIME: "3-5 phút",
    AUTO_REFRESH_RATES: true // Tự động làm mới tỷ lệ khi thay đổi
};

// Không chỉnh sửa phần dưới đây
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TELEGRAM_CONFIG, DISCOUNT_CONFIG, SYSTEM_CONFIG };
}