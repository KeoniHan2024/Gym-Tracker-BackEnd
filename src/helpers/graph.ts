export function calculateMovingAverage(data: {}, windowSize: number) {
    if (!Array.isArray(data) || data.length === 0 || windowSize <= 0) {
        return []; // Handle invalid input
    }

    const movingAverages = [];
    for (let i = 0; i < data.length; i++) {
        if (i < windowSize - 1) {
            // For the first few points, we don't have enough data for a full window
            movingAverages.push({
                date: data[i].log_date,
                movingAverage: null // Or you could use a partial average here if you prefer
            });
        } else {
            // Calculate the sum of the weights in the current window
            let sum = 0;
            for (let j = i - windowSize + 1; j <= i; j++) {
                sum += data[j].weight;
            }
            // Calculate the average
            const average = sum / windowSize;
            movingAverages.push({
                date: data[i].log_date,
                movingAverage: average
            });
        }
    }
    return movingAverages;
}
