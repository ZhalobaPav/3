const ctx = document.getElementById('priceChart').getContext('2d');

document.addEventListener("DOMContentLoaded", function () {
    const chartArray = getArrayFromLocalStorage('chart');
    console.log(`Cart:`, chartArray);
    drawPriceHistogram(chartArray);
})

function getArrayFromLocalStorage(key) {
    const arrayString = localStorage.getItem(key);
    if (arrayString) {
        return JSON.parse(arrayString);
    } else {
        return [];
    }
}

function drawPriceHistogram(array) {
    const prices = array.map(product => product.price);

    const numBins = 10;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const binWidth = (maxPrice - minPrice) / numBins;

    const data = [];
    for (let i = 0; i < numBins; i++) {
        const lowerBound = minPrice + i * binWidth;
        const upperBound = lowerBound + binWidth;
        const count = prices.filter(price => price >= lowerBound && price < upperBound).length;
        data.push(count);
    }

    const labels = [];
    for (let i = 0; i < numBins; i++) {
        const lowerBound = minPrice + i * binWidth;
        const upperBound = lowerBound + binWidth;
        labels.push(`$${lowerBound.toFixed(2)} - $${upperBound.toFixed(2)}`);
    }

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    const histogram = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ціна',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: options
    });
}

