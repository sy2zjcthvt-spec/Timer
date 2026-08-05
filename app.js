let totalTime = parseInt(localStorage.getItem('totalTime')) || 300;
let timeLeft = parseInt(localStorage.getItem('timeLeft')) || 300;
let timerId = null;
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
    
    timerId = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            totalElapsedSeconds++;
            localStorage.setItem('totalElapsedSeconds', totalElapsedSeconds);
            update();
        } else {
            pauseTimer();
            document.getElementById('sessions').innerText = parseInt(document.getElementById('sessions').innerText) + 1;
        }
    }, 1000 / speedMultiplier);
}

function pauseTimer() { 
    clearInterval(timerId); 
    timerId = null; 
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

update();
