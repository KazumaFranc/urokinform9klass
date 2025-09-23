// Навигация по разделам
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Убираем активный класс у всех кнопок и разделов
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('section').forEach(section => section.classList.remove('active'));

        // Добавляем активный класс к текущей кнопке и разделу
        this.classList.add('active');
        const targetId = this.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

// Матричный эффект на фоне
const matrixEffect = document.getElementById('matrixEffect');
const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

function createMatrix() {
    const columns = Math.floor(window.innerWidth / 20);
    matrixEffect.innerHTML = '';

    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.style.position = 'absolute';
        column.style.top = '-100px';
        column.style.left = (i * 20) + 'px';
        column.style.width = '20px';
        column.style.fontSize = '18px';
        column.style.color = 'rgba(0, 255, 255, 0.7)';
        column.style.textAlign = 'center';
        column.style.animation = `fall ${Math.random() * 5 + 3}s linear infinite`;
        column.style.animationDelay = Math.random() * 5 + 's';

        let text = '';
        for (let j = 0; j < 30; j++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length)) + '<br>';
        }

        column.innerHTML = text;
        matrixEffect.appendChild(column);
    }

    // Добавляем стиль для анимации падения
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fall {
            from { transform: translateY(-100px); }
            to { transform: translateY(${window.innerHeight}px); }
        }
    `;
    document.head.appendChild(style);
}

window.addEventListener('resize', createMatrix);
createMatrix();

// Интерактив: Построитель графов
let selectedNode = null;
const edges = [];

document.querySelectorAll('.graph-node').forEach(node => {
    node.addEventListener('click', function() {
        if (!selectedNode) {
            selectedNode = this;
            this.style.backgroundColor = 'rgba(0, 255, 255, 0.3)';
        } else if (selectedNode !== this) {
            // Создаем ребро между выбранными узлами
            createEdge(selectedNode, this);
            selectedNode.style.backgroundColor = '';
            selectedNode = null;
        } else {
            selectedNode.style.backgroundColor = '';
            selectedNode = null;
        }
    });
});

function createEdge(node1, node2) {
    const id1 = node1.getAttribute('data-id');
    const id2 = node2.getAttribute('data-id');

    // Проверяем, не существует ли уже такое ребро
    if (edges.some(edge =>
        (edge.from === id1 && edge.to === id2) ||
        (edge.from === id2 && edge.to === id1))) {
        return;
    }

    edges.push({from: id1, to: id2});

    // Создаем визуальное представление ребра
    const rect1 = node1.getBoundingClientRect();
    const rect2 = node2.getBoundingClientRect();

    const graphContainer = document.getElementById('graph-builder');
    const graphRect = graphContainer.getBoundingClientRect();

    const x1 = rect1.left + rect1.width/2 - graphRect.left;
    const y1 = rect1.top + rect1.height/2 - graphRect.top;
    const x2 = rect2.left + rect2.width/2 - graphRect.left;
    const y2 = rect2.top + rect2.height/2 - graphRect.top;

    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    const edge = document.createElement('div');
    edge.className = 'graph-edge';
    edge.style.width = length + 'px';
    edge.style.left = x1 + 'px';
    edge.style.top = y1 + 'px';
    edge.style.transform = `rotate(${angle}deg)`;

    graphContainer.appendChild(edge);
}

document.getElementById('clear-graph').addEventListener('click', function() {
    document.querySelectorAll('.graph-edge').forEach(edge => edge.remove());
    edges.length = 0;
    selectedNode = null;
    document.querySelectorAll('.graph-node').forEach(node => {
        node.style.backgroundColor = '';
    });
});

// Интерактив: Генератор случайных графов
document.getElementById('generate-graph').addEventListener('click', function() {
    const randomGraph = document.getElementById('random-graph');
    randomGraph.innerHTML = '';

    const nodeCount = Math.floor(Math.random() * 5) + 5; // 5-9 узлов
    const nodes = [];

    // Создаем узлы
    for (let i = 0; i < nodeCount; i++) {
        const node = document.createElement('div');
        node.className = 'graph-node';
        node.textContent = String.fromCharCode(65 + i); // A, B, C, ...
        node.setAttribute('data-id', i);
        randomGraph.appendChild(node);
        nodes.push(node);

        // Позиционируем узлы случайным образом
        node.style.position = 'absolute';
        node.style.left = Math.random() * 80 + 10 + '%';
        node.style.top = Math.random() * 70 + 15 + '%';
    }

    // Создаем случайные ребра
    const edgeCount = Math.floor(Math.random() * 8) + 5; // 5-12 ребер

    for (let i = 0; i < edgeCount; i++) {
        const fromIndex = Math.floor(Math.random() * nodeCount);
        let toIndex;
        do {
            toIndex = Math.floor(Math.random() * nodeCount);
        } while (toIndex === fromIndex);

        createRandomEdge(nodes[fromIndex], nodes[toIndex], randomGraph);
    }
});

function createRandomEdge(node1, node2, container) {
    const rect1 = node1.getBoundingClientRect();
    const rect2 = node2.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const x1 = rect1.left + rect1.width/2 - containerRect.left;
    const y1 = rect1.top + rect1.height/2 - containerRect.top;
    const x2 = rect2.left + rect2.width/2 - containerRect.left;
    const y2 = rect2.top + rect2.height/2 - containerRect.top;

    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    const edge = document.createElement('div');
    edge.className = 'graph-edge';
    edge.style.width = length + 'px';
    edge.style.left = x1 + 'px';
    edge.style.top = y1 + 'px';
    edge.style.transform = `rotate(${angle}deg)`;
    edge.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

    container.appendChild(edge);
}

// Интерактив: Смена цвета
document.getElementById('apply-color').addEventListener('click', function() {
    const color = document.getElementById('neon-color').value;
    document.getElementById('color-demo').style.color = color;
    document.getElementById('color-demo').style.textShadow = `0 0 10px ${color}`;
});

// Интерактив: Викторина
document.querySelectorAll('.quiz-option').forEach(option => {
    option.addEventListener('click', function() {
        const type = this.getAttribute('data-type');
        const result = document.getElementById('quiz-result');

        // Простая логика проверки (в реальном приложении была бы сложнее)
        const correctAnswers = {
            'scheme': 'Схема метро',
            'graph': 'График температуры',
            'diagram': 'Круговая диаграмма',
            'map': 'Карта города',
            'drawing': 'Чертеж детали'
        };

        result.textContent = `Правильно! ${correctAnswers[type]} - это пример ${type === 'scheme' ? 'схемы' :
            type === 'graph' ? 'графика' :
                type === 'diagram' ? 'диаграммы' :
                    type === 'map' ? 'карты' : 'чертежа'}.`;
        result.style.color = '#0ff';
    });
});

// Интерактив: Решение задачи о кратчайшем пути
document.getElementById('show-solution').addEventListener('click', function() {
    document.getElementById('path-solution').textContent =
        "Решение: A → C → E (общий вес: 2). Это кратчайший путь!";
    document.getElementById('path-solution').style.color = '#0ff';
});

// Логика для мегающей красной кнопки
const emergencyButton = document.getElementById('emergencyButton');
const emergencyPanel = document.getElementById('emergencyPanel');
const closePanel = document.getElementById('closePanel');
const warningMessage = document.getElementById('warningMessage');
const warningSound = document.getElementById('warningSound');

emergencyButton.addEventListener('click', function() {
    // Показываем сообщение "9 КЛАСС УЧИТЕ ПАРАГРАФЫ"
    warningMessage.classList.add('active');

    // Воспроизводим звук
    warningSound.play().catch(e => {
        console.log("Автовоспроизведение заблокировано. Пользователь должен взаимодействовать со страницей сначала.");
    });

    // Автоматически скрываем сообщение через 5 секунд
    setTimeout(() => {
        warningMessage.classList.remove('active');
    }, 5000);
});

closePanel.addEventListener('click', function() {
    emergencyPanel.classList.remove('active');
});

// Закрытие панели при клике вне её области
emergencyPanel.addEventListener('click', function(e) {
    if (e.target === emergencyPanel) {
        emergencyPanel.classList.remove('active');
    }
});

// Закрытие сообщения при клике на него
warningMessage.addEventListener('click', function() {
    warningMessage.classList.remove('active');
    warningSound.pause();
    warningSound.currentTime = 0;
});