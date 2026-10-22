const form = document.getElementById('short-form');
const input = document.getElementById('url-input');
const shortenBtn = document.getElementById('shorten-btn');
const result = document.getElementById('result');
const copyBtn = document.getElementById('copy-btn');
const errorText = document.getElementById('error');
const toast = document.getElementById('toast');

function normalizeUrl(value) {
    const url = value.trim();
    return /^[a-z][a-z0-9+.-]*:\/\//i.test(url) ? url : `https://${url}`;
}

function showError(message) {
    errorText.textContent = message;
    errorText.hidden = false;
}

// 입력 필드가 비어 있으면 '단축하기' 버튼 비활성화
input.addEventListener('input', () => {
    shortenBtn.disabled = input.value.trim() === '';
});

// is.gd OpenAPI로 URL 단축 요청 (CORS 허용)
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!input.value.trim()) return;

    errorText.hidden = true;
    shortenBtn.disabled = true;
    shortenBtn.textContent = '단축 중...';

    try {
        const longUrl = normalizeUrl(input.value);
        const response = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`);
        if (!response.ok) throw new Error('네트워크 오류가 발생했습니다.');
        const data = await response.json();
        if (data.errormessage) throw new Error(data.errormessage);

        result.value = data.shorturl;
        copyBtn.disabled = false;
    } catch (error) {
        result.value = '';
        copyBtn.disabled = true;
        showError(error.message || '네트워크 오류가 발생했습니다.');
    } finally {
        shortenBtn.textContent = '단축하기';
        shortenBtn.disabled = input.value.trim() === '';
    }
});

// '복사' 버튼 클릭 시 복사하고 알림 표시
copyBtn.addEventListener('click', async () => {
    if (!result.value) return;
    try {
        await navigator.clipboard.writeText(result.value);
    } catch (error) {
        result.select();
        document.execCommand('copy');
    }
    toast.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { toast.hidden = true; }, 2000);
});
