const form = document.getElementById('url-form');
const input = document.getElementById('url-input');
const qrSection = document.getElementById('qr-section');
const qrBox = document.getElementById('qrcode');
const qrUrl = document.getElementById('qr-url');
const errorText = document.getElementById('error');

function showError(message) {
    errorText.textContent = message;
    errorText.hidden = false;
}

function normalizeUrl(value) {
    const url = value.trim();
    if (!url) return '';
    return /^[a-z][a-z0-9+.-]*:\/\//i.test(url) ? url : `https://${url}`;
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    errorText.hidden = true;

    const url = normalizeUrl(input.value);
    if (!url) {
        showError('URL을 입력해 주세요.');
        return;
    }

    try {
        qrBox.innerHTML = '';
        new QRCode(qrBox, {
            text: url,
            width: 240,
            height: 240,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
        qrUrl.textContent = url;
        // URL 입력창은 아래로, QR코드는 가운데에 표시
        qrSection.hidden = false;
    } catch (error) {
        showError('QR코드 생성 중 오류가 발생했습니다.');
    }
});

// QR코드 클릭 시 JPG로 다운로드
qrBox.addEventListener('click', () => {
    const source = qrBox.querySelector('canvas');
    if (!source) return;

    const padding = 20;
    const canvas = document.createElement('canvas');
    canvas.width = source.width + padding * 2;
    canvas.height = source.height + padding * 2;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(source, padding, padding);

    const link = document.createElement('a');
    link.download = 'qrcode.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
});

// 마우스 위치에 따라 그라데이션 색상 변화
document.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mx', `${x}%`);
    document.documentElement.style.setProperty('--my', `${y}%`);
});
