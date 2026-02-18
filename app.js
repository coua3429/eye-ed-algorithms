// Eye Emergency Clinical Decision Support - JavaScript

class EyeEmergencyApp {
    constructor() {
        this.algorithms = [];
        this.currentAlgorithm = null;
        this.currentNode = null;
        this.history = [];
        this.favourites = this.loadFromStorage('favourites') || [];
        this.recentlyUsed = this.loadFromStorage('recentlyUsed') || [];

        this.init();
    }

    async init() {
        await this.loadAlgorithms();
        this.setupEventListeners();
        this.renderHome();
        this.updateFavourites();
        this.updateRecentlyUsed();
    }

    // Data Management
    async loadAlgorithms() {
        try {
            const algorithmFiles = [
                'data/flashes-floaters.json',
                'data/double-vision.json', 
                'data/red-eye.json'
            ];

            this.algorithms = [];

            for (const file of algorithmFiles) {
                try {
                    const response = await fetch(file);
                    if (response.ok) {
                        const algorithm = await response.json();
                        this.algorithms.push(algorithm);
                    } else {
                        console.warn(`Failed to load ${file}`);
                    }
                } catch (error) {
                    console.error(`Error loading ${file}:`, error);
                }
            }

            console.log(`Loaded ${this.algorithms.length} algorithms`);
        } catch (error) {
            console.error('Error loading algorithms:', error);
            this.showToast('Error loading algorithms', 'error');
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Search functionality
        document.getElementById('searchToggle').addEventListener('click', () => {
            this.toggleSearch();
        });

        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        document.getElementById('searchBtn').addEventListener('click', () => {
            const query = document.getElementById('searchInput').value;
            this.handleSearch(query);
        });

        // Navigation
        document.getElementById('backToHome').addEventListener('click', () => {
            this.showHome();
        });

        // Wizard controls
        document.getElementById('undoBtn').addEventListener('click', () => {
            this.undoStep();
        });

        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartAlgorithm();
        });

        document.getElementById('restartFromOutcome').addEventListener('click', () => {
            this.restartAlgorithm();
        });

        // Red flags toggle
        document.getElementById('toggleRedFlags').addEventListener('click', () => {
            this.toggleRedFlags();
        });

        document.getElementById('collapseRedFlags').addEventListener('click', () => {
            this.toggleRedFlags();
        });

        // Favourite toggle
        document.getElementById('toggleFavourite').addEventListener('click', () => {
            this.toggleFavourite();
        });

