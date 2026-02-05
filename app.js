// =================== KHỞI TẠO BIẾN ===================
let discountRates = { ...DISCOUNT_CONFIG };

// =================== DOM ELEMENTS ===================
const elements = {
    email: document.getElementById('email'),
    cardType: document.getElementById('cardType'),
    denomination: document.getElementById('denomination'),
    serial: document.getElementById('serial'),
    pin: document.getElementById('pin'),
    estimatedValue: document.getElementById('estimatedValue'),
    discountRateEl: document.getElementById('discountRate'),
    submitBtn: document.getElementById('submitBtn'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    menuToggle: document.getElementById('menuToggle'),
    mainNav: document.getElementById('mainNav')
};

// =================== KHỞI TẠO ỨNG DỤNG ===================
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // Mobile menu toggle
    if (elements.menuToggle) {
        elements.menuToggle.addEventListener('click', function() {
            elements.mainNav.classList.toggle('mobile-open');
        });
    }

    // Gắn sự kiện
    bindEvents();
    
    // Cập nhật giá trị ước tính ban đầu
    updateEstimatedValue();
    
    // Tải cấu hình chiết khấu từ localStorage nếu có
    loadDiscountSettings();
}

// =================== GẮN SỰ KIỆN ===================
function bindEvents() {
    if (!elements.cardType) return;
    
    // Validation real-time
    elements.email.addEventListener('input', () => validateEmail());
    elements.cardType.addEventListener('change', () => {
        validateCardType();
        updateEstimatedValue();
    });
    elements.denomination.addEventListener('change', () => {
        validateDenomination();
        updateEstimatedValue();
    });
    elements.serial.addEventListener('input', () => validateSerial());
    elements.pin.addEventListener('input', () => validatePin());
    
    // Cập nhật tính toán real-time
    elements.cardType.addEventListener('change', updateEstimatedValue);
    elements.denomination.addEventListener('change', updateEstimatedValue);

    // Nút gửi
    elements.submitBtn.addEventListener('click', submitCard);
}

// =================== VALIDATION FUNCTIONS ===================
function validateEmail() {
    const email = elements.email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showError('email', 'Vui lòng nhập email đăng ký tại hệ thống');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showError('email', 'Email không hợp lệ');
        return false;
    }
    
    clearError('email');
    return true;
}

function validateCardType() {
    const cardType = elements.cardType.value;
    
    if (!cardType) {
        showError('cardType', 'Vui lòng chọn loại thẻ');
        return false;
    }
    
    clearError('cardType');
    return true;
}

function validateDenomination() {
    const denomination = elements.denomination.value;
    
    if (!denomination) {
        showError('denomination', 'Vui lòng chọn mệnh giá');
        return false;
    }
    
    clearError('denomination');
    return true;
}

function validateSerial() {
    const serial = elements.serial.value.trim();
    
    if (!serial) {
        showError('serial', 'Vui lòng nhập số serial');
        return false;
    }
    
    if (serial.length < 10) {
        showError('serial', 'Số serial phải có ít nhất 10 ký tự');
        return false;
    }
    
    clearError('serial');
    return true;
}

function validatePin() {
    const pin = elements.pin.value.trim();
    
    if (!pin) {
        showError('pin', 'Vui lòng nhập mã thẻ');
        return false;
    }
    
    if (pin.length < 10) {
        showError('pin', 'Mã thẻ phải có ít nhất 10 ký tự');
        return false;
    }
    
    clearError('pin');
    return true;
}

function validateForm() {
    const validations = [
        validateEmail(),
        validateCardType(),
        validateDenomination(),
        validateSerial(),
        validatePin()
    ];
    
    return validations.every(v => v === true);
}

// =================== CALCULATION FUNCTIONS ===================
function getCurrentDiscountRate() {
    const cardType = elements.cardType.value;
    return discountRates[cardType] || 0;
}

function updateEstimatedValue() {
    const denomination = elements.denomination.value;
    const cardType = elements.cardType.value;
    
    if (!denomination || !cardType) {
        elements.estimatedValue.textContent = '0 VNĐ';
        elements.discountRateEl.textContent = '0%';
        return;
    }
    
    const amount = parseInt(denomination);
    const discountRate = getCurrentDiscountRate();
    const discountedAmount = amount * (1 - discountRate / 100);
    
    elements.estimatedValue.textContent = formatCurrency(Math.round(discountedAmount));
    elements.discountRateEl.textContent = discountRate.toFixed(1) + '%';
}

// =================== LOAD/SAVE SETTINGS ===================
function loadDiscountSettings() {
    try {
        const savedRates = localStorage.getItem('discountRates');
        if (savedRates) {
            const parsedRates = JSON.parse(savedRates);
            // Chỉ cập nhật nếu có đầy đủ các loại thẻ
            if (parsedRates.VIETTEL && parsedRates.VINAPHONE && parsedRates.MOBIFONE) {
                discountRates = parsedRates;
                console.log('Đã tải cấu hình chiết khấu từ localStorage');
            }
        }
    } catch (error) {
        console.error('Lỗi khi tải cấu hình chiết khấu:', error);
    }
}

function saveDiscountSettings() {
    try {
        localStorage.setItem('discountRates', JSON.stringify(discountRates));
        console.log('Đã lưu cấu hình chiết khấu vào localStorage');
    } catch (error) {
        console.error('Lỗi khi lưu cấu hình chiết khấu:', error);
    }
}

