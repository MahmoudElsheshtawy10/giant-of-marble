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
      { number: 100, prefix: "", suffix: "%", label: "ضمان على التركيب", sublabel: "التزام كامل بأعلى معايير الجودة" }
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
  // 1. تهيئة التمرير الناعم الفاخر (Smooth Scroll via Lenis & GSAP Integration)
  // --------------------------------------------------------------------------
  let lenis = null;

  // تسجيل إضافة ScrollTrigger مع GSAP مبكراً
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  if (typeof Lenis !== 'undefined') {
    try {
      lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
      });

      // مزامنة حركات ScrollTrigger مع Lenis
      if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
      }

      // توحيد حلقة التمرير عبر Ticker الخاص بـ GSAP لمنع تعدد حلقات RAF
      if (typeof gsap !== 'undefined') {
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    } catch (e) {
      console.warn('Lenis could not be initialized, falling back to native scroll:', e);
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
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { offset: 0 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5.1 روابط التمرير السلس للأقسام (Smooth Anchor Navigation with Lenis Offset)
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(targetElement, { offset: -80 });
          } else {
            const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: elementPosition - 80, behavior: 'smooth' });
          }
          if (history.pushState) {
            history.pushState(null, null, targetId);
          }
        }
      }
    });
  });

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

    // حركة قسم الخدمات (بطاقتان أفقيتان عريضتان بنظام Zigzag مع كشف بالـ clip-path وتتابع للشرائح)
    const serviceFeatureCards = document.querySelectorAll('.service-feature-card');
    serviceFeatureCards.forEach((card) => {
      const isReverse = card.classList.contains('service-card-reverse');
      const imageFrame = card.querySelector('.service-image-frame');
      const chips = card.querySelectorAll('.service-chip');
      const bottomLink = card.querySelector('.service-link');

      const cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 82%',
        }
      });

      // ظهور البطاقة بنعومة مع translateY
      cardTl.from(card, {
        y: 40,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
      });

      // كشف الصورة بمسح بالـ clip-path باتجاه المحتوى
      if (imageFrame) {
        // في الـ RTL:
        // بطاقة 01 (محتوى باليمين، صورة باليسار): المسح يتجه نحو اليمين (المحتوى)
        // بطاقة 02 (صورة باليمين، محتوى باليسار): المسح يتجه نحو اليسار (المحتوى)
        const initialClip = isReverse ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
        cardTl.fromTo(imageFrame,
          { clipPath: initialClip },
          { clipPath: 'inset(0 0 0 0)', duration: 0.85, ease: 'power2.inOut' },
          '-=0.45'
        );
      }

      // تتابع ظهور الشرائح (Chips) بفارق 0.06 ثانية
      if (chips.length) {
        cardTl.from(chips, {
          scale: 0.9,
          opacity: 0,
          y: 12,
          duration: 0.4,
          stagger: 0.06,
          ease: 'back.out(1.4)',
        }, '-=0.35');
      }

      // ظهور رابط طلب الاستشارة
      if (bottomLink) {
        cardTl.from(bottomLink, {
          opacity: 0,
          y: 10,
          duration: 0.4,
          ease: 'power2.out',
        }, '-=0.2');
      }
    });

    // حركة بطاقات لماذا نحن المتتالية (0.12s stagger)
    const whyCards = document.querySelectorAll('.why-card');
    if (whyCards.length) {
      gsap.from(whyCards, {
        y: 35,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.why-us-grid',
          start: 'top 82%',
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
  // 10. قسم المنتجات الحصرية (Category Blocks Architecture)
  // --------------------------------------------------------------------------
  const categoryBlocksContainer = document.getElementById('categoryBlocksContainer');

  // قاموس وبيانات وصف الفئات الرئيسية
  const categoryMetadata = {
    sinks: {
      order: 1,
      name: 'المغاسل والأحواض الرخامية',
      desc: 'مغاسل فندقية عائمة ومستقلة منحوتة من الرخام والترافرتين الطبيعي، بتصاميم هندسية وحفر مائي متقن.',
      unit: 'تصاميم'
    },
    tables: {
      order: 2,
      name: 'طاولات وكاونترات حسب الطلب',
      desc: 'طاولات طعام وضيافة وكاونترات استقبال ومقاهي مخصصة، بالمقاسات والخامة وتفاصيل التضليع التي تناسب مساحتك.',
      unit: 'تصاميم'
    }
  };

  // دالة مساعدة لتوليد رسالة طلب تسعيرة المنتج بدون إيموجي
  function getProductWhatsappText(product) {
    if (product.whatsappMessage) {
      return encodeURIComponent(product.whatsappMessage);
    }
    const categoryName = product.categoryAr || (product.category === 'sinks' ? 'مغاسل' : 'طاولات');
    const lines = [
      "*طلب تسعيرة - عملاق الرخام*",
      `المنتج: ${product.name}`,
      `الفئة: ${categoryName}`,
      "أرجو التواصل معي بخصوص التسعير والتفاصيل."
    ];
    return encodeURIComponent(lines.join('\n'));
  }

  // دالة توليد بطاقة المنتج الفاخرة
  function createProductCardHTML(product) {
    const whatsappQuoteText = getProductWhatsappText(product);
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

  // دالة تهيئة سلايدر الفئة (للفئات التي تحتوي أكثر من 6 منتجات)
  function initCategorySlider(wrapper, catKey) {
    const container = wrapper.querySelector('.category-track-container');
    const track = wrapper.querySelector('.category-track');
    const prevBtn = wrapper.querySelector('.cat-prev-btn');
    const nextBtn = wrapper.querySelector('.cat-next-btn');
    const dotsContainer = wrapper.querySelector('.category-slider-dots');

    if (!container || !track) return;

    const getCardMetrics = () => {
      const card = track.querySelector('.product-card');
      const gap = 32; // 2rem
      return card ? card.offsetWidth + gap : 360;
    };

    const renderDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const cards = track.querySelectorAll('.product-card');
      if (!cards.length) return;
      const step = getCardMetrics();
      const visible = Math.max(1, Math.round(container.offsetWidth / step));
      const totalPages = Math.max(1, cards.length - visible + 1);

      if (totalPages <= 1) return;

      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('span');
        dot.className = `category-slider-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => {
          const scrollAmount = i * step;
          const isRtlNegative = container.scrollLeft < 0;
          container.scrollTo({
            left: isRtlNegative ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
          });
          updateActiveDot(i);
        });
        dotsContainer.appendChild(dot);
      }
    };

    const updateActiveDot = (activeIndex) => {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.category-slider-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIndex);
      });
    };

    // في RTL: السهم اليمين يرجع للخلف واليسار يتقدم
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const step = container.offsetWidth * 0.75;
        container.scrollBy({ left: step, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const step = container.offsetWidth * 0.75;
        container.scrollBy({ left: -step, behavior: 'smooth' });
      });
    }

    container.addEventListener('scroll', () => {
      const step = getCardMetrics();
      const currentScroll = Math.abs(container.scrollLeft);
      const currentPage = Math.round(currentScroll / step);
      updateActiveDot(currentPage);
    }, { passive: true });

    // تمرير عمودي انسيابي بدون اعتراض عجلة الماوس
    container.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        return;
      }
    }, { passive: true });

    // دعم السحب والإفلات بالماوس
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
      isDown = true;
      container.classList.add('active-drag');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
      container.classList.remove('active-drag');
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
      container.classList.remove('active-drag');
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    });

    renderDots();
    window.addEventListener('resize', () => {
      setTimeout(renderDots, 250);
    });
  }

  // دالة بناء وعرض كتل الفئات الرئيسية
  function renderCategoryBlocks() {
    if (!categoryBlocksContainer || !window.marbleProducts) return;

    // استخراج الفئات المتوفرة فعلياً في المنتجات
    const activeCats = [];
    window.marbleProducts.forEach(p => {
      if (p.category && !activeCats.includes(p.category)) {
        activeCats.push(p.category);
      }
    });

    // ترتيب الفئات: المغاسل أولاً ثم الطاولات
    activeCats.sort((a, b) => {
      const orderA = categoryMetadata[a] ? categoryMetadata[a].order : 99;
      const orderB = categoryMetadata[b] ? categoryMetadata[b].order : 99;
      return orderA - orderB;
    });

    let html = '';

    activeCats.forEach(catKey => {
      const prods = window.marbleProducts.filter(p => p.category === catKey);
      if (!prods.length) return;

      const meta = categoryMetadata[catKey] || {
        name: catKey === 'sinks' ? 'المغاسل والأحواض الرخامية' : (catKey === 'tables' ? 'طاولات وكاونترات حسب الطلب' : catKey),
        desc: 'تصاميم حصرية تنفذ بالمقاسات والخامات والمواصفات حسب رغبة العميل.',
        unit: 'تصاميم'
      };

      const countText = `${prods.length} ${meta.unit || 'تصاميم'}`;
      const isSlider = prods.length > 6;
      const cardsHTML = prods.map(p => createProductCardHTML(p)).join('');

      html += `
        <div class="category-block" data-category="${catKey}">
          <div class="category-header">
            <div class="category-title-wrap">
              <h3 class="category-title">${meta.name}</h3>
              <span class="category-count-chip">${countText}</span>
            </div>
            <div class="category-line"></div>
            <p class="category-desc">${meta.desc}</p>
          </div>

          ${isSlider ? `
            <div class="category-slider-wrapper" id="sliderWrapper_${catKey}">
              <div class="category-track-container" id="sliderContainer_${catKey}">
                <div class="category-track">
                  ${cardsHTML}
                </div>
              </div>
              <div class="category-slider-controls">
                <div class="category-slider-arrows">
                  <button type="button" class="category-slider-arrow-btn cat-prev-btn" aria-label="السابق (يمين)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                  <button type="button" class="category-slider-arrow-btn cat-next-btn" aria-label="التالي (يسار)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                </div>
                <div class="category-slider-dots" id="dots_${catKey}"></div>
              </div>
            </div>
          ` : `
            <div class="category-products-grid">
              ${cardsHTML}
            </div>
          `}
        </div>
      `;
    });

    categoryBlocksContainer.innerHTML = html;

    // تفعيل السلايدرات للفئات ذات السلايدر
    activeCats.forEach(catKey => {
      const prods = window.marbleProducts.filter(p => p.category === catKey);
      if (prods.length > 6) {
        const wrapper = document.getElementById(`sliderWrapper_${catKey}`);
        if (wrapper) {
          initCategorySlider(wrapper, catKey);
        }
      }
    });

    // ربط بطاقات المنتجات بالنافذة المنبثقة
    setupProductCardInteractions();
  }

  // تفعيل النقر على البطاقة والتفاصيل لفتح النافذة
  function setupProductCardInteractions() {
    if (!categoryBlocksContainer) return;
    const cards = categoryBlocksContainer.querySelectorAll('.product-card');
    cards.forEach(card => {
      const prodId = parseInt(card.getAttribute('data-id'), 10);
      const product = window.marbleProducts.find(p => p.id === prodId);
      if (!product) return;

      // فتح النافذة عند النقر على البطاقة أو زر التفاصيل (مع استثناء زر الواتساب)
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-product-quote')) {
          return; // السماح بفتح رابط الواتساب مباشرة
        }
        openProductModal(product);
      });
    });
  }

  // استدعاء رندرة كتل الفئات الرئيسية
  renderCategoryBlocks();

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
    const whatsappText = getProductWhatsappText(product);
    modalWhatsappBtn.href = `https://wa.me/966556339040?text=${whatsappText}`;

    productModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    if (productModal) {
      productModal.classList.remove('open');
      document.body.style.overflow = '';
      if (modalMainImg) {
        modalMainImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E";
      }
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
      if (lightboxImage) {
        lightboxImage.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E";
      }
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
  // 13. القائمة المنسدلة المخصصة لخدمات الرخام (Custom Dropdown)
  // --------------------------------------------------------------------------
  const customSelectWrapper = document.getElementById('customSelectWrapper');
  const customSelectTrigger = document.getElementById('customSelectTrigger');
  const customSelectLabel = document.getElementById('customSelectLabel');
  const customSelectOptions = document.getElementById('customSelectOptions');
  const serviceTypeSelect = document.getElementById('serviceType');
  const customOptions = document.querySelectorAll('.custom-option');

  function updateCustomDropdown(value) {
    if (!serviceTypeSelect) return;
    serviceTypeSelect.value = value;

    let matchedOption = null;
    customOptions.forEach(opt => {
      const optVal = opt.getAttribute('data-value');
      if (optVal === value) {
        opt.classList.add('selected');
        opt.setAttribute('aria-selected', 'true');
        matchedOption = opt;
      } else {
        opt.classList.remove('selected');
        opt.setAttribute('aria-selected', 'false');
      }
    });

    if (matchedOption && value !== '') {
      const optText = matchedOption.querySelector('.option-text')?.textContent || '';
      if (customSelectLabel) customSelectLabel.textContent = optText;
      if (customSelectTrigger) customSelectTrigger.classList.add('has-value');
    } else {
      const defaultOpt = document.querySelector('.custom-option[data-value=""]');
      const defaultText = defaultOpt?.querySelector('.option-text')?.textContent || 'اختر الخدمة المطلوبة...';
      if (customSelectLabel) customSelectLabel.textContent = defaultText;
      if (customSelectTrigger) customSelectTrigger.classList.remove('has-value');
    }

    clearFieldError(serviceTypeSelect);
  }

  function closeCustomSelect() {
    if (customSelectWrapper) {
      customSelectWrapper.classList.remove('open');
      customSelectTrigger?.setAttribute('aria-expanded', 'false');
    }
  }

  function openCustomSelect() {
    if (customSelectWrapper) {
      customSelectWrapper.classList.add('open');
      customSelectTrigger?.setAttribute('aria-expanded', 'true');
      const selectedOpt = customSelectOptions?.querySelector('.custom-option.selected') || customOptions[0];
      selectedOpt?.focus();
    }
  }

  function toggleCustomSelect() {
    if (customSelectWrapper?.classList.contains('open')) {
      closeCustomSelect();
    } else {
      openCustomSelect();
    }
  }

  if (customSelectTrigger && customSelectWrapper) {
    customSelectTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCustomSelect();
    });

    customSelectTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCustomSelect();
      } else if (e.key === 'Escape') {
        closeCustomSelect();
      }
    });

    customOptions.forEach((opt, idx) => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = opt.getAttribute('data-value') || '';
        updateCustomDropdown(val);
        closeCustomSelect();
        customSelectTrigger.focus();
      });

      opt.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const val = opt.getAttribute('data-value') || '';
          updateCustomDropdown(val);
          closeCustomSelect();
          customSelectTrigger.focus();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = customOptions[idx + 1] || customOptions[0];
          next.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = customOptions[idx - 1] || customOptions[customOptions.length - 1];
          prev.focus();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          closeCustomSelect();
          customSelectTrigger.focus();
        } else if (e.key === 'Tab') {
          closeCustomSelect();
        }
      });
    });

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', (e) => {
      if (!customSelectWrapper.contains(e.target)) {
        closeCustomSelect();
      }
    });
  }

  // مزامنة التغيير عند تغيير الـ select الأصلي برمجياً
  if (serviceTypeSelect) {
    serviceTypeSelect.addEventListener('change', () => {
      updateCustomDropdown(serviceTypeSelect.value);
    });
  }

  // --------------------------------------------------------------------------
  // 14. معالجة نموذج طلب التصميم والتسعيرة عبر الواتساب (بدون أي إيموجي)
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

      // تحقق الجوال (أرقام سعودية صحيحة)
      const rawPhone = phoneInput.value.trim();
      const cleanDigits = rawPhone.replace(/[^0-9]/g, '');
      const phoneRegex = /^(05|5|9665)[0-9]{8}$/;
      if (!rawPhone || !phoneRegex.test(cleanDigits)) {
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

      // تنسيق الرسالة باللغة العربية للواتساب (مطابقة بدقة للمواصفات بدون إيموجي)
      const name = nameInput.value.trim();
      const serviceText = serviceSelect.options[serviceSelect.selectedIndex]?.text || serviceSelect.value;
      const notes = notesInput.value.trim() || 'لا توجد ملاحظات إضافية';

      const lines = [
        "*طلب تسعيرة جديد - عملاق الرخام*",
        "━━━━━━━━━━━━━━",
        `*الاسم:* ${name}`,
        `*رقم الجوال:* ${cleanDigits}`,
        `*الخدمة المطلوبة:* ${serviceText}`,
        `*المقاسات والملاحظات:* ${notes}`,
        "━━━━━━━━━━━━━━",
        "أُرسل من موقع عملاق الرخام"
      ];

      const encodedMessage = encodeURIComponent(lines.join('\n'));
      const whatsappUrl = `https://wa.me/966556339040?text=${encodedMessage}`;

      // فتح محادثة الواتساب
      window.open(whatsappUrl, '_blank');

      // إعادة تعيين النموذج والقائمة المنسدلة
      quoteForm.reset();
      updateCustomDropdown('');
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

  // --------------------------------------------------------------------------
  // 15. ربط شرائح الخدمات وبطاقاتها بنموذج التسعيرة والتمرير الناعم
  // --------------------------------------------------------------------------
  const projectNotes = document.getElementById('projectNotes');
  const serviceChips = document.querySelectorAll('.service-chip');

  serviceChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const sinkType = chip.getAttribute('data-sink-type');
      const tableType = chip.getAttribute('data-table-type');
      const chipText = chip.querySelector('.chip-text')?.textContent.trim() || chip.textContent.trim();

      if (sinkType) {
        updateCustomDropdown('sinks');
        if (projectNotes) {
          const curNotes = projectNotes.value.trim();
          if (!curNotes || curNotes.startsWith('نوع الحوض المطلوب:')) {
            projectNotes.value = `نوع الحوض المطلوب: ${sinkType}`;
          }
        }
      } else if (tableType) {
        if (tableType === 'كاونترات' || tableType === 'بارات للكافيهات والمطاعم') {
          updateCustomDropdown('counters');
        } else {
          updateCustomDropdown('tables');
        }
        if (projectNotes) {
          const curNotes = projectNotes.value.trim();
          if (!curNotes || curNotes.startsWith('النوع المطلوب:')) {
            projectNotes.value = `النوع المطلوب: ${tableType}`;
          }
        }
      }

      // تمرير ناعم لنموذج التسعيرة
      if (typeof lenis !== 'undefined' && lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo('#quote-form', { offset: -80 });
      } else {
        const quoteSection = document.getElementById('quote-form');
        if (quoteSection) {
          quoteSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ربط روابط بطاقات الخدمات بنموذج التسعيرة مع التحديد التلقائي للخدمة
  const serviceLinks = document.querySelectorAll('.service-link[data-service-select]');
  serviceLinks.forEach(link => {
    link.addEventListener('click', () => {
      const selectedService = link.getAttribute('data-service-select');
      if (selectedService) {
        updateCustomDropdown(selectedService);
      }
      if (typeof lenis !== 'undefined' && lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo('#quote-form', { offset: -80 });
      }
    });
  });

});
