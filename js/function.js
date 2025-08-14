 let array = [];
        let isRunning = false;
        let speed = 300;
        let comparisons = 0;
        let swaps = 0;
        let startTime = 0;
        let timerInterval = null;

        // Generar array inicial
        function generateArray() {
            if (isRunning) return;
            
            array = [];
            for (let i = 0; i < 12; i++) {
                array.push(Math.floor(Math.random() * 300) + 10);
            }
            renderArray();
            resetStats();
        }

        // Renderizar array visualmente
        function renderArray() {
            const container = document.getElementById('arrayContainer');
            container.innerHTML = '';
            
            array.forEach((value, index) => {
                const bar = document.createElement('div');
                bar.className = 'bar';
                bar.style.height = value + 'px';
                bar.innerHTML = `<span>${value}</span>`;
                bar.id = `bar-${index}`;
                container.appendChild(bar);
            });
        }

        // Función de delay para animaciones
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Algoritmo Bubble Sort con visualización
        async function bubbleSort() {
            const n = array.length;
            
            for (let i = 0; i < n - 1; i++) {
                let swapped = false;
                
                for (let j = 0; j < n - i - 1; j++) {
                    if (!isRunning) return;
                    
                    // Resaltar elementos que se están comparando
                    highlightBars([j, j + 1], 'comparing');
                    updateExplanation(`Comparando ${array[j]} y ${array[j + 1]}`);
                    
                    comparisons++;
                    updateStats();
                    
                    await delay(speed);
                    
                    // Si están en orden incorrecto, intercambiar
                    if (array[j] > array[j + 1]) {
                        highlightBars([j, j + 1], 'swapping');
                        updateExplanation(`${array[j]} > ${array[j + 1]} - Intercambiando...`);
                        
                        // Intercambiar en el array
                        [array[j], array[j + 1]] = [array[j + 1], array[j]];
                        swapped = true;
                        swaps++;
                        
                        await delay(speed);
                        renderArray();
                        updateStats();
                    }
                    
                    // Quitar resaltado
                    removeHighlight();
                    await delay(speed / 2);
                }
                
                // Si no hubo intercambios, el array está ordenado
                if (!swapped) {
                    break;
                }
            }
            
            // Animación de finalización
            await celebrateSort();
        }

        // Resaltar barras
        function highlightBars(indices, className) {
            removeHighlight();
            indices.forEach(index => {
                const bar = document.getElementById(`bar-${index}`);
                if (bar) {
                    bar.classList.add(className);
                }
            });
        }

        // Quitar resaltado
        function removeHighlight() {
            const bars = document.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.classList.remove('comparing', 'swapping');
            });
        }

        // Iniciar ordenamiento
        async function startSort() {
            if (isRunning) return;
            
            isRunning = true;
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 100);
            
            document.getElementById('sortBtn').disabled = true;
            document.getElementById('status').textContent = 'Ordenando...';
            
            await bubbleSort();
            
            isRunning = false;
            clearInterval(timerInterval);
            document.getElementById('sortBtn').disabled = false;
            document.getElementById('status').textContent = '¡Completado!';
        }

        // Animación de celebración
        async function celebrateSort() {
            updateExplanation('¡Array ordenado correctamente!');
            
            for (let i = 0; i < array.length; i++) {
                const bar = document.getElementById(`bar-${i}`);
                bar.style.background = 'linear-gradient(to top, #56ab2f, #a8e6cf)';
                await delay(100);
            }
        }

        // Actualizar estadísticas
        function updateStats() {
            document.getElementById('comparisons').textContent = comparisons;
            document.getElementById('swaps').textContent = swaps;
        }

        // Actualizar temporizador
        function updateTimer() {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            document.getElementById('time').textContent = elapsed + 's';
        }

        // Reiniciar estadísticas
        function resetStats() {
            comparisons = 0;
            swaps = 0;
            updateStats();
            document.getElementById('time').textContent = '0s';
            document.getElementById('status').textContent = 'Listo';
            updateExplanation('Presiona "Iniciar Ordenamiento" para comenzar');
        }

        // Actualizar explicación
        function updateExplanation(text) {
            document.getElementById('explanation').innerHTML = 
                `<span class="highlight">${text}</span>`;
        }

        // Reiniciar array
        function resetArray() {
            if (isRunning) return;
            isRunning = false;
            clearInterval(timerInterval);
            document.getElementById('sortBtn').disabled = false;
            removeHighlight();
            resetStats();
            renderArray();
        }

        // Alternar velocidad
        function toggleSpeed() {
            const speedBtn = document.getElementById('speedBtn');
            if (speed === 300) {
                speed = 100;
                speedBtn.textContent = '⚡ Velocidad: Rápida';
            } else if (speed === 100) {
                speed = 50;
                speedBtn.textContent = '⚡ Velocidad: Muy Rápida';
            } else {
                speed = 300;
                speedBtn.textContent = '⚡ Velocidad: Normal';
            }
        }

        // Inicializar la aplicación
        window.addEventListener('load', () => {
            generateArray();
        });