/* ==========================================================================
   Luxury White, Gold & Black Arabic Wedding Invitation JavaScript
   Features:
   - Gold Particle Canvas Engine
   - HTML5 Audio Song Player + Web Audio Synthesizer Fallback
   - Precision Countdown Timer to August 6, 2026 9:00 PM
   - Splash Entrance Screen & Music Playback
   - Google Calendar & iCal (.ics) Event Generator
   - LocalStorage RSVP Form & Wishbook Board
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Target Date: August 6, 2026 at 9:00 PM (21:00)
    const TARGET_DATE = new Date(2026, 7, 6, 21, 0, 0); // Month 7 = August

    /* ==========================================================================
       1. Gold Particle Canvas Engine
       ========================================================================== */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor(isBurst = false) {
            this.reset(isBurst);
        }

        reset(isBurst = false) {
            this.x = Math.random() * width;
            this.y = isBurst ? height / 2 + (Math.random() * 200 - 100) : Math.random() * height;
            this.radius = Math.random() * 2.5 + 0.5;
            this.speedY = isBurst ? (Math.random() - 0.5) * 4 : -(Math.random() * 0.6 + 0.2);
            this.speedX = isBurst ? (Math.random() - 0.5) * 4 : (Math.random() - 0.5) * 0.4;
            this.alpha = Math.random() * 0.7 + 0.3;
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
            this.hue = 42 + Math.random() * 15; // Rich gold hue spectrum
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.alpha += Math.sin(Date.now() * this.pulseSpeed) * 0.01;

            if (this.y < -10 || this.x < -10 || this.x > width + 10) {
                this.reset();
                this.y = height + 10;
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 95%, 45%, ${Math.max(0.2, this.alpha)})`;
            ctx.shadowBlur = this.radius * 3;
            ctx.shadowColor = 'rgba(212, 175, 55, 0.7)';
            ctx.fill();
            ctx.restore();
        }
    }

    function initParticles(count = 70) {
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function triggerGoldBurst() {
        for (let i = 0; i < 60; i++) {
            particles.push(new Particle(true));
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles(80);
    animateParticles();


    /* ==========================================================================
       2. Wedding Song Player & Web Audio Synthesizer Fallback
       ========================================================================== */
    const weddingSong = document.getElementById('wedding-song');
    const audioToggleBtn = document.getElementById('audio-toggle');
    let isPlaying = false;
    let audioCtx = null;
    let synthTimer = null;

    function startSong() {
        isPlaying = true;
        audioToggleBtn.classList.remove('paused');
        
        // Attempt playing HTML5 Audio Song
        if (weddingSong) {
            weddingSong.play().then(() => {
                console.log("Audio song playing successfully!");
            }).catch(err => {
                console.log("HTML5 audio playback blocked or offline, using synth sound fallback:", err);
                startSynthFallback();
            });
        } else {
            startSynthFallback();
        }
    }

    function stopSong() {
        isPlaying = false;
        audioToggleBtn.classList.add('paused');
        if (weddingSong) {
            weddingSong.pause();
        }
        if (synthTimer) clearTimeout(synthTimer);
    }

    // Web Audio Chimes Fallback
    function startSynthFallback() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        playSynthChord(0);
    }

    const CHORDS = [
        [220.00, 277.18, 329.63, 440.00],
        [196.00, 246.94, 293.66, 392.00],
        [174.61, 220.00, 261.63, 349.23],
        [164.81, 207.65, 246.94, 329.63]
    ];

    function playSynthChord(index) {
        if (!isPlaying || !audioCtx) return;
        const chord = CHORDS[index % CHORDS.length];
        const now = audioCtx.currentTime;

        chord.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = i % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.12);
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.05, now + 1 + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 4);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + i * 0.12);
            osc.stop(now + 4.5);
        });

        synthTimer = setTimeout(() => {
            if (isPlaying) playSynthChord(index + 1);
        }, 4000);
    }

    audioToggleBtn.addEventListener('click', () => {
        if (isPlaying) {
            stopSong();
        } else {
            startSong();
        }
    });


    /* ==========================================================================
       3. Splash Screen Entrance Action
       ========================================================================== */
    const enterBtn = document.getElementById('enter-btn');
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');

    enterBtn.addEventListener('click', () => {
        triggerGoldBurst();
        startSong();

        // Fade splash screen out
        splashScreen.classList.add('fade-out');

        setTimeout(() => {
            splashScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 800);
    });


    /* ==========================================================================
       4. Countdown Timer Logic (Target: August 6, 2026 9:00 PM)
       ========================================================================== */
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = TARGET_DATE.getTime() - now;

        if (distance < 0) {
            daysEl.innerText = '00';
            hoursEl.innerText = '00';
            minutesEl.innerText = '00';
            secondsEl.innerText = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.innerText = days < 10 ? '0' + days : days;
        hoursEl.innerText = hours < 10 ? '0' + hours : hours;
        minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
        secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();


    /* ==========================================================================
       5. Calendar Add Event Modal & Links Generator (Year 2026)
       ========================================================================== */
    const addCalendarBtn = document.getElementById('add-calendar-btn');
    const calendarModal = document.getElementById('calendar-modal');
    const closeCalendarModal = document.getElementById('close-calendar-modal');
    const googleCalLink = document.getElementById('google-cal-link');
    const icsCalDownload = document.getElementById('ics-cal-download');

    // Google Calendar URL for August 6, 2026
    const eventTitle = encodeURIComponent('حفل زفاف أحمد & حبيبة');
    const eventDetails = encodeURIComponent('نتشرف بدعوتكم لحضور حفل زفاف أحمد & حبيبة في قاعة الجاردن - فندق ريتاك.');
    const eventLocation = encodeURIComponent('قاعة الجاردن – فندق ريتاك (سويس إن سابقًا)');
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=20260806T180000Z/20260806T220000Z&details=${eventDetails}&location=${eventLocation}`;
    googleCalLink.href = googleUrl;

    addCalendarBtn.addEventListener('click', () => {
        calendarModal.classList.remove('hidden');
    });

    closeCalendarModal.addEventListener('click', () => {
        calendarModal.classList.add('hidden');
    });

    calendarModal.addEventListener('click', (e) => {
        if (e.target === calendarModal) {
            calendarModal.classList.add('hidden');
        }
    });

    // iCal File Download
    icsCalDownload.addEventListener('click', () => {
        const icsData = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Ahmed & Habiba Wedding//Ar//EN',
            'BEGIN:VEVENT',
            'SUMMARY:حفل زفاف أحمد & حبيبة',
            'DESCRIPTION:نتشرف بدعوتكم لحضور حفل زفاف أحمد & حبيبة في قاعة الجاردن - فندق ريتاك.',
            'LOCATION:قاعة الجاردن – فندق ريتاك (سويس إن سابقًا)',
            'DTSTART:20260806T210000',
            'DTEND:20260807T010000',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'Ahmed_and_Habiba_Wedding_2026.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });



    /* ==========================================================================
       7. Wishes & Blessing Board (دفتر التهاني)
       ========================================================================== */
    const wishForm = document.getElementById('wish-form');
    const wishesContainer = document.getElementById('wishes-container');

    const defaultWishes = [
        {
            author: 'العائلة والمحبين',
            message: 'ألف مبروك لأجمل عروسين أحمد وحبيبة! بارك الله لكما وبارك عليكما وجمع بينكما في خير.',
            date: 'اليوم'
        },
        {
            author: 'أصدقاء العمر',
            message: 'من القلب نتمنى لكما حياة زوجية مفعمة بالسعادة والمحبة والرفاه والبنين 💍✨',
            date: 'اليوم'
        }
    ];

    function loadWishes() {
        const storedWishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
        const allWishes = [...defaultWishes, ...storedWishes];

        wishesContainer.innerHTML = '';
        allWishes.reverse().forEach(w => {
            const wishCard = document.createElement('div');
            wishCard.className = 'wish-card';
            wishCard.innerHTML = `
                <div class="wish-header">
                    <span class="wish-author"><i class="fa-solid fa-crown gold-crown"></i> ${w.author}</span>
                    <span class="wish-date">${w.date}</span>
                </div>
                <p class="wish-text">${w.message}</p>
            `;
            wishesContainer.appendChild(wishCard);
        });
    }

    wishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const author = document.getElementById('wish-author').value.trim();
        const message = document.getElementById('wish-message').value.trim();

        if (!author || !message) return;

        const newWish = {
            author,
            message,
            date: new Date().toLocaleDateString('ar-EG')
        };

        const storedWishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
        storedWishes.push(newWish);
        localStorage.setItem('wedding_wishes', JSON.stringify(storedWishes));

        triggerGoldBurst();
        wishForm.reset();
        loadWishes();
    });

    loadWishes();


    /* ==========================================================================
       8. Share & Copy Link Actions
       ========================================================================== */
    const whatsappShareBtn = document.getElementById('whatsapp-share');
    const copyLinkBtn = document.getElementById('copy-link');

    const shareText = encodeURIComponent('دعوة زفاف أحمد & حبيبة ✨\nبكل الحب والامتنان نتشرف بدعوتكم لحضور حفل زفافنا يوم الخميس 6 أغسطس 2026 في قاعة الجاردن - فندق ريتاك.');

    whatsappShareBtn.addEventListener('click', () => {
        const url = `https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank');
    });

    copyLinkBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            const originalText = copyLinkBtn.innerHTML;
            copyLinkBtn.innerHTML = '<i class="fa-solid fa-check"></i> تم نسخ الرابط!';
            setTimeout(() => {
                copyLinkBtn.innerHTML = originalText;
            }, 3000);
        });
    });


    /* ==========================================================================
       9. Scroll to Top Action
       ========================================================================== */
    const scrollTopBtn = document.getElementById('scroll-top');
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});
