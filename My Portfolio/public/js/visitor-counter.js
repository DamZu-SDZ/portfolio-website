// Simpan dalam folder public/js/visitor-counter.js
document.addEventListener('DOMContentLoaded', () => {
    let count = localStorage.getItem('page_view');
    
    if (count === null) {
        count = 1250; // Nombor permulaan supaya nampak gah
    } else {
        count = parseInt(count) + 1;
    }
    
    localStorage.setItem('page_view', count);
    
    // Cari elemen dengan ID 'visitor-count' dan paparkan
    const counterElement = document.getElementById('visitor-count');
    if (counterElement) {
        counterElement.innerHTML = `SYSTEM VIEWS: ${count}`;
    }
});