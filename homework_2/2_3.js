function generate() {
    var N = document.getElementById("N").value;
    var k = document.getElementById("k").value;
    var output = document.getElementById("output3");
    output.innerHTML = "";

    var randoms = [];
    for (var i = 0; i < N; i++) {
        randoms.push(Math.random());
    }

    var classIntervals = [];
    for (var i = 0; i < k; i++) {
        classIntervals.push([i / k, (i + 1) / k]);
    }

    var classFreq = {};
    for (var i = 0; i < classIntervals.length; i++) {
        classFreq[i] = 0;
    }

    for (var i = 0; i < randoms.length; i++) {
        for (var j = 0; j < classIntervals.length; j++) {
            if (randoms[i] >= classIntervals[j][0] && randoms[i] < classIntervals[j][1]) {
                classFreq[j]++;
            }
        }
    }

    for (var i = 0; i < classIntervals.length; i++) {
        output.innerHTML += "[" + classIntervals[i][0] + ", " + classIntervals[i][1] + "): " + classFreq[i] + "";
    }

    // Create a histogram using Chart.js library
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: classIntervals.map(interval => "[" + interval[0] + ", " + interval[1] + ")"),
            datasets: [{
                label: 'Frequency',
                data: Object.values(classFreq),
                backgroundColor: 'rgb(130, 23, 41, 0.2)', // Colore di sfondo con un tocco di trasparenza
                borderColor: 'rgb(130, 23, 41, 1)', // Colore del bordo
                borderWidth: 1 // Larghezza del bordo
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
