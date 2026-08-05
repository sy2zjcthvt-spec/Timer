let totalTime = parseInt(localStorage.getItem('totalTime')) || 300;
let timeLeft = parseInt(localStorage.getItem('timeLeft')) || 300;
let timerId = null;
let endTime = parseInt(localStorage.getItem('endTime')) || null;
let totalElapsedSeconds = parseInt(localStorage.getItem('totalElapsedSeconds')) || 0;
let speedMultiplier = 1;

function format(s) { return Math.floor(s/60) + ":" + (s%60).toString().padStart(2,'0'); }

function update() {
    document.getElementById('time').innerText = format(timeLeft);
    document.getElementById('elapsed').innerText = format(totalTime - timeLeft);
    document.getElementById('total').innerText = format(totalTime);
    document.getElementById('fill').style.width = ((totalTime - timeLeft) / totalTime * 100) + "%";
    
    const percent = Math.max(0, Math.round((timeLeft / totalTime) * 100));
    document.getElementById('percentage').innerText = `${percent}% left`;
    
    document.getElementById('totalElapsed').innerText = Math.floor(totalElapsedSeconds / 60);
    
    localStorage.setItem('totalTime', totalTime);
    localStorage.setItem('timeLeft', timeLeft);
}

function startTimer() {
    if(timerId) return;
    document.getElementById('status').innerText = "running";
    
    // Save the exact time the timer should end
    endTime = Date.now() + (timeLeft * 1000);
    localStorage.setItem('endTime', endTime);
    
    timerId = setInterval(() => {
        const now = Date.now();
        if (now < endTime) {
            timeLeft = Math.round((endTime - now) / 1000);
            totalElapsedSeconds++;
            localStorage.setItem('totalElapsedSeconds', totalElapsedSeconds);
            update();
        } else {
            timeLeft = 0;
            update();
            pauseTimer();
            document.getElementById('sessions').innerText = parseInt(document.getElementById('sessions').innerText) + 1;
        }
    }, 1000 / speedMultiplier);
}

function pauseTimer() { 
    clearInterval(timerId); 
    timerId = null; 
    endTime = null;
    localStorage.removeItem('endTime');
    document.getElementById('status').innerText = "paused"; 
}

function resetTimer() { 
    pauseTimer(); 
    timeLeft = totalTime; 
    update(); 
}

function addTime(s) { 
    totalTime = Math.max(60, totalTime + s); 
    timeLeft = Math.max(0, timeLeft + s); 
    if(timerId) {
        endTime = Date.now() + (timeLeft * 1000);
        localStorage.setItem('endTime', endTime);
    }
    update(); 
}

function setSpeed(newSpeed, element) {
    speedMultiplier = newSpeed;
    const buttons = document.querySelectorAll('.speed-controls button');
    buttons.forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    
    if(timerId) {
        pauseTimer();
        startTimer();
    }
}

// Check for a running timer immediately when the app loads
if (endTime && endTime > Date.now()) {
    timeLeft = Math.round((endTime - Date.now()) / 1000);
    startTimer();
} else if (endTime) {
    timeLeft = 0;
    localStorage.removeItem('endTime');
}

update();