// =================== ADMIN FUNCTIONS ===================
// Hàm này để quản lý cấp nhật chiết khấu từ bên ngoài
window.updateDiscountRates = function(newRates) {
    if (!newRates || typeof newRates !== 'object') {
        console.error('Dữ liệu chiết khấu không hợp lệ');
        return false;
    }
    
    // Kiểm tra các giá trị hợp lệ
    if (newRates.VIETTEL && newRates.VIETTEL >= 1 && newRates.VIETTEL <= 50) {
        discountRates.VIETTEL = newRates.VIETTEL;
    }
    
    if (newRates.VINAPHONE && newRates.VINAPHONE >= 1 && newRates.VINAPHONE <= 50) {
        discountRates.VINAPHONE = newRates.VINAPHONE;
    }
    
    if (newRates.MOBIFONE && newRates.MOBIFONE >= 1 && newRates.MOBIFONE <= 50) {
        discountRates.MOBIFONE = newRates.MOBIFONE;
    }
    
    // Lưu vào localStorage
    saveDiscountSettings();
    
    // Cập nhật giao diện
    updateEstimatedValue();
    
    // Hiển thị thông báo
    showNotification('Đã cập nhật chiết khấu thành công!', 'success');
    
    return true;
};

// Hàm để lấy tỷ lệ chiết khấu hiện tại
window.getCurrentDiscountRates = function() {
    return { ...discountRates };
};

// =================== SUBMISSION FUNCTION ===================
async function submitCard() {
    if (!validateForm()) {
        showNotification('Vui lòng kiểm tra lại thông tin trước khi gửi!', 'warning');
        return;
    }

    const cardData = {
        email: elements.email.value.trim(),
        cardType: elements.cardType.value,
        cardTypeName: elements.cardType.options[elements.cardType.selectedIndex].text,
        denomination: parseInt(elements.denomination.value),
        denominationText: formatCurrency(parseInt(elements.denomination.value)) + ' VNĐ',
        serial: elements.serial.value.trim(),
        pin: elements.pin.value.trim(),
        estimatedValue: Math.round(parseInt(elements.denomination.value) * (1 - getCurrentDiscountRate() / 100)),
        timestamp: new Date().toLocaleString('vi-VN'),
        discountRate: getCurrentDiscountRate(),
        siteName: SYSTEM_CONFIG.SITE_NAME
    };

    showLoading(true);

    try {
        await sendToTelegram(cardData);
        showNotification('Thẻ đã được gửi thành công cho admin. Vui lòng đợi trong giây lát. Nếu có vấn đề cần hỗ trợ, hãy liên hệ cho admin ngay.', 'success');
        resetForm();
    } catch (error) {
        console.error('Error:', error);
        showNotification('Có lỗi xảy ra. Vui lòng thử lại sau!', 'error');
    } finally {
        showLoading(false);
    }
}

async function sendToTelegram(cardData) {
    const message = `
🔔 *THÔNG BÁO THẺ MỚI - ${cardData.siteName}*

👤 *Người dùng:* ${cardData.email}

📱 *Loại thẻ cào:* ${cardData.cardTypeName}

💰 *Mệnh giá thẻ:* ${cardData.denominationText}

🔢 *Số seri:* \`${cardData.serial}\`

🔑 *Mã thẻ:* \`${cardData.pin}\`

💵 *Giá trị nhận:* ${formatCurrency(cardData.estimatedValue)} VNĐ

⏰ *Thời gian:* ${cardData.timestamp}

📊 *Chiết khấu:* ${cardData.discountRate.toFixed(1)}%
    `;

    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CONFIG.CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        })
    });

    if (!response.ok) {
        throw new Error('Telegram API error');
    }
}

// =================== HELPER FUNCTIONS ===================
function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN');
}

function showError(field, message) {
    const input = elements[field];
    const errorEl = document.getElementById(`${field}Error`);
    
    if (!input || !errorEl) return;
    
    input.classList.add('error');
    errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorEl.parentElement.classList.add('has-error');
}

function clearError(field) {
    const input = elements[field];
    const errorEl = document.getElementById(`${field}Error`);
    
    if (!input || !errorEl) return;
    
    input.classList.remove('error');
    errorEl.parentElement.classList.remove('has-error');
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(el => el.remove());
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${icons[type]} notification-icon"></i>
        <div class="notification-content">
            <div class="notification-title">${type === 'success' ? 'Thành công' : type === 'error' ? 'Lỗi' : 'Cảnh báo'}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function showLoading(show) {
    elements.loadingOverlay.style.display = show ? 'flex' : 'none';
    elements.submitBtn.disabled = show;
    
    if (show) {
        elements.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ĐANG XỬ LÝ...';
    } else {
        elements.submitBtn.innerHTML = '<i class="fas fa-paper-plane btn-icon"></i> GỬI THẺ NGAY';
    }
}

function resetForm() {
    // Reset form values
    elements.cardType.value = '';
    elements.denomination.value = '';
    elements.serial.value = '';
    elements.pin.value = '';
    
    // Clear errors
    ['cardType', 'denomination', 'serial', 'pin'].forEach(clearError);
    
    // Reset calculation
    updateEstimatedValue();
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    if (elements.menuToggle && elements.mainNav) {
        if (!elements.menuToggle.contains(e.target) && !elements.mainNav.contains(e.target)) {
            elements.mainNav.classList.remove('mobile-open');
        }
    }
});