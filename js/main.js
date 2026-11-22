/**
 * عملاق الرخام – Giant of Marble | Main JavaScript
 * تفاعل وحركات الموقع المتطورة والمطابقة للمتطلبات
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // إعدادات الموقع وتخصيص البيانات (Site Configuration)
  // --------------------------------------------------------------------------
  // TODO: استبدال أرقام الإحصائيات بأرقام العميل الحقيقية عند تأكيدها.
  // TODO: Replace with the client's real numbers when confirmed.
  // ==========================================================================
  const SITE_CONFIG = {
    // تفعيل عرض الأرقام والإحصائيات (عند تأكيدها من قبل العميل، اجعل القيمة true)
    ENABLE_NUMERICAL_STATS: false, // TODO: set to true when client confirms real numbers
    CLIENT_STATS: [
      { number: 15, prefix: "+", suffix: "", label: "سنة خبرة", sublabel: "في مجال الرخام الطبيعي والصناعي" },
      { number: 500, prefix: "+", suffix: "", label: "مشروع منفذ", sublabel: "في الطائف ومختلف المناطق" },
      { number: 100, prefix: "", suffix: "%", label: "ضمان على التركيب", sublabel: "التزام كامل بأعلى معايير الجودة" },
      { number: 0, prefix: "خدمة", suffix: "", label: "توصيل وتركيب", sublabel: "مباشر لجميع أحياء الطائف", isStatic: true }
    ],
    // تفعيل قسم آراء العملاء (عند توفر تقييمات موثقة من العميل، اجعل القيمة true)
    SHOW_TESTIMONIALS: false, // TODO: set to true when real client reviews are provided
    HERO_IMAGE: 'assets/products/prod-2.jpg',
    ABOUT_IMAGE: 'assets/products/prod-3.jpg'
  };

  // التحكم بظهور قسم آراء العملاء وفقاً لإعدادات التكوين
  const testimonialsSection = document.getElementById('testimonials');
  if (testimonialsSection) {
    testimonialsSection.style.display = SITE_CONFIG.SHOW_TESTIMONIALS ? '' : 'none';
  }

  // --------------------------------------------------------------------------
  // 1. تهيئة التمرير الناعم (Smooth Scroll via Lenis / Native)
  // --------------------------------------------------------------------------
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (e) {
      console.warn('Lenis could not be initialized:', e);
    }
  }

  // --------------------------------------------------------------------------
  // 2. الشاشة الترحيبية (Preloader)
  // --------------------------------------------------------------------------
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          preloader.style.display = 'none';
          triggerHeroAnimations();
        }, 800);
      } else {
        triggerHeroAnimations();
      }
    }, 600);
  });

  // في حال تأخر حدث التحميل، نقوم بإنهاء شاشة التحميل تلقائياً
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
        triggerHeroAnimations();
      }, 800);
    }
  }, 2500);

  // --------------------------------------------------------------------------
  // 3. شريط تقدم التمرير (Scroll Progress Bar)
  // --------------------------------------------------------------------------
  const scrollProgressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && scrollProgressBar) {
      const progress = (window.scrollY / totalHeight) * 100;
      scrollProgressBar.style.width = `${progress}%`;
    }
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 4. المؤشر المخصص الفاخر (Custom Cursor - Desktop)
  // --------------------------------------------------------------------------
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.custom-cursor-dot');

  if (cursor && cursorDot && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.opacity = '1';
      cursor.style.opacity = '1';
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    const followMouse = () => {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      requestAnimationFrame(followMouse);
    };
    requestAnimationFrame(followMouse);

    // تفاعل المؤشر مع العناصر القابلة للنقر
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .product-card, .gallery-item, .service-card, .filter-btn');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
  }

  // --------------------------------------------------------------------------
  // 5. شريط التنقل وتثبيته عند التمرير ومراقبة الأقسام (Navbar & ScrollSpy)
  // --------------------------------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // حالة شريط التنقل الزجاجي
    if (siteHeader) {
      if (scrollY > 60) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // زر العودة للأعلى
    if (backToTopBtn) {
      if (scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // ScrollSpy: تحديث الرابط النشط
    let currentSectionId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. القائمة الجانبية في الهاتف (Mobile Navigation Drawer)
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNavPanel = document.getElementById('mobileNavPanel');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileNav = () => {
    const isOpen = mobileNavPanel.classList.contains('open');
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  };

  const openMobileNav = () => {
    hamburgerBtn.classList.add('active');
    mobileNavPanel.classList.add('open');
    mobileNavOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileNav = () => {
    hamburgerBtn.classList.remove('active');
    mobileNavPanel.classList.remove('open');
    mobileNavOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMobileNav);
  }
  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileNav);
  }
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  // --------------------------------------------------------------------------
  // 7. حركات قسم الهيرو (Hero Animations)
  // --------------------------------------------------------------------------
  function triggerHeroAnimations() {
    const wordInners = document.querySelectorAll('.hero-title .word-inner');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroBadge = document.querySelector('.hero-badge');

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline();

      if (heroBadge) {
        tl.fromTo(heroBadge, 
          { opacity: 0, scale: 0.9, y: -15 }, 
          { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power2.out' }
        );
      }

      if (wordInners.length) {
        tl.to(wordInners, {
          y: '0%',
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out'
        }, '-=0.3');
      }

      if (heroSubtitle) {
        tl.to(heroSubtitle, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.4');
      }

      if (heroButtons) {
        tl.to(heroButtons, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.4');
      }
    } else {
      // بديل CSS قياسي في حال لم تتوافر مكتبة GSAP
      wordInners.forEach((w) => (w.style.transform = 'translateY(0%)'));
      if (heroSubtitle) {
        heroSubtitle.style.opacity = '1';
        heroSubtitle.style.transform = 'translateY(0)';
      }
      if (heroButtons) {
        heroButtons.style.opacity = '1';
        heroButtons.style.transform = 'translateY(0)';
      }
    }
  }

  // --------------------------------------------------------------------------
  // 8. تأثير البارالاكس وتأثيرات التمرير (GSAP ScrollTrigger & Parallax)
  // --------------------------------------------------------------------------
  const heroBgImage = document.querySelector('.hero-bg-image');
  const aboutImage = document.querySelector('.about-image-wrapper img');

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // بارالاكس خلفية الهيرو
    if (heroBgImage) {
      gsap.to(heroBgImage, {
        y: '20%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // كشف صورة من نحن عبر Clip-Path
    const aboutImageWrap = document.querySelector('.about-image-wrapper');
    if (aboutImageWrap) {
      gsap.fromTo(aboutImageWrap,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: aboutImageWrap,
            start: 'top 80%',
          }
        }
      );
    }

    // حركة بطاقات الخدمات المتتالية (Stagger)
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length) {
      gsap.from(serviceCards, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 80%',
        }
      });
    }

    // حركة بطاقات لماذا نحن المتتالية
    const whyCards = document.querySelectorAll('.why-card');
    if (whyCards.length) {
      gsap.from(whyCards, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.why-us-grid',
          start: 'top 80%',
        }
      });
    }

    // حركة عناصر معرض الأعمال
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length) {
      gsap.from(galleryItems, {
        scale: 0.95,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.gallery-grid',
          start: 'top 85%',
        }
      });
    }
  } else {
    // دعم الاحتياطي بـ IntersectionObserver
    const observerOptions = { threshold: 0.15 };
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.service-card, .why-card, .gallery-item, .about-feature-item').forEach((el) => {
      revealObserver.observe(el);
    });
  }

  // --------------------------------------------------------------------------
  // 9. إدارة شريط الإحصائيات والمزايا (Stats Strip & Optional Counters)
  // --------------------------------------------------------------------------
  const statsGrid = document.getElementById('statsGrid');
  const statsSection = document.querySelector('.stats-strip');

  if (SITE_CONFIG.ENABLE_NUMERICAL_STATS && statsGrid) {
    // في حال تفعيل الأرقام الحقيقية المعتمدة من العميل، نقوم بتوليد بطاقات الأرقام
    statsGrid.innerHTML = SITE_CONFIG.CLIENT_STATS.map(stat => {
      if (stat.isStatic) {
        return `
          <div class="stat-item">
            <div class="stat-number-wrap">
              <span class="stat-prefix">${stat.prefix}</span>
              <span class="stat-main-text">${stat.label}</span>
            </div>
            <div class="stat-label">${stat.sublabel}</div>
          </div>
        `;
      }
      return `
        <div class="stat-item">
          <div class="stat-number-wrap">
            ${stat.prefix ? `<span class="stat-prefix">${stat.prefix}</span>` : ''}
            <span class="stat-count" data-target="${stat.number}">0</span>
            ${stat.suffix ? `<span class="stat-suffix">${stat.suffix}</span>` : ''}
          </div>
          <div class="stat-label">${stat.label}</div>
        </div>
      `;
    }).join('');

    const statNumbers = statsGrid.querySelectorAll('.stat-count');
    let statsCounted = false;

    const countUpNumbers = () => {
      statNumbers.forEach((counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = Math.ceil(current);
          }
        }, stepTime);
      });
    };

    if (statsSection) {
      const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsCounted) {
            statsCounted = true;
            countUpNumbers();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      statsObserver.observe(statsSection);
    }
  }

  // --------------------------------------------------------------------------
  // 10. قسم المنتجات: الرندرة، التصفية، والسلايدر، والتفاصيل
  // --------------------------------------------------------------------------
  const productsTrack = document.getElementById('productsTrack');
  const productsTrackContainer = document.querySelector('.products-track-container');
  const filterTabsContainer = document.getElementById('filterTabsContainer');
  const sliderPrevBtn = document.getElementById('sliderPrevBtn');
  const sliderNextBtn = document.getElementById('sliderNextBtn');
  const sliderDotsContainer = document.getElementById('sliderDots');

  let activeCategory = 'all';
  let displayedProducts = [];

  // قاموس الفئات المعتمدة باللغة العربية
  const categoryDictionary = {
    sinks: 'مغاسل',
    tables: 'طاولات',
    stairs: 'درج',
    kitchens: 'أسطح مطابخ',
    cladding: 'كسوات جدارية',
    custom: 'قص وتفصيل مخصص',
    other: 'أخرى'
  };

  // توليد أزرار التصفية ديناميكياً بناءً على المنتجات المتوفرة فعلياً
  function renderFilterTabs() {
    if (!filterTabsContainer || !window.marbleProducts) return;

    // استخراج الفئات الموجودة فعلياً في المنتجات
    const activeCategories = [];
    window.marbleProducts.forEach(p => {
      if (p.category && !activeCategories.includes(p.category)) {
        activeCategories.push(p.category);
      }
    });

    let tabsHTML = `<button type="button" class="filter-btn active" data-filter="all">الكل (${window.marbleProducts.length})</button>`;

    activeCategories.forEach(cat => {
      const label = categoryDictionary[cat] || cat;
      const count = window.marbleProducts.filter(p => p.category === cat).length;
      tabsHTML += `<button type="button" class="filter-btn" data-filter="${cat}">${label} (${count})</button>`;
    });

    filterTabsContainer.innerHTML = tabsHTML;

    // ربط مستمعات النقر للتبويبات المنشأة
    const tabButtons = filterTabsContainer.querySelectorAll('.filter-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-filter');
        renderProducts(activeCategory);
      });
    });
  }

  // دالة توليد بطاقة المنتج
  function createProductCardHTML(product) {
    const whatsappQuoteText = encodeURIComponent(product.whatsappMessage || `السلام عليكم عملاق الرخام، أود الاستفسار وطلب تسعيرة لمنتج: ${product.name}`);
    const badgeText = product.marbleBadge || product.marbleType || 'رخام طبيعي فاخر';
    const focusStyle = product.focus ? `style="object-position: ${product.focus};"` : '';

    return `
      <div class="product-card" data-category="${product.category}" data-id="${product.id}">
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" ${focusStyle} />
          <span class="marble-badge">${badgeText}</span>
        </div>
        <div class="product-body">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-desc">${product.shortDesc}</p>
          <div class="product-actions">
            <a href="https://wa.me/966556339040?text=${whatsappQuoteText}" target="_blank" rel="noopener noreferrer" class="btn-product-quote">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/>
              </svg>
              اطلب تسعيرة
            </a>
            <button type="button" class="btn-product-details" data-open-modal="${product.id}">التفاصيل</button>
          </div>
        </div>
      </div>
    `;
  }

  // دالة عرض المنتجات حسب الفئة
  function renderProducts(category = 'all') {
    if (!productsTrack || !window.marbleProducts) return;

    displayedProducts = category === 'all' 
      ? window.marbleProducts 
      : window.marbleProducts.filter(p => p.category === category);

    // تأثير اختفاء سلس ثم ظهور
    productsTrack.style.opacity = '0';
    productsTrack.style.transform = 'scale(0.98)';

    setTimeout(() => {
      productsTrack.innerHTML = displayedProducts.map(p => createProductCardHTML(p)).join('');
      productsTrack.style.opacity = '1';
      productsTrack.style.transform = 'scale(1)';

      // إعادة ضبط التمرير للبداية
      if (productsTrackContainer) {
        productsTrackContainer.scrollLeft = 0;
      }

      setupModalButtons();
      renderSliderDots();
    }, 220);
  }

  // نقاط السلايدر (Pagination Dots)
  function renderSliderDots() {
    if (!sliderDotsContainer || !productsTrackContainer) return;
    sliderDotsContainer.innerHTML = '';
    const cards = productsTrack.querySelectorAll('.product-card');
    if (!cards.length) return;

    // حساب عدد الصفحات التقريبي
    const cardWidth = cards[0].offsetWidth + 28;
    const visibleCards = Math.max(1, Math.round(productsTrackContainer.offsetWidth / cardWidth));
    const totalPages = Math.max(1, cards.length - visibleCards + 1);

    if (totalPages <= 1) {
      return;
    }

    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('span');
      dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        // باللغة العربية (RTL): التمرير لليمين/اليسار
        const scrollAmount = i * cardWidth;
        // مراعاة سلوك RTL في المتصفحات
        const isRtlNegative = productsTrackContainer.scrollLeft < 0;
        productsTrackContainer.scrollTo({
          left: isRtlNegative ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
        updateActiveDot(i);
      });
      sliderDotsContainer.appendChild(dot);
    }
  }

  function updateActiveDot(activeIndex) {
    if (!sliderDotsContainer) return;
    const dots = sliderDotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  }

  // تحكم الأسهم في السلايدر مع مراعاة اتجاه الـ RTL
  if (sliderPrevBtn && productsTrackContainer) {
    sliderPrevBtn.addEventListener('click', () => {
      const scrollStep = productsTrackContainer.offsetWidth * 0.75;
      productsTrackContainer.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });
  }

  if (sliderNextBtn && productsTrackContainer) {
    sliderNextBtn.addEventListener('click', () => {
      const scrollStep = productsTrackContainer.offsetWidth * 0.75;
      productsTrackContainer.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });
  }

  // دعم السحب بالماوس (Mouse Drag / Swipe)
  let isDown = false;
  let startX;
  let scrollLeft;

  if (productsTrackContainer) {
    productsTrackContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      productsTrackContainer.classList.add('active-drag');
      startX = e.pageX - productsTrackContainer.offsetLeft;
      scrollLeft = productsTrackContainer.scrollLeft;
    });

    productsTrackContainer.addEventListener('mouseleave', () => {
      isDown = false;
      productsTrackContainer.classList.remove('active-drag');
    });

    productsTrackContainer.addEventListener('mouseup', () => {
      isDown = false;
      productsTrackContainer.classList.remove('active-drag');
    });

    productsTrackContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - productsTrackContainer.offsetLeft;
      const walk = (x - startX) * 1.5;
      productsTrackContainer.scrollLeft = scrollLeft - walk;
    });

    // تحديث النقطة النشطة عند التمرير
    productsTrackContainer.addEventListener('scroll', () => {
      const cards = productsTrack.querySelectorAll('.product-card');
      if (!cards.length) return;
      const cardWidth = cards[0].offsetWidth + 28;
      const currentScroll = Math.abs(productsTrackContainer.scrollLeft);
      const currentPage = Math.round(currentScroll / cardWidth);
      updateActiveDot(currentPage);
    }, { passive: true });
  }

  // تشغيل تلقائي بطيء (Slow Autoplay) يتوقف عند الإشارة
  let autoplayTimer = null;
  const startAutoplay = () => {
    autoplayTimer = setInterval(() => {
      if (!productsTrackContainer) return;
      const maxScroll = productsTrackContainer.scrollWidth - productsTrackContainer.clientWidth;
      const currentScroll = Math.abs(productsTrackContainer.scrollLeft);
      const step = productsTrackContainer.offsetWidth * 0.75;

      if (currentScroll + step >= maxScroll - 20) {
        productsTrackContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        productsTrackContainer.scrollBy({ left: -step, behavior: 'smooth' });
      }
    }, 5500);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) clearInterval(autoplayTimer);
  };

  if (productsTrackContainer) {
    startAutoplay();
    productsTrackContainer.addEventListener('mouseenter', stopAutoplay);
    productsTrackContainer.addEventListener('mouseleave', startAutoplay);
    productsTrackContainer.addEventListener('touchstart', stopAutoplay, { passive: true });
    productsTrackContainer.addEventListener('touchend', startAutoplay, { passive: true });
  }

  // تهيئة تبويبات التصفية والرندرة الأولية للمنتجات
  renderFilterTabs();
  renderProducts('all');

  // --------------------------------------------------------------------------
  // 11. نافذة تفاصيل المنتج (Product Details Modal)
  // --------------------------------------------------------------------------
  const productModal = document.getElementById('productModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalMainImg = document.getElementById('modalMainImg');
  const modalThumbnails = document.getElementById('modalThumbnails');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalSpecsTable = document.getElementById('modalSpecsTable');
  const modalWhatsappBtn = document.getElementById('modalWhatsappBtn');

  function setupModalButtons() {
    const detailButtons = document.querySelectorAll('[data-open-modal]');
    detailButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const prodId = parseInt(btn.getAttribute('data-open-modal'), 10);
        const product = window.marbleProducts.find(p => p.id === prodId);
        if (product) {
          openProductModal(product);
        }
      });
    });
  }

  function openProductModal(product) {
    if (!productModal) return;

    // تعبئة البيانات
    modalTitle.textContent = product.name;
    modalBadge.textContent = product.marbleBadge || product.marbleType || 'رخام طبيعي';
    modalDesc.textContent = product.fullDesc;
    modalMainImg.src = product.image;
    modalMainImg.alt = product.name;

    // الصور المصغرة
    modalThumbnails.innerHTML = '';
    const galleryImages = product.gallery && product.gallery.length ? product.gallery : [product.image];
    galleryImages.forEach((imgUrl, index) => {
      const thumb = document.createElement('div');
      thumb.className = `modal-thumb ${index === 0 ? 'active' : ''}`;
      thumb.innerHTML = `<img src="${imgUrl}" alt="${product.name} ${index + 1}" />`;
      thumb.addEventListener('click', () => {
        modalMainImg.src = imgUrl;
        modalThumbnails.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
      modalThumbnails.appendChild(thumb);
    });

    // جدول المواصفات (المقاسات والسماكة حسب الطلب)
    modalSpecsTable.innerHTML = `
      <div class="spec-row">
        <span class="spec-label">الخامة والنوع:</span>
        <span class="spec-value">${product.specs.material || product.marbleBadge}</span>
      </div>
      <div class="spec-row">
        <span class="spec-label">السماكة والمقاسات:</span>
        <span class="spec-value">${product.specs.thickness || product.specs.dimensions || 'السماكة والمقاسات حسب الطلب'}</span>
      </div>
      <div class="spec-row">
        <span class="spec-label">نوع التشطيب:</span>
        <span class="spec-value">${product.specs.finish || 'صقل ناعم مع معالجة عازلة'}</span>
      </div>
      <div class="spec-row">
        <span class="spec-label">الاستخدام المقترح:</span>
        <span class="spec-value">${product.specs.suggestedUse || 'المجالس، الصالات، والفلل الفاخرة'}</span>
      </div>
      <div class="spec-row">
        <span class="spec-label">التفصيل والتنفيذ:</span>
        <span class="spec-value">حسب المخططات الهندسية بدقة</span>
      </div>
    `;

    // زر الواتساب الخاص بالمنتج بالاسم الدقيق
    const whatsappText = encodeURIComponent(product.whatsappMessage || `السلام عليكم عملاق الرخام، أود الاستفسار وطلب تسعيرة لمنتج: ${product.name}`);
    modalWhatsappBtn.href = `https://wa.me/966556339040?text=${whatsappText}`;

    productModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    if (productModal) {
      productModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProductModal);
  }

  if (productModal) {
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) {
        closeProductModal();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 12. عارض صور المشاريع (Portfolio Lightbox)
  // --------------------------------------------------------------------------
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  let currentGalleryIndex = 0;
  const galleryList = Array.from(galleryItems).map((item) => {
    return {
      src: item.getAttribute('data-full-image') || item.querySelector('img').src,
      title: item.querySelector('.gallery-title')?.textContent || 'مشروع منفذ - عملاق الرخام',
      tag: item.querySelector('.gallery-tag')?.textContent || ''
    };
  });

  function openLightbox(index) {
    if (!lightboxModal || !galleryList[index]) return;
    currentGalleryIndex = index;
    const item = galleryList[index];
    lightboxImage.src = item.src;
    lightboxCaption.textContent = `${item.title} (${currentGalleryIndex + 1} / ${galleryList.length})`;
    lightboxModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function nextGalleryItem() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryList.length;
    openLightbox(currentGalleryIndex);
  }

  function prevGalleryItem() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryList.length) % galleryList.length;
    openLightbox(currentGalleryIndex);
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', nextGalleryItem);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', prevGalleryItem);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // مستمع لوحة المفاتيح لإغلاق النوافذ (Esc) والتنقل بالأسهم
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
      closeLightbox();
      closeMobileNav();
    }
    if (lightboxModal && lightboxModal.classList.contains('open')) {
      if (e.key === 'ArrowLeft') nextGalleryItem();
      if (e.key === 'ArrowRight') prevGalleryItem();
    }
  });

  // --------------------------------------------------------------------------
  // 13. معالجة نموذج طلب التصميم والتسعيرة عبر الواتساب
  // --------------------------------------------------------------------------
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('clientName');
      const phoneInput = document.getElementById('clientPhone');
      const serviceSelect = document.getElementById('serviceType');
      const notesInput = document.getElementById('projectNotes');

      let isValid = true;

      // تحقق الاسم
      if (!nameInput.value.trim()) {
        showFieldError(nameInput, 'فضلاً أدخل الاسم الكريم');
        isValid = false;
      } else {
        clearFieldError(nameInput);
      }

      // تحقق الجوال
      const phoneVal = phoneInput.value.trim();
      const phoneRegex = /^(05|5|\+?9665)[0-9]{8}$/;
      if (!phoneVal || !phoneRegex.test(phoneVal.replace(/\s+/g, ''))) {
        showFieldError(phoneInput, 'فضلاً أدخل رقم جوال سعودي صحيح (مثال: 0556339040)');
        isValid = false;
      } else {
        clearFieldError(phoneInput);
      }

      // تحقق نوع الخدمة
      if (!serviceSelect.value) {
        showFieldError(serviceSelect, 'فضلاً اختر نوع الخدمة أو المنتج');
        isValid = false;
      } else {
        clearFieldError(serviceSelect);
      }

      if (!isValid) return;

      // تنسيق الرسالة باللغة العربية للواتساب
      const name = nameInput.value.trim();
      const phone = phoneVal;
      const service = serviceSelect.options[serviceSelect.selectedIndex].text;
      const notes = notesInput.value.trim() || 'لا توجد ملاحظات إضافية';

      const whatsappMessage = 
`*طلب تسعيرة وتصميم جديد – عملاق الرخام*
--------------------------------
👤 *الاسم:* ${name}
📱 *رقم الجوال:* ${phone}
🏛️ *الخدمة المطلوبة:* ${service}
📐 *المقاسات والملاحظات:*
${notes}
--------------------------------
📍 *المرسل:* عبر الموقع الإلكتروني (عملاق الرخام – الطائف)`;

      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/966556339040?text=${encodedMessage}`;

      // فتح محادثة الواتساب
      window.open(whatsappUrl, '_blank');

      // إعادة تعيين النموذج مع رسالة تأكيد
      quoteForm.reset();
      alert('شكراً لتواصلك مع عملاق الرخام. سيتم فتح محادثة الواتساب مباشرة لإكمال إرسال التفاصيل.');
    });
  }

  function showFieldError(inputElement, message) {
    const group = inputElement.closest('.form-group');
    if (group) {
      group.classList.add('has-error');
      let errorMsg = group.querySelector('.form-error-msg');
      if (errorMsg) {
        errorMsg.textContent = message;
      }
    }
  }

  function clearFieldError(inputElement) {
    const group = inputElement.closest('.form-group');
    if (group) {
      group.classList.remove('has-error');
    }
  }

  // تنظيف الخطأ بمجرد الكتابة
  const formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
  formInputs.forEach((input) => {
    input.addEventListener('input', () => clearFieldError(input));
    input.addEventListener('change', () => clearFieldError(input));
  });

  // ربط روابط بطاقات الخدمات بنموذج التسعيرة مع التحديد التلقائي للخدمة
  const serviceLinks = document.querySelectorAll('.service-link[data-service-select]');
  const serviceTypeSelect = document.getElementById('serviceType');
  serviceLinks.forEach(link => {
    link.addEventListener('click', () => {
      const selectedService = link.getAttribute('data-service-select');
      if (serviceTypeSelect && selectedService) {
        serviceTypeSelect.value = selectedService;
        clearFieldError(serviceTypeSelect);
      }
    });
  });

});
