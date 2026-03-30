// Simpan dalam folder public/js/custom-cursor.js
const cursor = document.createElement('div');
cursor.style.cssText = `
    width: 20px;
    height: 20px;
    border: 2px solid #00d2ff;
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease-out;
    box-shadow: 0 0 15px #00d2ff;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
});

document.addEventListener('mousedown', () => cursor.style.transform = 'scale(1.5)');
document.addEventListener('mouseup', () => cursor.style.transform = 'scale(1)');