        // ESR copy functionality
        document.getElementById('copyESRBtn').addEventListener('click', () => {
            this.copyESRReport();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.isWizardActive()) {
                    this.showHome();
                }
            }
        });
    }

    // Search Functionality
    toggleSearch() {
        const searchContainer = document.getElementById('searchContainer');
        const isActive = searchContainer.classList.contains('active');

        if (isActive) {
            searchContainer.classList.remove('active');
            document.getElementById('searchInput').value = '';
            this.renderAlgorithmsList(this.algorithms);
        } else {
            searchContainer.classList.add('active');
            document.getElementById('searchInput').focus();
        }
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.renderAlgorithmsList(this.algorithms);
            return;
        }

        const filtered = this.algorithms.filter(algorithm => 
            algorithm.title.toLowerCase().includes(query.toLowerCase()) ||
            algorithm.author.toLowerCase().includes(query.toLowerCase()) ||
            algorithm.keyPoints.some(point => 
                point.toLowerCase().includes(query.toLowerCase())
            )
        );

        this.renderAlgorithmsList(filtered);
    }

    // Home Screen Rendering
    renderHome() {
        this.renderAlgorithmsList(this.algorithms);
    }

    renderAlgorithmsList(algorithms) {
        const container = document.getElementById('algorithmsList');

        if (algorithms.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No algorithms found matching your search.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = algorithms.map(algorithm => `
            <div class="algorithm-card" data-algorithm-id="${algorithm.id}">
                <div class="algorithm-card-header">
                    <div>
                        <h3 class="algorithm-title">${algorithm.title}</h3>
                        <p class="algorithm-author">by ${algorithm.author}</p>
                    </div>
                    <button class="favourite-btn ${this.isFavourite(algorithm.id) ? 'active' : ''}" 
                            data-algorithm-id="${algorithm.id}">
                        ⭐
                    </button>
                </div>
                <div class="algorithm-description">
                    ${algorithm.keyPoints.slice(0, 2).map(point => `• ${point}`).join('<br>')}
                    ${algorithm.keyPoints.length > 2 ? '<br>...' : ''}
                </div>
            </div>
        `).join('');

        // Add event listeners
        container.querySelectorAll('.algorithm-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('favourite-btn')) {
                    const algorithmId = card.dataset.algorithmId;
                    this.startAlgorithm(algorithmId);
                }
            });
        });

        container.querySelectorAll('.favourite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const algorithmId = btn.dataset.algorithmId;
                this.toggleAlgorithmFavourite(algorithmId);
            });
        });
    }

    // Favourites Management
    updateFavourites() {
        const container = document.getElementById('favouritesList');
        const favouriteAlgorithms = this.algorithms.filter(alg => 
            this.favourites.includes(alg.id)
        );

        if (favouriteAlgorithms.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No favourites yet. Star algorithms to add them here.</p>
                </div>
            `;
            return;
        }

        this.renderAlgorithmGrid(container, favouriteAlgorithms);
    }

    updateRecentlyUsed() {
        const container = document.getElementById('recentList');
        const recentAlgorithms = this.recentlyUsed
            .map(id => this.algorithms.find(alg => alg.id === id))
            .filter(Boolean)
            .slice(0, 5);

        if (recentAlgorithms.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No recent algorithms. Start using algorithms to see them here.</p>
                </div>
            `;
            return;
        }

        this.renderAlgorithmGrid(container, recentAlgorithms);
    }

    renderAlgorithmGrid(container, algorithms) {
        container.innerHTML = algorithms.map(algorithm => `
            <div class="algorithm-card" data-algorithm-id="${algorithm.id}">
                <div class="algorithm-card-header">
                    <div>
                        <h3 class="algorithm-title">${algorithm.title}</h3>
                        <p class="algorithm-author">by ${algorithm.author}</p>
                    </div>
                    <button class="favourite-btn ${this.isFavourite(algorithm.id) ? 'active' : ''}" 
                            data-algorithm-id="${algorithm.id}">
                        ⭐
                    </button>
                </div>
                <div class="algorithm-description">
                    ${algorithm.keyPoints.slice(0, 2).map(point => `• ${point}`).join('<br>')}
                </div>
            </div>
        `).join('');

        // Add event listeners
        container.querySelectorAll('.algorithm-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('favourite-btn')) {
                    const algorithmId = card.dataset.algorithmId;
                    this.startAlgorithm(algorithmId);
                }
            });
        });

        container.querySelectorAll('.favourite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const algorithmId = btn.dataset.algorithmId;
                this.toggleAlgorithmFavourite(algorithmId);
            });
        });
    }

    isFavourite(algorithmId) {
        return this.favourites.includes(algorithmId);
    }

    toggleAlgorithmFavourite(algorithmId) {
        if (this.isFavourite(algorithmId)) {
            this.favourites = this.favourites.filter(id => id !== algorithmId);
        } else {
            this.favourites.push(algorithmId);
        }

        this.saveToStorage('favourites', this.favourites);
        this.updateFavourites();
        this.renderAlgorithmsList(this.algorithms);

        const algorithm = this.algorithms.find(alg => alg.id === algorithmId);
        const action = this.isFavourite(algorithmId) ? 'added to' : 'removed from';
        this.showToast(`${algorithm.title} ${action} favourites`, 'success');
    }

    toggleFavourite() {
        if (this.currentAlgorithm) {
            this.toggleAlgorithmFavourite(this.currentAlgorithm.id);
            this.updateFavouriteButton();
        }
    }

    updateFavouriteButton() {
        const btn = document.getElementById('toggleFavourite');
        if (this.currentAlgorithm && this.isFavourite(this.currentAlgorithm.id)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    }

    // Algorithm Wizard
    startAlgorithm(algorithmId) {
        const algorithm = this.algorithms.find(alg => alg.id === algorithmId);
        if (!algorithm) {
            this.showToast('Algorithm not found', 'error');
            return;
        }

        this.currentAlgorithm = algorithm;
        this.history = [];
        this.addToRecentlyUsed(algorithmId);

        this.showWizard();
        this.setupWizard();
        this.goToNode(algorithm.algorithm.start);
    }

    showWizard() {
        document.getElementById('homeScreen').classList.remove('active');
        document.getElementById('wizardScreen').classList.add('active');
    }

    showHome() {
        document.getElementById('wizardScreen').classList.remove('active');
        document.getElementById('homeScreen').classList.add('active');
        this.currentAlgorithm = null;
        this.currentNode = null;
        this.history = [];
    }

    setupWizard() {
        if (!this.currentAlgorithm) return;

        // Set title
        document.getElementById('wizardTitle').textContent = this.currentAlgorithm.title;

        // Setup red flags
        this.setupRedFlags();

        // Update favourite button
        this.updateFavouriteButton();

        // Hide outcome initially
        document.getElementById('outcomeContainer').style.display = 'none';
        document.getElementById('questionContainer').style.display = 'block';
    }

    setupRedFlags() {
        const content = document.getElementById('redFlagsContent');

        const keyPointsHtml = `
            <div class="key-points">
                <h4>Key Clinical Points:</h4>
                <ul>
                    ${this.currentAlgorithm.keyPoints.map(point => `<li>${point}</li>`).join('')}
                </ul>
            </div>
        `;

        const redFlagsHtml = `
            <div class="red-flags-list">
                <h4>Red Flag Symptoms:</h4>
                <ul>
                    ${this.currentAlgorithm.redFlags.map(flag => `<li>${flag}</li>`).join('')}
                </ul>
            </div>
        `;

        content.innerHTML = keyPointsHtml + redFlagsHtml;
    }

    toggleRedFlags() {
        const content = document.getElementById('redFlagsContent');
        const btn = document.getElementById('collapseRedFlags');

        if (content.classList.contains('collapsed')) {
            content.classList.remove('collapsed');
            btn.textContent = '−';
        } else {
            content.classList.add('collapsed');
            btn.textContent = '+';
        }
    }

    goToNode(nodeId) {
        const node = this.currentAlgorithm.algorithm.nodes[nodeId];
        if (!node) {
            console.error('Node not found:', nodeId);
            return;
        }

        this.currentNode = nodeId;
        this.updateProgress();

        if (node.type === 'question') {
            this.showQuestion(node);
        } else if (node.type === 'outcome') {
            this.showOutcome(node);
        }

        // Update undo button
        document.getElementById('undoBtn').disabled = this.history.length === 0;
    }

    showQuestion(node) {
        document.getElementById('questionContainer').style.display = 'block';
        document.getElementById('outcomeContainer').style.display = 'none';

        document.getElementById('questionText').textContent = node.text;

        const answersContainer = document.getElementById('answersContainer');
        answersContainer.innerHTML = node.answers.map((answer, index) => `
            <button class="answer-btn" data-next="${answer.next}" data-answer="${answer.text}">
                ${answer.text}
            </button>
        `).join('');

        // Add event listeners to answer buttons
        answersContainer.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const nextNode = btn.dataset.next;
                const answerText = btn.dataset.answer;
                this.selectAnswer(nextNode, answerText);
            });
        });
    }

    selectAnswer(nextNode, answerText) {
        // Add to history
        this.history.push({
            nodeId: this.currentNode,
            answer: answerText,
            nextNode: nextNode
        });

        // Go to next node
        this.goToNode(nextNode);
    }

    showOutcome(node) {
        document.getElementById('questionContainer').style.display = 'none';
        document.getElementById('outcomeContainer').style.display = 'block';

        document.getElementById('outcomeContent').innerHTML = node.text;
    }

    undoStep() {
        if (this.history.length === 0) return;

        const lastStep = this.history.pop();
        this.goToNode(lastStep.nodeId);
    }

    restartAlgorithm() {
        if (!this.currentAlgorithm) return;

        this.history = [];
        this.goToNode(this.currentAlgorithm.algorithm.start);
    }

    updateProgress() {
        // Calculate progress based on history length
        const totalSteps = this.estimateSteps();
        const currentStep = this.history.length + 1;
        const progress = Math.min((currentStep / totalSteps) * 100, 100);

        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = `Step ${currentStep} of ~${totalSteps}`;
    }

    estimateSteps() {
        // Estimate based on algorithm complexity
        const nodeCount = Object.keys(this.currentAlgorithm.algorithm.nodes).length;
        return Math.max(3, Math.floor(nodeCount / 2));
    }

    // ESR Report Generation
    copyESRReport() {
        if (!this.currentAlgorithm || !this.currentNode) return;

        const currentNodeData = this.currentAlgorithm.algorithm.nodes[this.currentNode];
        if (currentNodeData.type !== 'outcome') return;

        const triageLog = this.history.map((step, index) => 
            `${index + 1}. ${step.answer}`
        ).join('\n');

        const esrReport = `Presenting Complaint: ${this.currentAlgorithm.title}

Working Differential: [Leave blank for me to type]

Examination Summary: [Leave blank for me to type]

Plan: ${currentNodeData.text}

--- Triage Log ---:
${triageLog}`;

        // Copy to clipboard
        navigator.clipboard.writeText(esrReport).then(() => {
            this.showToast('ESR report copied to clipboard', 'success');
        }).catch(err => {
            console.error('Failed to copy:', err);
            this.showToast('Failed to copy to clipboard', 'error');
        });
    }

    // Utility Functions
    addToRecentlyUsed(algorithmId) {
        // Remove if already exists
        this.recentlyUsed = this.recentlyUsed.filter(id => id !== algorithmId);

        // Add to beginning
        this.recentlyUsed.unshift(algorithmId);

        // Keep only last 10
        this.recentlyUsed = this.recentlyUsed.slice(0, 10);

        this.saveToStorage('recentlyUsed', this.recentlyUsed);
        this.updateRecentlyUsed();
    }

    isWizardActive() {
        return document.getElementById('wizardScreen').classList.contains('active');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        const container = document.getElementById('toastContainer');
        container.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => container.removeChild(toast), 300);
        }, 3000);
    }

    saveToStorage(key, data) {
        try {
            localStorage.setItem(`eyeEmergency_${key}`, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(`eyeEmergency_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            return null;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.eyeEmergencyApp = new EyeEmergencyApp();
});

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}