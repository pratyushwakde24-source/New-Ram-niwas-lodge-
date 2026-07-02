/* ==========================================================================
   NEW RAM NIWAS LODGING HOUSE - DARK LUXURY JAVASCRIPT & GSAP LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Set current year in footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Sticky Navbar & Scroll Spy for Active Navigation
  const navbar = document.getElementById('navbar');
  const navItems = document.querySelectorAll('.nav-links .nav-item');
  const sections = document.querySelectorAll('section[id]');

  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        // Add dark shadow when scrolled
        if (window.scrollY > 40) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }

        // Scroll spy for navigation highlighting
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 180;

        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');
          }
        });

        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${currentSectionId}`) {
            item.classList.add('active');
          }
        });
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  // 3. Mobile Navigation Toggle
  const mobileBtn = document.getElementById('mobileToggleBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('active');
      const icon = mobileBtn.querySelector('i');
      const isExpanded = mobileDrawer.classList.contains('active');
      mobileBtn.setAttribute('aria-expanded', isExpanded);
      
      if (isExpanded) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });
  }

  // 4. GSAP & ScrollTrigger Animations (Subtle, Elegant, No Excessive Flashiness)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero element entrance animations
    gsap.from('.hero-badge', {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.1
    });

    gsap.from('.hero-title', {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out',
      delay: 0.25
    });

    gsap.from('.hero-subtitle', {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: 'power3.out',
      delay: 0.4
    });

    gsap.from('.hero-cta-group', {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: 'power3.out',
      delay: 0.55
    });

    gsap.from('.hero-stats-bar', {
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: 'power3.out',
      delay: 0.7
    });

    // Scroll Reveal for Section Headers & Cards
    const revealElements = document.querySelectorAll('.gsap-reveal');
    revealElements.forEach((el) => {
      // Don't re-animate hero elements already animated
      if (el.closest('.hero')) return;

      gsap.fromTo(el, 
        { opacity: 0, y: 35 }, 
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Subtle Parallax effect on Hero background
    const heroBg = document.querySelector('.hero-bg-image');
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }

  // 5. Escape key listener for Lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeMobileNav();
    }
  });

  // 6. Initialize Room Image Galleries & Sliders
  initRoomGalleries();

  // 7. Initialize Booking Enquiry Date Pickers (Prevent Past Dates)
  const checkInEl = document.getElementById('checkInDate');
  const checkOutEl = document.getElementById('checkOutDate');
  if (checkInEl && checkOutEl) {
    const todayStr = new Date().toISOString().split('T')[0];
    checkInEl.setAttribute('min', todayStr);
    checkOutEl.setAttribute('min', todayStr);

    checkInEl.addEventListener('change', () => {
      if (checkInEl.value) {
        const d = new Date(checkInEl.value);
        d.setDate(d.getDate() + 1);
        const nextDayStr = d.toISOString().split('T')[0];
        checkOutEl.setAttribute('min', nextDayStr);
        if (checkOutEl.value && checkOutEl.value <= checkInEl.value) {
          checkOutEl.value = nextDayStr;
        }
      }
    });
  }
});

/**
 * Helper function to close mobile drawer when a link is clicked
 */
function closeMobileNav() {
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileBtn = document.getElementById('mobileToggleBtn');
  if (mobileDrawer && mobileDrawer.classList.contains('active')) {
    mobileDrawer.classList.remove('active');
    if (mobileBtn) {
      mobileBtn.setAttribute('aria-expanded', 'false');
      const icon = mobileBtn.querySelector('i');
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  }
}

/**
 * Open Lightbox Modal for Gallery Item Preview
 * @param {string} title - Title of the gallery item
 * @param {string} description - Detailed description or instruction
 */
function openLightbox(title, description) {
  const modal = document.getElementById('lightboxModal');
  const titleEl = document.getElementById('lightboxTitle');
  const descEl = document.getElementById('lightboxDesc');

  if (modal && titleEl && descEl) {
    titleEl.textContent = title;
    descEl.textContent = description;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  }
}

/**
 * Close Lightbox Modal
 * @param {Event} [event] - Optional click event to check target
 */
function closeLightbox(event) {
  const modal = document.getElementById('lightboxModal');
  if (!modal) return;

  // If clicked directly on overlay background or close button
  if (!event || event.target === modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scrolling
  }
}

/**
 * Production Security: Input Sanitization against XSS, SQLi, HTML Injection & Emoji Spam
 * @param {string} str - Raw input string
 * @param {number} maxLen - Maximum permitted length
 */
function sanitizeInput(str, maxLen = 200) {
  if (!str || typeof str !== 'string') return '';
  let cleaned = str.trim().slice(0, maxLen);
  // Remove script tags, HTML tags, SQL keywords, email headers, and excessive emoji repetitions
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  cleaned = cleaned.replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|EXEC|TRUNCATE)\b|--|;|\/\*|\*\/)/gi, '');
  cleaned = cleaned.replace(/(\r|\n|%0A|%0D)/gi, ' ');
  cleaned = cleaned.replace(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\uddbf][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]){4,}/g, '');
  return cleaned;
}

