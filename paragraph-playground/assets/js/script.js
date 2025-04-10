const body = document.body;
const textArea = document.getElementById('textArea');
const updateTextBtn = document.getElementById('updateTextBtn');
const toggleModeBtn = document.getElementById('toggleModeBtn');
const fontSelect = document.getElementById('fontSelect');
const textContainer = document.getElementById('textContainer');
const vacuumStrength = document.getElementById('vacuumStrength');
const strengthValue = document.getElementById('strengthValue');
const vacuumRange = document.getElementById('vacuumRange');
const rangeValue = document.getElementById('rangeValue');
const hoverColor = document.getElementById('hoverColor');
const colorPreview = document.getElementById('colorPreview');
const colorIntensity = document.getElementById('colorIntensity');
const intensityValue = document.getElementById('intensityValue');
const togglePanelBtn = document.getElementById('togglePanelBtn');
const controlPanel = document.querySelector('.controls');

let letters = [];
let darkMode = false;
let mouseX = 0;
let mouseY = 0;
let currentFont = 'font-arial';
let strength = 0.5;         
let range = 150;            
let selectedColor = '#ff4500'; 
let intensity = 0.7;        


function togglePanel() {
    controlPanel.classList.toggle('collapsed');
    
    if (!controlPanel.classList.contains('collapsed')) {
        togglePanelBtn.style.right = '310px'; 
        if (window.innerWidth <= 480) {
            togglePanelBtn.style.display = 'none'; 
        }
    } else {
        togglePanelBtn.style.right = '20px'; 
        togglePanelBtn.style.display = 'flex'; 
    }
}

togglePanelBtn.addEventListener('click', togglePanel);

function checkWindowSize() {
    if (window.innerWidth <= 480) {
        
        if (!controlPanel.classList.contains('collapsed')) {
            togglePanelBtn.style.display = 'none';
        }
    } else {
        togglePanelBtn.style.display = 'flex';
        if (!controlPanel.classList.contains('collapsed')) {
            togglePanelBtn.style.right = '310px';
        }
    }
}

window.addEventListener('resize', checkWindowSize);

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
}

function getColorWithIntensity(factor) {
    const rgb = hexToRgb(selectedColor);
    const baseColor = darkMode ? { r: 255, g: 255, b: 255 } : { r: 0, g: 0, b: 0 };
    
    const computedFactor = factor * intensity;
    const r = Math.round(baseColor.r + (rgb.r - baseColor.r) * computedFactor);
    const g = Math.round(baseColor.g + (rgb.g - baseColor.g) * computedFactor);
    const b = Math.round(baseColor.b + (rgb.b - baseColor.b) * computedFactor);
    
    return `rgb(${r}, ${g}, ${b})`;
}

function createLetters() {
    textContainer.innerHTML = '';
    letters = [];
    
    const text = textArea.value;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const span = document.createElement('span');
        span.className = `letter ${currentFont}`;
        span.textContent = char;
        
        textContainer.appendChild(span);
        
        if (char === ' ') {
            span.style.marginRight = '0.25em';
        }
        
        if (char === '\n') {
            span.style.display = 'block';
        }
    }
    
    setTimeout(() => {
        const letterElements = document.querySelectorAll('.letter');
        letterElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            letters.push({
                element,
                originalX: rect.left,
                originalY: rect.top,
                x: rect.left,
                y: rect.top,
                targetX: rect.left,
                targetY: rect.top
            });
        });
    }, 100);
}

function updateLetters() {
    letters.forEach(letter => {
        const dx = mouseX - letter.originalX;
        const dy = mouseY - letter.originalY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < range) {
            const factor = (1 - distance / range) * strength;
            letter.targetX = letter.originalX + dx * factor;
            letter.targetY = letter.originalY + dy * factor;
            
            letter.element.style.color = getColorWithIntensity(factor);
        } else {
            letter.targetX = letter.originalX;
            letter.targetY = letter.originalY;
            letter.element.style.color = '';
        }
        
        letter.x += (letter.targetX - letter.x) * 0.2;
        letter.y += (letter.targetY - letter.y) * 0.2;
        
        const translateX = letter.x - letter.originalX;
        const translateY = letter.y - letter.originalY;
        letter.element.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });
    
    requestAnimationFrame(updateLetters);
}

function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function updateText() {
    createLetters();
}

function changeFont() {
    currentFont = fontSelect.value;
    document.querySelectorAll('.letter').forEach(letter => {
        letter.className = `letter ${currentFont}`;
    });
    
    setTimeout(() => {
        letters.forEach(letter => {
            const rect = letter.element.getBoundingClientRect();
            letter.originalX = rect.left;
            letter.originalY = rect.top;
            letter.targetX = rect.left;
            letter.targetY = rect.top;
        });
    }, 100);
}

function updateVacuumStrength() {
    strength = vacuumStrength.value / 100;
    strengthValue.textContent = `${vacuumStrength.value}%`;
}

function updateVacuumRange() {
    range = parseInt(vacuumRange.value);
    rangeValue.textContent = `${range}px`;
}

function updateColor() {
    selectedColor = hoverColor.value;
    colorPreview.style.backgroundColor = selectedColor;
}

function updateColorIntensity() {
    intensity = colorIntensity.value / 100;
    intensityValue.textContent = `${colorIntensity.value}%`;
}

function toggleDarkMode() {
    darkMode = !darkMode;
    if (darkMode) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        toggleModeBtn.innerHTML = '<i class="fas fa-moon"></i>'; 
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        toggleModeBtn.innerHTML = '<i class="fas fa-sun"></i>'; 
    }
}

document.addEventListener('mousemove', handleMouseMove);
updateTextBtn.addEventListener('click', updateText);
toggleModeBtn.addEventListener('click', toggleDarkMode);
fontSelect.addEventListener('change', changeFont);
vacuumStrength.addEventListener('input', updateVacuumStrength);
vacuumRange.addEventListener('input', updateVacuumRange);
hoverColor.addEventListener('input', updateColor);
colorIntensity.addEventListener('input', updateColorIntensity);

createLetters();
updateLetters();
checkWindowSize(); 

window.addEventListener('resize', () => {
    createLetters();
});