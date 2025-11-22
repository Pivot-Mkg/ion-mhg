window.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    const toggleNavState = () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    toggleNavState();
    window.addEventListener('scroll', toggleNavState);
  }

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

    // Video play functionality
    const videoContainer = document.getElementById('videoContainer');
    const video = document.getElementById('sustainabilityVideo');
    const videoPlayer = document.getElementById('videoPlayer');
    const sustainabilityImage = document.getElementById('sustainabilityImage');
    const playButton = videoContainer ? videoContainer.querySelector('.play-button') : null;
    let isVideoPlaying = false;

    if (videoContainer && video && videoPlayer && sustainabilityImage) {
      // Toggle play/pause on video click
      videoContainer.addEventListener('click', function(e) {
        // Don't toggle if clicking on the play button directly
        if (playButton && playButton.contains(e.target)) {
          return;
        }
        
        if (isVideoPlaying) {
          video.pause();
          videoPlayer.style.display = 'none';
          sustainabilityImage.style.display = 'block';
          if (playButton) playButton.style.display = 'block';
          isVideoPlaying = false;
        } else {
          videoPlayer.style.display = 'block';
          sustainabilityImage.style.display = 'none';
          if (playButton) playButton.style.display = 'none';
          
          // Play the video and handle any errors
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error('Error playing video:', error);
              videoPlayer.style.display = 'none';
              sustainabilityImage.style.display = 'block';
              if (playButton) playButton.style.display = 'block';
            }).then(() => {
              isVideoPlaying = true;
            });
          } else {
            isVideoPlaying = true;
          }
        }
      });

      // Handle video end
      video.addEventListener('ended', function() {
        videoPlayer.style.display = 'none';
        sustainabilityImage.style.display = 'block';
        if (playButton) playButton.style.display = 'block';
        isVideoPlaying = false;
        video.currentTime = 0; // Reset video to start
      });

      // Handle play button click
      if (playButton) {
        playButton.addEventListener('click', function(e) {
          e.stopPropagation(); // Prevent triggering the container click
          videoPlayer.style.display = 'block';
          sustainabilityImage.style.display = 'none';
          playButton.style.display = 'none';
          
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error('Error playing video:', error);
              videoPlayer.style.display = 'none';
              sustainabilityImage.style.display = 'block';
              playButton.style.display = 'block';
            }).then(() => {
              isVideoPlaying = true;
            });
          } else {
            isVideoPlaying = true;
          }
        });
      }
    }


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

  const industrySliderEl = document.querySelector('.industry-swiper');
  if (industrySliderEl) {
    new Swiper(industrySliderEl, {
      slidesPerView: 1,
      spaceBetween: 16,
      loop: true,
      pagination: {
        el: '.industry-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.industry-button-next',
        prevEl: '.industry-button-prev',
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
    const inlineNavContainers = caseSliderEl.querySelectorAll('[data-case-pagination]');
    const caseShell = caseSliderEl.closest('.case-slider-shell') || caseSliderEl.parentElement;

    const createInlineArrow = (direction) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `case-card-arrow case-card-${direction}`;
      button.setAttribute('aria-label', direction === 'prev' ? 'Previous case' : 'Next case');
      const icon = document.createElement('i');
      icon.className = `bi bi-arrow-${direction === 'prev' ? 'left' : 'right'}`;
      button.appendChild(icon);
      return button;
    };

    inlineNavContainers.forEach((container) => {
      container.innerHTML = '';
      container.appendChild(createInlineArrow('prev'));
      container.appendChild(createInlineArrow('next'));
    });

    const caseSwiper = new Swiper(caseSliderEl, {
      slidesPerView: 1,
      effect: 'coverflow',
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false,
      },
      speed: 600,
      loop: true,
      autoHeight: true,
      allowTouchMove: true,
      spaceBetween: 40,
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

    inlineNavContainers.forEach((container) => {
      const prevButton = container.querySelector('.case-card-prev');
      const nextButton = container.querySelector('.case-card-next');

      if (prevButton) {
        prevButton.addEventListener('click', () => caseSwiper.slidePrev());
      }

      if (nextButton) {
        nextButton.addEventListener('click', () => caseSwiper.slideNext());
      }
    });
  }
});