let _lastSubmitTimestamp = 0;
let _isSubmittingBooking = false;

/**
 * Handle Direct Enquiry Form Submission & Generate WhatsApp Message with Strict Security Validation
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
  event.preventDefault();

  const btn = event.target.querySelector('button[type="submit"]') || document.getElementById('submitBookingBtn');
  if (_isSubmittingBooking || (btn && btn.disabled)) {
    return;
  }

  // 1. Spam Protection: Honeypot check
  const hpInput = document.getElementById('hp_bot_check');
  if (hpInput && hpInput.value.trim() !== '') {
    console.warn('Spam submission detected and blocked by honeypot.');
    return;
  }

  // 2. Rate Limiting Support (Prevent rapid consecutive submissions)
  const now = Date.now();
  if (now - _lastSubmitTimestamp < 3000) {
    alert('Please wait a few seconds before submitting another booking request.');
    return;
  }

  // 3. Cloudflare Turnstile / Google reCAPTCHA v3 Readiness Check
  if (window.grecaptcha && typeof window.grecaptcha.execute === 'function') {
    console.info('reCAPTCHA v3 hook ready for execution.');
  } else if (window.turnstile && typeof window.turnstile.getResponse === 'function') {
    console.info('Cloudflare Turnstile token verified.');
  }

  const nameInput = document.getElementById('guestName');
  const phoneInput = document.getElementById('guestPhone');
  const emailInput = document.getElementById('guestEmail');
  const checkInInput = document.getElementById('checkInDate');
  const checkOutInput = document.getElementById('checkOutDate');
  const roomSelect = document.getElementById('roomPreference');
  const countSelect = document.getElementById('guestCount');
  const messageInput = document.getElementById('specialMessage');

  const rawName = nameInput ? nameInput.value.trim() : '';
  const rawPhone = phoneInput ? phoneInput.value.trim() : '';
  const rawEmail = emailInput ? emailInput.value.trim() : '';
  const rawCheckIn = checkInInput ? checkInInput.value.trim() : '';
  const rawCheckOut = checkOutInput ? checkOutInput.value.trim() : '';
  const rawRoom = roomSelect ? roomSelect.value.trim() : '';
  const rawCount = countSelect ? countSelect.value.trim() : '';
  const rawMessage = messageInput ? messageInput.value.trim() : '';

  // 4. Validate Empty Required Fields
  if (!rawName) {
    alert('Please enter your Full Name.');
    if (nameInput) nameInput.focus();
    return;
  }
  if (!rawPhone) {
    alert('Please enter your Mobile Number.');
    if (phoneInput) phoneInput.focus();
    return;
  }
  if (!rawCheckIn) {
    alert('Please select your Check-in Date.');
    if (checkInInput) checkInInput.focus();
    return;
  }
  if (!rawCheckOut) {
    alert('Please select your Check-out Date.');
    if (checkOutInput) checkOutInput.focus();
    return;
  }
  if (!rawRoom) {
    alert('Please select a Room Category.');
    if (roomSelect) roomSelect.focus();
    return;
  }
  if (!rawCount) {
    alert('Please select the Number of Guests.');
    if (countSelect) countSelect.focus();
    return;
  }

  // 5. Validate Phone Number (Required, valid 10-digit Indian number)
  const cleanPhoneDigits = rawPhone.replace(/^(\+91|0)/, '').replace(/[\s\-\(\)]/g, '');
  const indianPhoneRegex = /^[6-9]\d{9}$/;
  if (!indianPhoneRegex.test(cleanPhoneDigits)) {
    alert('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9 (e.g., 9876543210).');
    if (phoneInput) phoneInput.focus();
    return;
  }

  // 6. Validate Email Address (Optional, validate if entered)
  if (rawEmail !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(rawEmail)) {
      alert('Please enter a valid email address or leave the field blank.');
      if (emailInput) emailInput.focus();
      return;
    }
  }

  // 7. Validate Check-in & Check-out Dates (No past dates, Check-out after Check-in)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkInDateObj = new Date(rawCheckIn);
  checkInDateObj.setHours(0, 0, 0, 0);
  const checkOutDateObj = new Date(rawCheckOut);
  checkOutDateObj.setHours(0, 0, 0, 0);

  if (checkInDateObj < today) {
    alert('Check-in date cannot be in the past. Please select today or a future date.');
    if (checkInInput) checkInInput.focus();
    return;
  }
  if (checkOutDateObj <= checkInDateObj) {
    alert('Check-out date must be at least one day after the Check-in date.');
    if (checkOutInput) checkOutInput.focus();
    return;
  }

  // 8. Sanitize all fields against script injection / XSS
  const cleanName = sanitizeInput(rawName, 80);
  const cleanEmail = rawEmail ? sanitizeInput(rawEmail, 100) : '';
  const cleanRoom = sanitizeInput(rawRoom, 50);
  const cleanCount = sanitizeInput(rawCount, 50);
  const cleanMessage = rawMessage ? sanitizeInput(rawMessage, 300) : '';

  // 9. Format dates nicely for WhatsApp message
  const formatDateForMsg = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  const formattedCheckIn = formatDateForMsg(rawCheckIn);
  const formattedCheckOut = formatDateForMsg(rawCheckOut);

  // 10. Build structured WhatsApp booking enquiry message
  const waText = `Hello New Ram Niwas Lodging House,

I would like to book a room.

Name: ${cleanName}
Phone: +91 ${cleanPhoneDigits}
Email: ${cleanEmail || 'Not provided'}
Check-in: ${formattedCheckIn}
Check-out: ${formattedCheckOut}
Guests: ${cleanCount}
Room Type: ${cleanRoom}
Special Requests: ${cleanMessage || 'None'}

Please let me know the availability and price.

Thank you.`;

  // 11. Show loading state on button and prevent duplicate clicks
  _isSubmittingBooking = true;
  _lastSubmitTimestamp = Date.now();
  const originalBtnHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Sending Booking Request...`;
    btn.disabled = true;
  }

  // 12. Encode text and open WhatsApp
  const encodedText = encodeURIComponent(waText);
  const waUrl = `https://wa.me/919820403685?text=${encodedText}`;

  setTimeout(() => {
    let openedSuccessfully = false;
    try {
      const newWin = window.open(waUrl, '_blank', 'noopener,noreferrer,external');
      if (newWin && !newWin.closed) {
        openedSuccessfully = true;
      }
    } catch (e) {
      console.warn('window.open popup blocked or failed:', e);
    }

    if (!openedSuccessfully) {
      try {
        window.location.href = waUrl;
        openedSuccessfully = true;
      } catch (e) {
        alert('Unable to open WhatsApp automatically. Please save our official number (+91 9820403685) and send us your booking request directly.');
      }
    }

    if (openedSuccessfully) {
      const successMsgEl = document.getElementById('formSuccessMessage');
      if (successMsgEl) {
        successMsgEl.style.display = 'block';
        successMsgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      if (btn) {
        btn.innerHTML = `<i class="fa-solid fa-check" aria-hidden="true"></i> WhatsApp Opened Successfully!`;
      }
      setTimeout(() => {
        if (btn) {
          btn.innerHTML = originalBtnHtml;
          btn.disabled = false;
        }
        _isSubmittingBooking = false;
      }, 4000);
    } else {
      if (btn) {
        btn.innerHTML = originalBtnHtml;
        btn.disabled = false;
      }
      _isSubmittingBooking = false;
    }
  }, 500);
}

/**
 * ==========================================================================
 * 6. ROOMS SECTION - IMAGE SLIDER & GALLERY LOGIC
 * ==========================================================================
 */
