window.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');

  const toggleNavState = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  toggleNavState();
  window.addEventListener('scroll', toggleNavState);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll('.reveal').forEach((block) => observer.observe(block));

  const productSliderEl = document.querySelector('.product-swiper');
  if (productSliderEl) {
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: true,
    });

    // Animate counting numbers
    const animateValue = (obj, start, end, duration) => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        obj.textContent = end >= 1000 ? value.toLocaleString() + '+' : value + '+';
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    // Observe stats for counting animation
    const stats = document.querySelectorAll('.stat');
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stat = entry.target;
          const target = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
          stat.textContent = '0';
          animateValue(stat, 0, target, 2000);
          statsObserver.unobserve(stat);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));

    new Swiper(productSliderEl, {
      slidesPerView: 1,
      spaceBetween: 16,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        576: {
          slidesPerView: 2,
          spaceBetween: 18,
        },
        992: {
          slidesPerView: 3.5,
          spaceBetween: 22,
        },
      },
    });
  }

  const caseSliderEl = document.querySelector('.case-slider');
  if (caseSliderEl) {
    const dotContainers = caseSliderEl.querySelectorAll('[data-case-pagination]');
    const slideCount = caseSliderEl.querySelectorAll('.swiper-slide').length;
    const caseShell = caseSliderEl.closest('.case-slider-shell') || caseSliderEl.parentElement;

    dotContainers.forEach((container) => {
      container.innerHTML = '';
      for (let i = 0; i < slideCount; i += 1) {
        const dot = document.createElement('span');
        dot.className = 'case-dot';
        container.appendChild(dot);
      }
    });

    const caseSwiper = new Swiper(caseSliderEl, {
      slidesPerView: 1,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      speed: 600,
      autoHeight: true,
      allowTouchMove: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
        waitForTransition: true,
        reverseDirection: false,
        stopOnLastSlide: false,
      },
      navigation: {
        nextEl: caseShell.querySelector('.case-next'),
        prevEl: caseShell.querySelector('.case-prev'),
      },
      on: {
        init: function() {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                this.autoplay.start();
              } else {
                this.autoplay.stop();
              }
            });
          }, {
            threshold: 0.2
          });
          observer.observe(this.el);
        }
      }
    });

    const updateCaseDots = (index) => {
      dotContainers.forEach((container) => {
        container.querySelectorAll('.case-dot').forEach((dot, dotIndex) => {
          dot.classList.toggle('is-active', dotIndex === index);
        });
      });
    };

    updateCaseDots(0);

    caseSwiper.on('slideChange', () => {
      updateCaseDots(caseSwiper.realIndex);
    });

    dotContainers.forEach((container) => {
      container.addEventListener('click', (event) => {
        const dot = event.target.closest('.case-dot');
        if (!dot) {
          return;
        }
        const dotIndex = Array.from(container.children).indexOf(dot);
        caseSwiper.slideTo(dotIndex);
      });
    });
  }
});
