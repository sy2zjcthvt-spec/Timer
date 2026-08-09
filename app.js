<div class="timer-card">
    <div id="time">05:00</div>
    <div id="percentage">100% left</div>
    <div class="status" id="status">paused</div>
</div>

<div class="progress-section" style="max-width: 400px; margin: 0 auto 20px;">
    <div class="progress-labels">
        <span>ELAPSED: <span id="elapsed">0:00</span></span>
        <span>TOTAL: <span id="total">5:00</span></span>
    </div>
    <div class="progress-bar"><div class="progress-fill" id="fill"></div></div>
</div>

<div class="controls">
    <button onclick="resetTimer()">✕</button>
    <button class="play" onclick="startTimer()">▶</button>
    <button onclick="pauseTimer()">⏸</button>
</div>

<div class="adjust">
    <div>
        <button onclick="addTime(-300)">-5m</button>
        <button onclick="addTime(-600)">-10m</button>
        <button onclick="addTime(-900)">-15m</button>
        <button onclick="addTime(-1800)">-30m</button>
        <button onclick="addTime(-3600)">-60m</button>
    </div>
    <div>
        <button onclick="addTime(300)">+5m</button>
        <button onclick="addTime(600)">+10m</button>
        <button onclick="addTime(900)">+15m</button>
        <button onclick="addTime(1800)">+30m</button>
        <button onclick="addTime(3600)">+60m</button>
    </div>
</div>

<div class="speed-controls">
    <button onclick="setSpeed(0.5, this)">0.5x</button>
    <button class="active" onclick="setSpeed(1, this)">1x</button>
    <button onclick="setSpeed(2, this)">2x</button>
    <button onclick="setSpeed(5, this)">5x</button>
    <button onclick="setSpeed(10, this)">10x</button>
    <button onclick="setSpeed(20, this)">20x</button>
</div>

<div class="stats">
    <h3>📊 Stats</h3>
    <p>Sessions Completed: <span id="sessions">0</span></p>
    <p>Total Time Elapsed: <span id="totalElapsed">0</span> minutes</p>
    <p>5-Second Intervals: <span id="fiveSecondCount">0</span></p>
</div>

<script>
    let totalTime = parseInt(localStorage.getItem('totalTime')) || 300;
    let timeLeft = parseInt(localStorage.getItem('timeLeft')) || 300;
    let timerId = null;
    let totalElapsedSeconds = parseInt(localStorage.getItem('totalElapsedSeconds')) || 0;
    let speedMultiplier = 1;
    let lastTick = parseInt(localStorage.getItem('lastTick')) || Date.now();

    function format(s) { return Math.floor(s/60) + ":" + (s%60).toString().padStart(2,'0'); }

    function update() {
        document.getElementById('time').innerText = format(timeLeft);
        document.getElementById('elapsed').innerText = format(totalTime - timeLeft);
        document.getElementById('total').innerText = format(totalTime);
        document.getElementById('fill').style.width = ((totalTime - timeLeft) / totalTime * 100) + "%";
        
        const percent = Math.max(0, Math.round((timeLeft / totalTime) * 100));
        document.getElementById('percentage').innerText = `${percent}% left`;
        
        document.getElementById('totalElapsed').innerText = Math.floor(totalElapsedSeconds / 60);
        
        const fiveSecondCount = Math.floor(totalElapsedSeconds / 5);
        if(document.getElementById('fiveSecondCount')) {
            document.getElementById('fiveSecondCount').innerText = fiveSecondCount;
        }
        
        localStorage.setItem('totalTime', totalTime);
        localStorage.setItem('timeLeft', timeLeft);
    }

    function handleTick() {
        const now = Date.now();
        const elapsedRealSeconds = Math.floor((now - lastTick) / 1000);
        
        if (elapsedRealSeconds >= 1) {
            const secondsToDeduct = elapsedRealSeconds * speedMultiplier;
            
            if (timeLeft > 0) {
                timeLeft = Math.max(0, timeLeft - secondsToDeduct);
                totalElapsedSeconds += secondsToDeduct;
                localStorage.setItem('totalElapsedSeconds', totalElapsedSeconds);
                lastTick = now;
                localStorage.setItem('lastTick', lastTick);
                update();
            } else {
                pauseTimer();
                document.getElementById('sessions').innerText = parseInt(document.getElementById('sessions').innerText) + 1;
            }
        }
    }

    function startTimer() {
        if(timerId) return;
        document.getElementById('status').innerText = "running";
        lastTick = Date.now();
        localStorage.setItem('lastTick', lastTick);
        
        timerId = setInterval(handleTick, 100);
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
    }

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === 'visible' && timerId) {
            handleTick();
        }
    });

    update();
</script>