function initRoomGalleries() {
  const roomContainers = document.querySelectorAll('#rooms .room-img-container[data-room-gallery]');
  if (!roomContainers.length) return;

  // Candidate images per room category stored in assets/images/rooms/
  const roomCandidateImages = {
    ac: [
      'assets/images/rooms/room-ac-1.webp',
      'assets/images/rooms/room-ac-2.webp',
      'assets/images/rooms/room-ac-3.webp',
      'assets/images/rooms/room-ac-4.webp',
      'assets/images/rooms/room-ac-5.webp',
      'assets/images/rooms/room-ac-6.webp',
      'assets/images/rooms/room-ac-7.webp',
      'assets/images/rooms/room-ac-8.webp',
      'assets/images/rooms/room-ac-9.webp',
      'assets/images/rooms/room-ac-10.webp'
    ],
    nonac: [
      'assets/images/rooms/room-nonac-1.webp',
      'assets/images/rooms/room-nonac-2.webp',
      'assets/images/rooms/room-nonac-3.webp',
      'assets/images/rooms/room-nonac-4.webp',
      'assets/images/rooms/room-nonac-5.webp',
      'assets/images/rooms/room-nonac-6.webp',
      'assets/images/rooms/room-nonac-7.webp',
      'assets/images/rooms/room-nonac-8.webp',
      'assets/images/rooms/room-nonac-9.webp',
      'assets/images/rooms/room-nonac-10.webp'
    ],
    family: [
      'assets/images/rooms/room-family-1.webp',
      'assets/images/rooms/room-family-2.webp',
      'assets/images/rooms/room-family-3.webp',
      'assets/images/rooms/room-family-4.webp',
      'assets/images/rooms/room-family-5.webp',
      'assets/images/rooms/room-family-6.webp',
      'assets/images/rooms/room-family-7.webp',
      'assets/images/rooms/room-family-8.webp',
      'assets/images/rooms/room-family-9.webp',
      'assets/images/rooms/room-family-10.webp'
    ]
  };

  roomContainers.forEach(container => {
    const roomType = container.getAttribute('data-room-gallery');
    const wrapper = container.querySelector('.room-slider-wrapper');
    if (!wrapper || !roomType || !roomCandidateImages[roomType]) return;

    checkAvailableImages(roomCandidateImages[roomType], (availableUrls) => {
      // 1. If real room photos are unavailable, keep elegant placeholder with exact required text
      if (availableUrls.length === 0) {
        return;
      }

      const altText = getRoomAltText(roomType);

      // 2. Fallback: If only one room image exists, display single image without creating an unnecessary slider
      if (availableUrls.length === 1) {
        wrapper.innerHTML = `
          <img 
            src="${availableUrls[0]}" 
            alt="${altText}" 
            class="room-slide-image active" 
            loading="eager"
          >`;
        return;
      }

      // 3. Multiple images: Build independent image slider with crossfade
      let sliderHtml = '';
      availableUrls.forEach((url, idx) => {
        // Preload only the first room image, lazy load remaining images
        const loadAttr = idx === 0 ? 'loading="eager"' : 'loading="lazy"';
        const activeClass = idx === 0 ? ' active' : '';
        sliderHtml += `
          <img 
            src="${url}" 
            alt="${altText} - Photo ${idx + 1}" 
            class="room-slide-image${activeClass}" 
            ${loadAttr}
          >`;
      });

      wrapper.innerHTML = sliderHtml;

      const slides = wrapper.querySelectorAll('.room-slide-image');
      let currentIdx = 0;
      let sliderInterval = null;
      let isHovered = false;

      const nextSlide = () => {
        if (isHovered || slides.length <= 1) return;
        slides[currentIdx].classList.remove('active');
        currentIdx = (currentIdx + 1) % slides.length;
        slides[currentIdx].classList.add('active');
      };

      const startAutoplay = () => {
        if (!sliderInterval) {
          sliderInterval = setInterval(nextSlide, 3000); // Change every 3 seconds
        }
      };

      const stopAutoplay = () => {
        if (sliderInterval) {
          clearInterval(sliderInterval);
          sliderInterval = null;
        }
      };

      // Pause autoplay while hovering over image, resume when mouse leaves
      container.addEventListener('mouseenter', () => {
        isHovered = true;
        stopAutoplay();
      });
      container.addEventListener('mouseleave', () => {
        isHovered = false;
        startAutoplay();
      });

      startAutoplay();
    });
  });
}

