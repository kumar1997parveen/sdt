(function () {
  'use strict';

  // Mobile nav toggle
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking a nav link (for in-page anchors)
    mainNav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scroll for anchor links (optional enhancement; CSS scroll-behavior also handles this)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Hero slider
  var heroSlider = document.getElementById('heroSlider');
  if (heroSlider) {
    var slides = heroSlider.querySelectorAll('.hero-slide');
    var dots = heroSlider.querySelectorAll('.hero-slider__dot');
    var currentIndex = 0;
    var totalSlides = slides.length;
    var autoplayInterval;

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('hero-slide--active', i === currentIndex);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('hero-slider__dot--active', i === currentIndex);
        dot.setAttribute('aria-selected', i === currentIndex);
      });
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        stopAutoplay();
        goToSlide(i);
        startAutoplay();
      });
    });

    heroSlider.addEventListener('mouseenter', stopAutoplay);
    heroSlider.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  }

  // Industries slider – 6 slides, 6 dots, infinite circular loop (no jump back)
  var industriesSlider = document.getElementById('industriesSlider');
  if (industriesSlider) {
    var indTrack = document.getElementById('industriesSliderTrack');
    var indDots = industriesSlider.querySelectorAll('.industries-slider__dot');
    var indIndex = 0;
    var indTotal = 6;
    var indAutoplayInterval;
    var indAllPosClasses = ['industries-slider__track--pos-0', 'industries-slider__track--pos-1', 'industries-slider__track--pos-2', 'industries-slider__track--pos-3', 'industries-slider__track--pos-4', 'industries-slider__track--pos-5', 'industries-slider__track--pos-6'];

    function indSetPosition(pos, noTransition) {
      if (indTrack) {
        if (noTransition) indTrack.classList.add('is-jumping');
        indAllPosClasses.forEach(function (c) { indTrack.classList.remove(c); });
        indTrack.classList.add('industries-slider__track--pos-' + pos);
        if (noTransition) {
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              indTrack.classList.remove('is-jumping');
            });
          });
        }
      }
      var dotIndex = pos === 6 ? 0 : pos;
      indDots.forEach(function (dot, i) {
        dot.classList.toggle('industries-slider__dot--active', i === dotIndex);
        dot.setAttribute('aria-selected', i === dotIndex);
      });
    }

    function indGoToSlide(index) {
      if (index < 0) index = indTotal - 1;
      if (index >= indTotal) index = 0;
      indIndex = index;
      indSetPosition(indIndex, false);
    }

    function indNextSlide() {
      if (indIndex === indTotal - 1) {
        indIndex = 6;
        indSetPosition(6, false);
        indTrack.addEventListener('transitionend', function onEnd() {
          indTrack.removeEventListener('transitionend', onEnd);
          indIndex = 0;
          indSetPosition(0, true);
        }, { once: true });
      } else {
        indIndex += 1;
        indSetPosition(indIndex, false);
      }
    }

    function indPrevSlide() {
      if (indIndex === 0) {
        indSetPosition(6, true);
        indIndex = 6;
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            indIndex = indTotal - 1;
            indSetPosition(5, false);
          });
        });
      } else {
        indIndex -= 1;
        indSetPosition(indIndex, false);
      }
    }

    function indStartAutoplay() {
      indAutoplayInterval = setInterval(indNextSlide, 5000);
    }

    function indStopAutoplay() {
      clearInterval(indAutoplayInterval);
    }

    indDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        indStopAutoplay();
        indIndex = i;
        indSetPosition(i, false);
        indStartAutoplay();
      });
    });

    industriesSlider.addEventListener('mouseenter', indStopAutoplay);
    industriesSlider.addEventListener('mouseleave', indStartAutoplay);

    indSetPosition(0, true);
    indStartAutoplay();
  }

})();