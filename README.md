**Sporty Countdown — README**

Brief: A small, responsive countdown timer with sporty theme, smooth animations, keyboard shortcuts, and a lightweight built-in confetti effect.

**Files:**
- `index.html`: Main page (references external CSS and JS).
- `css/style.css`: All styles — responsive layout, animations, confetti canvas style.
- `js/script.js`: Countdown logic, keyboard shortcuts, confetti implementation.

**Quick Start:**
1. Link:<a href="https://basiccountertej.netlify.app/">Click Here</a>
2. Enter Hours / Minutes / Seconds (HH / MM / SS) and press the `Start` button (or press `Space`).
3. To stop the countdown press the `Stop` button or hit `S` or `Space` again.

**Keyboard Shortcuts:**
- `Space`: Toggle start/stop.
- `S`: Stop and show "Stopped".
- `C`: Trigger confetti manually.
- `R`: Reset inputs (clears HH:MM:SS).
- `Enter` (in any input): Start the countdown.

**Behavior & UX notes:**
- On finish the page triggers a short confetti burst and a finish animation.
- Inputs are clamped: hours 0–99, minutes and seconds 0–59.
- The timer uses CSS text gradient and JS-driven tick animations for a sporty look.