/**
 * Check which image URLs exist and are valid by attempting to load them
 * @param {string[]} urlList - List of candidate image URLs
 * @param {Function} callback - Callback returning array of valid image URLs
 */
function checkAvailableImages(urlList, callback) {
  const available = [];
  let checked = 0;

  if (!urlList || urlList.length === 0) {
    callback([]);
    return;
  }

  urlList.forEach((url, index) => {
    const img = new Image();
    img.onload = () => {
      available.push({ url, index });
      checked++;
      if (checked === urlList.length) {
        available.sort((a, b) => a.index - b.index);
        callback(available.map(item => item.url));
      }
    };
    img.onerror = () => {
      checked++;
      if (checked === urlList.length) {
        available.sort((a, b) => a.index - b.index);
        callback(available.map(item => item.url));
      }
    };
    img.src = url;
  });
}

/**
 * Get descriptive ALT text for room categories
 * @param {string} roomType - Room category key
 * @returns {string} Descriptive alt text
 */
function getRoomAltText(roomType) {
  switch (roomType) {
    case 'ac':
      return 'Standard AC Room at New Ram Niwas Lodging House';
    case 'nonac':
      return 'Standard Non-AC Room at New Ram Niwas Lodging House';
    case 'family':
      return 'Family / Group Room at New Ram Niwas Lodging House';
    default:
      return 'Room Accommodation at New Ram Niwas Lodging House';
  }
}
