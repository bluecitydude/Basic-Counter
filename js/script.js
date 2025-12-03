document.addEventListener('DOMContentLoaded', () => {
  const hourEl = document.getElementById('hour');
  const minEl = document.getElementById('min');
  const secEl = document.getElementById('sec');
  const timerEl = document.getElementById('timer');
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');

  let timerId = null;
  let h = 0, m = 0, s = 0;

  function pad(v){return String(v).padStart(2,'0')}

  function updateDisplay(){
    timerEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    // visual tick
    timerEl.classList.remove('tick');
    void timerEl.offsetWidth; // force reflow
    timerEl.classList.add('tick');
  }

  function startCountdown(){
    if (timerId) return; // already running

    h = Math.max(0, Math.min(99, Number(hourEl.value) || 0));
    m = Math.max(0, Math.min(59, Number(minEl.value) || 0));
    s = Math.max(0, Math.min(59, Number(secEl.value) || 0));

    if (h===0 && m===0 && s===0){
      flashMessage('Set a duration');
      return;
    }

    updateDisplay();

    timerId = setInterval(()=>{
      if (h===0 && m===0 && s===0){
        finishCountdown();
        return;
      }

      if (s>0) s--;
      else if (m>0){ s=59; m--; }
      else if (h>0){ s=59; m=59; h--; }

      updateDisplay();
    },1000);

    startBtn.textContent = 'Running';
    startBtn.disabled = true;
  }

  function stopCountdown(){
    if (timerId) clearInterval(timerId);
    timerId = null;
    startBtn.textContent = 'Start';
    startBtn.disabled = false;
  }

  function finishCountdown(){
    stopCountdown();
    // celebration
    triggerConfetti();
    timerEl.classList.add('finish');
    timerEl.textContent = '00:00:00';
    // remove finish class after animation
    setTimeout(()=> timerEl.classList.remove('finish'), 1200);
  }

  function flashMessage(msg){
    const prev = timerEl.textContent;
    timerEl.textContent = msg;
    timerEl.classList.add('finish');
    setTimeout(()=>{ timerEl.classList.remove('finish'); timerEl.textContent = prev }, 900);
  }

  // Confetti implementation (lightweight canvas-based)
  function triggerConfetti(opts = {}){
    const count = opts.count || 90;
    const colors = opts.colors || ['#2ecc71','#ffd166','#ffd166','#ff6b6b','#4dd0e1','#f8b195'];
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti';
    canvas.classList.add('confetti');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = 9999;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const particles = [];
    for (let i=0;i<count;i++){
      particles.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height*0.35,
        size: 6 + Math.random()*8,
        color: colors[Math.floor(Math.random()*colors.length)],
        tilt: Math.random()*Math.PI*2,
        tiltSpeed: (Math.random()*0.1)+0.05,
        vx: (Math.random()-0.5)*6,
        vy: Math.random()*6+2,
        life: 60 + Math.floor(Math.random()*60)
      });
    }

    let frame = 0;
    function render(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for (let i=0;i<particles.length;i++){
        const p = particles[i];
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.sin(frame*0.03 + p.tilt) * 0.6);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // gravity
        p.tilt += p.tiltSpeed;
        p.life--;
      }

      // remove dead particles
      for (let i=particles.length-1;i>=0;i--){
        if (particles[i].life <= 0 || particles[i].y > canvas.height+50) particles.splice(i,1);
      }

      frame++;
      if (particles.length>0) requestAnimationFrame(render);
      else {
        // fade out then remove
        canvas.remove();
      }
    }

    requestAnimationFrame(render);
    // fallback cleanup
    setTimeout(()=>{ if (canvas.parentNode) canvas.remove() }, 7000);
  }

  // Bind events
  startBtn.addEventListener('click', startCountdown);
  stopBtn.addEventListener('click', ()=>{
    stopCountdown();
    flashMessage('Stopped');
  });

  // keyboard: enter in any input starts
  [hourEl,minEl,secEl].forEach(el=>{
    el.addEventListener('keydown', e=>{
      if (e.key === 'Enter') startCountdown();
    })
  });

  // Global shortcuts: Space toggles start/stop, S stops, C triggers confetti
  window.addEventListener('keydown', e=>{
    const active = document.activeElement;
    // ignore when typing in text-like elements except inputs where Enter is handled
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')){
      // allow Space if not a checkbox (prevents page scroll when appropriate)
      if (e.code === 'Space'){
        e.preventDefault();
        if (timerId) { stopCountdown(); flashMessage('Stopped'); }
        else startCountdown();
      }
      return;
    }

    if (e.code === 'Space'){
      e.preventDefault();
      if (timerId) { stopCountdown(); flashMessage('Stopped'); }
      else startCountdown();
    } else if (e.key === 's' || e.key === 'S'){
      stopCountdown();
      flashMessage('Stopped');
    } else if (e.key === 'c' || e.key === 'C'){
      triggerConfetti();
    } else if (e.key === 'r' || e.key === 'R'){
      stopCountdown();
      hourEl.value = minEl.value = secEl.value = '';
      updateDisplay();
    }
  });
});
