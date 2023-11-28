let expenses = [];
let monthlyTotal = 0;
let categoryTotals = {};

const categoryColors = {
    casa: '#8A2BE2',
    bar: '#74B9FF',
    viaggi: '#00B894',
    spesa: '#FDCB6E',
    sport: '#6C5CE7',
    salute: '#FF7675',
    mangiarefuori: '#FFA07A',
    svago: '#20B2AA',
    compere: '#81ECEC',
    altro: '#FD79A8',
	macchina: '#6e6e6e',
};

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


function addExpense() {
    const amountInput = document.getElementById('amount');
    const categoryInput = document.getElementById('category');
    const descriptionInput = document.getElementById('description');

    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;
    const description = descriptionInput.value;

    if (isNaN(amount) || amount <= 0) {
        alert('Inserisci un importo valido.');
        return;
    }

	if (!category.trim()) {
        alert('Inserisci una categoria.');
        return;
    }

    const expense = { amount, category, description, date: new Date() };
    expenses.push(expense);


    // Ordina le spese in base alla data in modo decrescente
    expenses.sort((a, b) => b.date - a.date);

    updateExpensesList();
    updateTotals();

	// Reset form
	amountInput.value = '';
	categoryInput.value = ''; // Imposta la categoria su un valore vuoto
	descriptionInput.value = '';
}

function updateExpensesList() {
    const expensesList = document.getElementById('expenses-list');
    expensesList.innerHTML = '';

    expenses.forEach((expense, index) => {
        const listItem = document.createElement('div');
        listItem.classList.add('expense-item');

        // Aggiungi una classe specifica per ogni categoria
        listItem.classList.add(expense.category.toLowerCase());

        const formattedDate = expense.date.toLocaleString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
        });

        const formattedCategory = capitalizeFirstLetter(expense.category);
        listItem.innerHTML = `${formattedDate} - ${formattedCategory} - ${expense.amount}€ - ${expense.description} <button class="delete-button" onclick="deleteExpense(${index})">Elimina</button>`;
        expensesList.appendChild(listItem);
    });
}


function deleteExpense(index) {
    expenses.splice(index, 1);
    updateExpensesList();
    updateTotals();
}

function updateTotals() {
    updateCategoryTotals();
    updateMonthlyTotal();
}

function updateCategoryTotals() {
    categoryTotals = {};

    expenses.forEach((expense) => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });

    const categoryTotalsList = document.getElementById('category-totals');
    categoryTotalsList.innerHTML = '';

    // Ordina le categorie per importo decrescente
    const sortedCategories = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a]);

    sortedCategories.forEach((category) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${capitalizeFirstLetter(category)}: ${categoryTotals[category].toFixed(2)}€`;
        categoryTotalsList.appendChild(listItem);
    });

	// Aggiungi questo codice per preparare i dati per il grafico a torta
    const categoryLabels = Object.keys(categoryTotals);
    const categoryData = Object.values(categoryTotals);

    // Chiama una funzione per disegnare il grafico
    drawCategoryChart(categoryLabels, categoryData);
}

function updateMonthlyTotal() {
    monthlyTotal = expenses.reduce((total, expense) => total + expense.amount, 0);
    const monthlyTotalElement = document.getElementById('monthly-total');
    monthlyTotalElement.textContent = `${monthlyTotal.toFixed(2)}€`;
}

let categoryChart; // Dichiarazione della variabile del grafico fuori dalla funzione

// Funzione per formattare il testo delle etichette con la prima lettera maiuscola
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function drawCategoryChart(labels, data) {
    const ctx = document.getElementById('category-chart').getContext('2d');

    // Formatta le etichette con la prima lettera maiuscola
    const formattedLabels = labels.map(label => capitalizeFirstLetter(label));

	// Crea un array di colori basato sulle categorie
    const backgroundColors = formattedLabels.map(label => categoryColors[label.toLowerCase()]);

    // Se il grafico non esiste, crea una nuova istanza
    if (!categoryChart) {
        categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: formattedLabels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                }],
            },
            options: {
			responsive: true,
			maintainAspectRatio: false,
			aspectRatio: 1,
			legend: {
				labels: {
            generateLabels: function (chart) {
                const labels = Chart.defaults.global.legend.labels.generateLabels(chart);
                labels.forEach(label => label.text = capitalizeFirstLetter(label.text));
                return labels;
            },
        },
    },
},
        });
    } else {
        // Se il grafico esiste, aggiorna solo i dati
        categoryChart.data.labels = formattedLabels;
        categoryChart.data.datasets[0].data = data;
        categoryChart.data.datasets[0].backgroundColor = backgroundColors;
        categoryChart.update(); // Aggiorna il grafico

    }
}






