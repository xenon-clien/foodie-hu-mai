// Foodie Hu Mai - Modern Application Engine
// Transparent Food Delivery Price Matcher & Community Savings Hub

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // DOM ELEMENT REFERENCES
  // ==========================================

  // Navigation & Brand
  const navTabs = document.querySelectorAll(".simple-tabs .nav-tab");
  const mobileBottomTabs = document.querySelectorAll(".mobile-app-bottom-bar .mobile-bottom-tab");
  const brandHomeBtn = document.getElementById("brandHomeBtn");
  const howItWorksBtn = document.getElementById("howItWorksBtn");

  // Food Picker & Live Face-off
  const foodCards = document.querySelectorAll(".giant-food-grid .food-card");
  const dishFaceoffCardContainer = document.getElementById("dishFaceoffCardContainer");
  const dishSearchInput = document.getElementById("dishSearchInput");
  const searchGoBtn = document.getElementById("searchGoBtn");
  const dishDropdown = document.getElementById("dishDropdown");

  // Comparator Elements
  const cartInput = document.getElementById("cartInput");
  const paymentSelect = document.getElementById("paymentSelect");
  const orderTypeSelect = document.getElementById("orderTypeSelect");
  const comparisonResultGrid = document.getElementById("comparisonResultGrid");
  const whatsappShareBtn = document.getElementById("whatsappShareBtn");
  const presetBtns = document.querySelectorAll(".preset-pills .preset-btn");

  // Fee Exposer Elements
  const ordersSlider = document.getElementById("ordersSlider");
  const ordersPerMonthDisplay = document.getElementById("ordersPerMonthDisplay");
  const annualWastedFee = document.getElementById("annualWastedFee");

  // Hot Deals & Coupons
  const hotDealsContainer = document.getElementById("hotDealsContainer");
  const dealTabBtns = document.querySelectorAll(".deal-tab-btn");
  const couponsContainer = document.getElementById("couponsContainer");
  const couponFilterTabs = document.querySelectorAll(".filter-tabs .tab-btn");

  // Top Bar & Badges
  const citySelectorBtn = document.getElementById("citySelectorBtn");
  const currentCityLabel = document.getElementById("currentCityLabel");
  const personalBachatBadge = document.getElementById("personalBachatBadge");
  const topBachatAmt = document.getElementById("topBachatAmt");
  const toastNotice = document.getElementById("toastNotice");
  const toastMsg = document.getElementById("toastMsg");

  // Mobile Sticky Floating Bar
  const mobileStickyBar = document.getElementById("mobileStickyBar");
  const stickyWinnerBadge = document.getElementById("stickyWinnerBadge");
  const stickyPriceDisplay = document.getElementById("stickyPriceDisplay");
  const stickyActionBtn = document.getElementById("stickyActionBtn");
  const stickyCloseBtn = document.getElementById("stickyCloseBtn");

  // Order Assistant Modal
  const cartGuideOverlay = document.getElementById("cartGuideOverlay");
  const cartGuideCloseBtn = document.getElementById("cartGuideCloseBtn");
  const cartGuideIcon = document.getElementById("cartGuideIcon");
  const cartGuideTitle = document.getElementById("cartGuideTitle");
  const cartGuideSubtitle = document.getElementById("cartGuideSubtitle");
  const cartGuideMenuPrice = document.getElementById("cartGuideMenuPrice");
  const cartGuideDiscount = document.getElementById("cartGuideDiscount");
  const cartGuideCodePill = document.getElementById("cartGuideCodePill");
  const cartGuideFinalPrice = document.getElementById("cartGuideFinalPrice");
  const cartGuideStep1Text = document.getElementById("cartGuideStep1Text");
  const cartGuideCouponText = document.getElementById("cartGuideCouponText");
  const cartGuideStep3Text = document.getElementById("cartGuideStep3Text");
  const cartGuideCopyBtn = document.getElementById("cartGuideCopyBtn");
  const cartGuideActionBtn = document.getElementById("cartGuideActionBtn");
  const cartGuideActionText = document.getElementById("cartGuideActionText");
  const cartGuideActionBtnBottom = document.getElementById("cartGuideActionBtnBottom");
  const cartGuideActionTextBottom = document.getElementById("cartGuideActionTextBottom");

  // Passbook Modal
  const passbookModal = document.getElementById("passbookModal");
  const passbookCloseBtn = document.getElementById("passbookCloseBtn");
  const passbookTotalDisplay = document.getElementById("passbookTotalDisplay");
  const pbOrdersCount = document.getElementById("pbOrdersCount");
  const pbFeeSaved = document.getElementById("pbFeeSaved");
  const pbLevelBadge = document.getElementById("pbLevelBadge");
  const passbookShareBtn = document.getElementById("passbookShareBtn");

  // How It Works Modal
  const howItWorksModal = document.getElementById("howItWorksModal");
  const howItWorksCloseBtn = document.getElementById("howItWorksCloseBtn");
  const hiwGotItBtn = document.getElementById("hiwGotItBtn");

  // Application State
  let currentCouponFilter = "guaranteed";
  let currentDealCategory = "all";
  let selectedDish = null; // Clean initial state: no dish forced on load!

  // ==========================================
  // SECURITY SANITIZER (DOM XSS DEFENSE)
  // ==========================================
  function escapeHTML(str) {
    if (typeof str !== "string") return String(str || "");
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // ==========================================
  // TOAST NOTIFICATIONS
  // ==========================================
  window.showToast = function(message) {
    if (!toastNotice || !toastMsg) return;
    toastMsg.textContent = message;
    toastNotice.classList.add("show");
    setTimeout(() => {
      toastNotice.classList.remove("show");
    }, 3200);
  };

  // ==========================================
  // 1. SMOOTH NAVIGATION & SCROLL TRACKING
  // ==========================================
  const allNavLinks = [...navTabs, ...mobileBottomTabs];

  function setActiveNavLink(targetId) {
    allNavLinks.forEach(link => {
      if (link.dataset.target === targetId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  allNavLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.dataset.target;
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveNavLink(targetId);
      }
    });
  });

  if (brandHomeBtn) {
    brandHomeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveNavLink("foodSection");
    });
  }

  // Scroll spy for updating active nav pill
  const observedSections = ["foodSection", "compareSection", "dealsSection", "couponsSection"];
  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY + 140;
    for (let i = observedSections.length - 1; i >= 0; i--) {
      const el = document.getElementById(observedSections[i]);
      if (el && el.offsetTop <= scrollPos) {
        setActiveNavLink(observedSections[i]);
        break;
      }
    }
  }, { passive: true });

  // How It Works Modal
  if (howItWorksBtn && howItWorksModal) {
    howItWorksBtn.addEventListener("click", () => {
      howItWorksModal.style.display = "flex";
    });
  }

  if (howItWorksCloseBtn && howItWorksModal) {
    howItWorksCloseBtn.addEventListener("click", () => {
      howItWorksModal.style.display = "none";
    });
  }

  if (hiwGotItBtn && howItWorksModal) {
    hiwGotItBtn.addEventListener("click", () => {
      howItWorksModal.style.display = "none";
      const foodSection = document.getElementById("foodSection");
      if (foodSection) foodSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (howItWorksModal) {
    howItWorksModal.addEventListener("click", (e) => {
      if (e.target === howItWorksModal) {
        howItWorksModal.style.display = "none";
      }
    });
  }

  // ==========================================
  // 2. SAVINGS PASSBOOK (LOCALSTORAGE)
  // ==========================================
  function loadPersonalBachat() {
    const saved = parseInt(localStorage.getItem("foodie_personal_bachat")) || 0;
    if (topBachatAmt) {
      topBachatAmt.textContent = `₹${saved.toLocaleString("en-IN")}`;
    }
  }

  function addPersonalSavings(amount) {
    let current = parseInt(localStorage.getItem("foodie_personal_bachat")) || 0;
    current += amount;
    localStorage.setItem("foodie_personal_bachat", current);
    loadPersonalBachat();
    if (personalBachatBadge) {
      personalBachatBadge.style.transform = "scale(1.15)";
      setTimeout(() => {
        personalBachatBadge.style.transform = "scale(1)";
      }, 300);
    }
  }

  window.openPassbookModal = function() {
    if (!passbookModal) return;
    const currentSavings = parseInt(localStorage.getItem("foodie_personal_bachat")) || 120;
    const ordersCount = Math.max(1, Math.floor(currentSavings / 60));
    const feeSaved = ordersCount * 10;

    if (passbookTotalDisplay) passbookTotalDisplay.textContent = `₹${currentSavings.toLocaleString("en-IN")}`;
    if (pbOrdersCount) pbOrdersCount.textContent = ordersCount;
    if (pbFeeSaved) pbFeeSaved.textContent = `₹${feeSaved}`;

    if (pbLevelBadge) {
      if (currentSavings > 1000) pbLevelBadge.textContent = "VIP Foodie 🥇";
      else if (currentSavings > 300) pbLevelBadge.textContent = "Smart Saver 🥈";
      else pbLevelBadge.textContent = "Foodie Starter 🥉";
    }

    if (passbookShareBtn) {
      const shareText = `I saved ₹${currentSavings} on food delivery with Foodie Hu Mai! Compare live prices here: https://foodie-hu-mai.vercel.app`;
      passbookShareBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    }

    passbookModal.style.display = "flex";
  };

  if (personalBachatBadge) {
    personalBachatBadge.addEventListener("click", openPassbookModal);
  }

  if (passbookCloseBtn) {
    passbookCloseBtn.addEventListener("click", () => {
      passbookModal.style.display = "none";
    });
  }

  if (passbookModal) {
    passbookModal.addEventListener("click", (e) => {
      if (e.target === passbookModal) {
        passbookModal.style.display = "none";
      }
    });
  }

  loadPersonalBachat();

  // ==========================================
  // 3. CASHKARO-STYLE 3-STEP ORDER ASSISTANT
  // ==========================================
  window.openOrderGuide = function(code, restaurant, platform, menuPrice, finalPrice, deepLink) {
    if (!cartGuideOverlay) {
      if (deepLink) window.open(deepLink, "_blank");
      return;
    }

    const discount = Math.max(0, menuPrice - finalPrice);
    const effectiveCode = (code && code !== "None" && code.trim() !== "") ? code : "BESTDEAL";

    // Copy coupon code to clipboard immediately
    if (effectiveCode && navigator.clipboard) {
      navigator.clipboard.writeText(effectiveCode).catch(() => {});
    }

    // Add personal savings count
    addPersonalSavings(discount > 0 ? discount : 60);

    const pLower = (platform || "").toLowerCase();
    let pIcon = "🍕";
    if (pLower.includes("domino")) pIcon = "🍕";
    else if (pLower.includes("swiggy")) pIcon = "🛵";
    else if (pLower.includes("zomato")) pIcon = "🍅";
    else if (pLower.includes("eatsure") || pLower.includes("faasos") || pLower.includes("behrouz")) pIcon = "🍱";
    else if (pLower.includes("magicpin")) pIcon = "🛍️";
    else if (pLower.includes("ondc")) pIcon = "🇮🇳";
    else pIcon = "🍔";

    if (cartGuideIcon) cartGuideIcon.textContent = pIcon;
    if (cartGuideTitle) cartGuideTitle.textContent = `${platform} Order Assistant`;
    if (cartGuideSubtitle) cartGuideSubtitle.textContent = `${restaurant} • Menu Sticker Rate vs Final Net Bill`;
    if (cartGuideMenuPrice) cartGuideMenuPrice.textContent = `₹${menuPrice}`;
    if (cartGuideDiscount) cartGuideDiscount.textContent = discount > 0 ? `-₹${discount}` : "Pre-Applied";
    if (cartGuideCodePill) cartGuideCodePill.textContent = effectiveCode ? `Code: ${effectiveCode}` : "✨ Auto-Discount";
    if (cartGuideFinalPrice) cartGuideFinalPrice.textContent = `₹${finalPrice}`;
    if (cartGuideCouponText) cartGuideCouponText.textContent = effectiveCode;

    if (cartGuideStep1Text) {
      cartGuideStep1Text.innerHTML = `When ${platform} opens, the menu rate (<strong>₹${menuPrice}</strong>) will be shown. First click <em>"Add to Cart"</em>.`;
    }

    if (cartGuideStep3Text) {
      if (pLower.includes("domino")) {
        cartGuideStep3Text.innerHTML = `In Domino's cart, paste coupon <strong>${effectiveCode}</strong> or select the Everyday Value combo to slash your bill instantly!`;
      } else if (pLower.includes("swiggy")) {
        cartGuideStep3Text.innerHTML = `In Swiggy checkout, paste <strong>${effectiveCode}</strong> in 'Apply Coupon'. The bill will drop from <strong>₹${menuPrice} to ₹${finalPrice}</strong>!`;
      } else if (pLower.includes("zomato")) {
        cartGuideStep3Text.innerHTML = `In Zomato checkout, apply coupon <strong>${effectiveCode}</strong> to save ₹${discount}!`;
      } else {
        cartGuideStep3Text.innerHTML = `Paste the coupon in 'Apply Coupon' box to instantly slash your bill!`;
      }
    }

    if (cartGuideActionText) {
      cartGuideActionText.textContent = `⚡ Open ${platform} & Save ₹${discount > 0 ? discount : 60} ↗`;
    }
    if (cartGuideActionBtn) {
      cartGuideActionBtn.href = deepLink || "#";
      cartGuideActionBtn.onclick = (e) => {
        if (deepLink && deepLink !== "#") {
          window.open(deepLink, "_blank");
          e.preventDefault();
        }
      };
    }

    if (cartGuideActionTextBottom) {
      cartGuideActionTextBottom.textContent = `Proceed to ${platform} (₹${finalPrice}) ↗`;
    }
    if (cartGuideActionBtnBottom) {
      cartGuideActionBtnBottom.href = deepLink || "#";
      cartGuideActionBtnBottom.onclick = (e) => {
        if (deepLink && deepLink !== "#") {
          window.open(deepLink, "_blank");
          e.preventDefault();
        }
      };
    }

    cartGuideOverlay.style.display = "flex";
  };

  if (cartGuideCloseBtn) {
    cartGuideCloseBtn.addEventListener("click", () => {
      cartGuideOverlay.style.display = "none";
    });
  }

  if (cartGuideOverlay) {
    cartGuideOverlay.addEventListener("click", (e) => {
      if (e.target === cartGuideOverlay) {
        cartGuideOverlay.style.display = "none";
      }
    });
  }

  if (cartGuideCopyBtn) {
    cartGuideCopyBtn.addEventListener("click", () => {
      const code = cartGuideCouponText ? cartGuideCouponText.textContent : "DOMNEW";
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
          showToast(`✅ Code "${code}" copied to clipboard!`);
        }).catch(() => {});
      }
    });
  }

  window.directAutoOrder = function(code, restaurant, platform, savings, menuPrice = 0, finalPrice = 0, deepLink = "") {
    const mPrice = menuPrice || (finalPrice ? finalPrice + savings : 350);
    const fPrice = finalPrice || Math.max(0, mPrice - (savings || 75));
    const effectiveCode = (code && code !== "None" && code.trim() !== "") ? code : "BESTDEAL";

    openOrderGuide(effectiveCode, restaurant || "Your Dish", platform || "Food App", mPrice, fPrice, deepLink);
  };

  // ==========================================
  // 4. LIVE DISH FACEOFF ARENA (USER-TRIGGERED)
  // ==========================================
  function renderDishFaceoff(dish, appliedCoupon = null) {
    if (!dish || !dishFaceoffCardContainer) return;
    selectedDish = dish;

    const currentCity = currentCityLabel ? currentCityLabel.textContent.trim() : "Ludhiana";
    const comparison = ComparatorEngine.compareDish(dish, appliedCoupon, paymentSelect ? paymentSelect.value : "all", currentCity);

    // Identify Winner Object
    const winnerKey = comparison.winner.toLowerCase().includes("domino") ? "dominos" :
                      comparison.winner.toLowerCase().includes("eatsure") ? "eatsure" :
                      comparison.winner.toLowerCase().includes("magic") ? "magicpin" :
                      comparison.winner.toLowerCase().includes("ondc") ? "ondc" :
                      comparison.winner.toLowerCase().includes("swiggy") ? "swiggy" : "zomato";
    const winnerObj = comparison[winnerKey] || comparison.magicpin || comparison.dominos || comparison.swiggy;

    // Mobile sticky bar update (Only shown on small screens)
    if (mobileStickyBar && stickyWinnerBadge && stickyPriceDisplay && stickyActionBtn) {
      if (window.innerWidth <= 768) {
        mobileStickyBar.style.display = "block";
      }
      stickyWinnerBadge.textContent = `👑 LOWEST: ${comparison.winner.toUpperCase()}`;
      stickyPriceDisplay.textContent = `₹${winnerObj.finalPrice} Net Bill (Save ₹${comparison.totalSaved})`;
      stickyActionBtn.onclick = () => {
        openOrderGuide(winnerObj.promo ? winnerObj.promo.code : "BESTDEAL", dish.name, comparison.winner, winnerObj.gross || winnerObj.base, winnerObj.finalPrice, winnerObj.deepLink);
      };
    }

    const couponOptions = [
      { code: "", label: "⚡ Auto-Best Discount" },
      { code: "EDV99", label: "EDV99 (Everyday Value 2 Pizzas @ ₹99)" },
      { code: "DOMNEW", label: "DOMNEW (Domino's App: Flat ₹100 OFF)" },
      { code: "GET30", label: "GET30 (Domino's Live: Flat ₹30 OFF)" },
      { code: "DOMINOS50", label: "DOMINOS50 (50% OFF Magicpin Domino's)" },
      { code: "TRYNEW", label: "TRYNEW (60% OFF up to ₹120)" },
      { code: "STEALDEAL", label: "STEALDEAL (40% OFF up to ₹100)" },
      { code: "HDFC100", label: "HDFC100 (Flat ₹100 OFF on Bank Cards)" }
    ];

    dishFaceoffCardContainer.innerHTML = `
      <div class="dish-faceoff-card">
        
        <!-- Olympic Winner Highlight Podium Banner -->
        <div class="winner-hero-banner">
          <div class="whb-badge">🥇 100% LOWEST PRICE GUARANTEED</div>
          <div class="whb-main-row">
            <div class="whb-left">
              <span class="whb-emoji">${dish.emoji}</span>
              <div>
                <h3 class="whb-title">${comparison.winner}</h3>
                <p class="whb-dish-info">${dish.name} • Available at ${dish.popularRest}</p>
              </div>
            </div>
            <div class="whb-right">
              <div class="whb-price-box">
                <span class="whb-strike">Screen Rate: ₹${winnerObj.gross || winnerObj.base}</span>
                <span class="whb-final">₹${winnerObj.finalPrice} <small>Net Bill</small></span>
              </div>
              <div class="whb-save-tag">Your Net Savings: Flat ₹${comparison.totalSaved} 🎉</div>
            </div>
          </div>
          <button type="button" class="whb-order-btn" onclick="openOrderGuide('${winnerObj.promo ? winnerObj.promo.code : 'BESTDEAL'}', '${dish.name.replace(/'/g, "\\'")}', '${comparison.winner}', ${winnerObj.gross || winnerObj.base}, ${winnerObj.finalPrice}, '${winnerObj.deepLink}')">
            ⚡ Order on ${comparison.winner} &amp; Save ₹${comparison.totalSaved} ➔
          </button>
        </div>

        <!-- Interactive Coupon Slasher Bar -->
        <div class="coupon-slasher-bar">
          <div class="slasher-left">
            <span>🏷️</span>
            <span>Test Different Promo Codes Live:</span>
          </div>
          <div class="slasher-controls">
            <select class="coupon-select-inline" id="dishCouponSelector">
              ${couponOptions.map(opt => `
                <option value="${opt.code}" ${(appliedCoupon === opt.code) ? 'selected' : ''}>${opt.label}</option>
              `).join('')}
            </select>
            <button class="apply-slasher-btn" id="applyDishCouponBtn">Apply ✂️</button>
          </div>
        </div>

        <!-- All Platform Comparison Cards -->
        <div class="comparison-grid">
          ${comparison.isDominos ? `
          <!-- Domino's Official App -->
          <div class="platform-card ${comparison.dominos.finalPrice === winnerObj.finalPrice ? 'winner' : ''}">
            ${comparison.dominos.finalPrice === winnerObj.finalPrice ? `<div class="winner-crown">👑 WINNER (SAVE ₹${comparison.totalSaved})</div>` : ''}
            <div class="platform-top">
              <div class="platform-brand">
                <span class="brand-dot dominos"></span>
                <span>Domino's (Official App)</span>
              </div>
            </div>
            <div class="final-price-box">
              <div class="final-price-label">Net Payable Bill</div>
              <div class="final-price-value">₹${comparison.dominos.finalPrice}</div>
            </div>
            <div class="breakdown-list">
              <div class="breakdown-row"><span>Menu Sticker Price</span><span>₹${comparison.dominos.base}</span></div>
              <div class="breakdown-row"><span>Delivery &amp; Platform Fee</span><span><strong style="color:var(--savings-green)">₹0 FREE</strong></span></div>
              ${comparison.dominos.discount > 0 ? `<div class="breakdown-row breakdown-discount"><span>Coupon Promo</span><span>-₹${comparison.dominos.discount}</span></div>` : ''}
            </div>
            <button type="button" class="order-btn dominos" onclick="openOrderGuide('${comparison.dominos.promo ? comparison.dominos.promo.code : 'DOMNEW'}', '${dish.name.replace(/'/g, "\\'")}', 'Domino\'s Official App', ${comparison.dominos.base}, ${comparison.dominos.finalPrice}, '${comparison.dominos.deepLink}')">Order on Domino's (₹${comparison.dominos.finalPrice}) →</button>
          </div>
          ` : `
          <!-- EatSure (Direct) -->
          <div class="platform-card ${comparison.eatsure.finalPrice === winnerObj.finalPrice ? 'winner' : ''}">
            ${comparison.eatsure.finalPrice === winnerObj.finalPrice ? `<div class="winner-crown">👑 WINNER (SAVE ₹${comparison.totalSaved})</div>` : ''}
            <div class="platform-top">
              <div class="platform-brand">
                <span class="brand-dot eatsure"></span>
                <span>EatSure (Direct)</span>
              </div>
            </div>
            <div class="final-price-box">
              <div class="final-price-label">Net Payable Bill</div>
              <div class="final-price-value">₹${comparison.eatsure.finalPrice}</div>
            </div>
            <div class="breakdown-list">
              <div class="breakdown-row"><span>Menu Sticker Price</span><span>₹${comparison.eatsure.base}</span></div>
              <div class="breakdown-row"><span>Delivery &amp; Platform Fee</span><span><strong style="color:var(--savings-green)">₹0 FREE</strong></span></div>
              ${comparison.eatsure.discount > 0 ? `<div class="breakdown-row breakdown-discount"><span>Coupon Savings</span><span>-₹${comparison.eatsure.discount}</span></div>` : ''}
            </div>
            <button type="button" class="order-btn eatsure" onclick="openOrderGuide('${comparison.eatsure.promo ? comparison.eatsure.promo.code : 'SURE50'}', '${dish.name.replace(/'/g, "\\'")}', 'EatSure', ${comparison.eatsure.base}, ${comparison.eatsure.finalPrice}, '${comparison.eatsure.deepLink || 'https://www.eatsure.com'}')">Order on EatSure (₹${comparison.eatsure.finalPrice}) →</button>
          </div>
          `}

          <!-- Magicpin -->
          <div class="platform-card ${comparison.magicpin.finalPrice === winnerObj.finalPrice ? 'winner' : ''}">
            ${comparison.magicpin.finalPrice === winnerObj.finalPrice ? `<div class="winner-crown">👑 WINNER (SAVE ₹${comparison.totalSaved})</div>` : ''}
            <div class="platform-top">
              <div class="platform-brand">
                <span class="brand-dot magicpin"></span>
                <span>Magicpin</span>
              </div>
            </div>
            <div class="final-price-box">
              <div class="final-price-label">Net Payable Bill</div>
              <div class="final-price-value">₹${comparison.magicpin.finalPrice}</div>
            </div>
            <div class="breakdown-list">
              <div class="breakdown-row"><span>Dish Base Rate</span><span>₹${dish.magicpinBase}</span></div>
              <div class="breakdown-row"><span>GST &amp; Delivery</span><span>₹${comparison.magicpin.gross - dish.magicpinBase}</span></div>
              ${comparison.magicpin.discount > 0 ? `<div class="breakdown-row breakdown-discount"><span>Coupon Savings</span><span>-₹${comparison.magicpin.discount}</span></div>` : ''}
            </div>
            <button type="button" class="order-btn magicpin" onclick="openOrderGuide('${comparison.magicpin.promo ? comparison.magicpin.promo.code : 'DOMINOS50'}', '${dish.name.replace(/'/g, "\\'")}', 'Magicpin', ${comparison.magicpin.gross}, ${comparison.magicpin.finalPrice}, '${comparison.magicpin.deepLink}')">Order on Magicpin (₹${comparison.magicpin.finalPrice}) →</button>
          </div>

          <!-- Swiggy -->
          <div class="platform-card ${comparison.swiggy.finalPrice === winnerObj.finalPrice ? 'winner' : ''}">
            ${comparison.swiggy.finalPrice === winnerObj.finalPrice ? `<div class="winner-crown">👑 WINNER (SAVE ₹${comparison.totalSaved})</div>` : ''}
            <div class="platform-top">
              <div class="platform-brand">
                <span class="brand-dot swiggy"></span>
                <span>Swiggy</span>
              </div>
            </div>
            <div class="final-price-box">
              <div class="final-price-label">Net Payable Bill</div>
              <div class="final-price-value">₹${comparison.swiggy.finalPrice}</div>
            </div>
            <div class="breakdown-list">
              <div class="breakdown-row"><span>Dish Base Rate</span><span>₹${dish.swiggyBase}</span></div>
              <div class="breakdown-row"><span>Fees &amp; Delivery</span><span>₹${comparison.swiggy.gross - dish.swiggyBase}</span></div>
              ${comparison.swiggy.discount > 0 ? `<div class="breakdown-row breakdown-discount"><span>Coupon Savings</span><span>-₹${comparison.swiggy.discount}</span></div>` : ''}
            </div>
            <button type="button" class="order-btn swiggy" onclick="openOrderGuide('${comparison.swiggy.promo ? comparison.swiggy.promo.code : 'TRYNEW'}', '${dish.name.replace(/'/g, "\\'")}', 'Swiggy', ${dish.swiggyBase}, ${comparison.swiggy.finalPrice}, '${comparison.swiggy.deepLink}')">Order on Swiggy (₹${comparison.swiggy.finalPrice}) →</button>
          </div>

          <!-- Zomato -->
          <div class="platform-card ${comparison.zomato.finalPrice === winnerObj.finalPrice ? 'winner' : ''}">
            ${comparison.zomato.finalPrice === winnerObj.finalPrice ? `<div class="winner-crown">👑 WINNER (SAVE ₹${comparison.totalSaved})</div>` : ''}
            <div class="platform-top">
              <div class="platform-brand">
                <span class="brand-dot zomato"></span>
                <span>Zomato</span>
              </div>
            </div>
            <div class="final-price-box">
              <div class="final-price-label">Net Payable Bill</div>
              <div class="final-price-value">₹${comparison.zomato.finalPrice}</div>
            </div>
            <div class="breakdown-list">
              <div class="breakdown-row"><span>Dish Base Rate</span><span>₹${dish.zomatoBase}</span></div>
              <div class="breakdown-row"><span>Fees &amp; Delivery</span><span>₹${comparison.zomato.gross - dish.zomatoBase}</span></div>
              ${comparison.zomato.discount > 0 ? `<div class="breakdown-row breakdown-discount"><span>Coupon Savings</span><span>-₹${comparison.zomato.discount}</span></div>` : ''}
            </div>
            <button type="button" class="order-btn zomato" onclick="openOrderGuide('${comparison.zomato.promo ? comparison.zomato.promo.code : 'STEALDEAL'}', '${dish.name.replace(/'/g, "\\'")}', 'Zomato', ${dish.zomatoBase}, ${comparison.zomato.finalPrice}, '${comparison.zomato.deepLink}')">Order on Zomato (₹${comparison.zomato.finalPrice}) →</button>
          </div>

          <!-- ONDC -->
          <div class="platform-card ${comparison.ondc.finalPrice === winnerObj.finalPrice ? 'winner' : ''}">
            ${comparison.ondc.finalPrice === winnerObj.finalPrice ? `<div class="winner-crown">👑 WINNER (SAVE ₹${comparison.totalSaved})</div>` : ''}
            <div class="platform-top">
              <div class="platform-brand">
                <span class="brand-dot ondc"></span>
                <span>ONDC (Direct Network)</span>
              </div>
            </div>
            <div class="final-price-box">
              <div class="final-price-label">Net Payable Bill</div>
              <div class="final-price-value">₹${comparison.ondc.finalPrice}</div>
            </div>
            <div class="breakdown-list">
              <div class="breakdown-row"><span>Dish Base Rate</span><span>₹${comparison.ondc.base}</span></div>
              <div class="breakdown-row"><span>Subsidized Del</span><span>₹22</span></div>
              ${comparison.ondc.discount > 0 ? `<div class="breakdown-row breakdown-discount"><span>ONDC Promo</span><span>-₹${comparison.ondc.discount}</span></div>` : ''}
            </div>
            <button type="button" class="order-btn ondc" onclick="openOrderGuide('ONDC50', '${dish.name.replace(/'/g, "\\'")}', 'ONDC (Pincode)', ${comparison.ondc.base}, ${comparison.ondc.finalPrice}, '${comparison.ondc.deepLink}')">Order on ONDC (₹${comparison.ondc.finalPrice}) →</button>
          </div>

        </div>
      </div>
    `;

    // Hook up coupon apply button
    const dishCouponSelector = document.getElementById("dishCouponSelector");
    const applyDishCouponBtn = document.getElementById("applyDishCouponBtn");

    if (applyDishCouponBtn && dishCouponSelector) {
      applyDishCouponBtn.addEventListener("click", () => {
        const chosen = dishCouponSelector.value;
        renderDishFaceoff(selectedDish, chosen);
        showToast(chosen ? `Coupon "${chosen}" applied! Prices updated.` : "Auto-best discount applied!");
      });
    }
  }

  // Quick Select Food Function (used in placeholder tags & food cards)
  window.quickSelectDish = function(dishId) {
    if (typeof DISHES_DATA === "undefined") return;
    const match = DISHES_DATA.find(d => d.id === dishId);
    if (!match) return;

    // Highlight matching food card
    foodCards.forEach(c => {
      if (c.dataset.dishId === dishId) {
        c.classList.add("active");
      } else {
        c.classList.remove("active");
      }
    });

    if (dishSearchInput) dishSearchInput.value = match.name;
    if (cartInput) cartInput.value = match.zomatoBase || 350;

    renderDishFaceoff(match);
    renderComparison();

    // Smooth scroll down to faceoff arena
    const arena = document.getElementById("dishFaceoffCardContainer");
    if (arena) {
      arena.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Hook up Giant Food Cards
  foodCards.forEach(card => {
    card.addEventListener("click", () => {
      const dishId = card.dataset.dishId;
      quickSelectDish(dishId);
    });
  });

  // Autocomplete Dish Search Box
  if (dishSearchInput && dishDropdown) {
    dishSearchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        dishDropdown.classList.remove("show");
        return;
      }

      if (typeof DISHES_DATA === "undefined") return;

      const matches = DISHES_DATA.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.keywords.some(k => k.toLowerCase().includes(q)) ||
        d.popularRest.toLowerCase().includes(q)
      );

      if (matches.length === 0) {
        dishDropdown.innerHTML = `
          <div style="padding:16px;text-align:center;color:var(--text-muted);font-size:0.85rem;">
            No exact dish found. Use the <strong>Bill Calculator</strong> below to compare any custom cart bill!
          </div>
        `;
        dishDropdown.classList.add("show");
        return;
      }

      dishDropdown.innerHTML = matches.map(d => `
        <div class="dropdown-item" data-id="${d.id}">
          <div class="dropdown-item-left">
            <span class="dropdown-item-emoji">${d.emoji}</span>
            <div>
              <div class="dropdown-item-title">${d.name}</div>
              <div class="dropdown-item-sub">${d.popularRest} • ${d.category}</div>
            </div>
          </div>
          <span class="dropdown-item-badge">From ₹${d.magicpinBase || 250}+</span>
        </div>
      `).join("");

      dishDropdown.classList.add("show");

      // Dropdown item click
      dishDropdown.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", () => {
          const dishId = item.dataset.id;
          dishDropdown.classList.remove("show");
          quickSelectDish(dishId);
          showToast(`Comparing real-time prices for ${dishSearchInput.value}!`);
        });
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!dishSearchInput.contains(e.target) && !dishDropdown.contains(e.target)) {
        dishDropdown.classList.remove("show");
      }
    });
  }

  if (searchGoBtn && dishSearchInput) {
    searchGoBtn.addEventListener("click", () => {
      const q = dishSearchInput.value.toLowerCase().trim();
      if (!q) {
        dishSearchInput.focus();
        return;
      }
      if (typeof DISHES_DATA !== "undefined") {
        const match = DISHES_DATA.find(d => 
          d.name.toLowerCase().includes(q) ||
          d.keywords.some(k => k.toLowerCase().includes(q)) ||
          d.popularRest.toLowerCase().includes(q)
        );
        if (match) {
          quickSelectDish(match.id);
        } else {
          showToast(`Searching for "${q}" across apps...`);
          const compareSection = document.getElementById("compareSection");
          if (compareSection) compareSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }

  // Dismiss Sticky Bar
  if (stickyCloseBtn && mobileStickyBar) {
    stickyCloseBtn.addEventListener("click", () => {
      mobileStickyBar.style.display = "none";
    });
  }

  // ==========================================
  // 5. CUSTOM CART BILL CALCULATOR
  // ==========================================
  function renderComparison() {
    if (!comparisonResultGrid || !cartInput) return;

    const amount = parseFloat(cartInput.value) || 350;
    const payment = paymentSelect ? paymentSelect.value : "all";
    const orderType = orderTypeSelect ? orderTypeSelect.value : "solo";
    const currentCity = currentCityLabel ? currentCityLabel.textContent.trim() : "Ludhiana";

    const result = ComparatorEngine.calculate(amount, payment, orderType, currentCity);

    // Update WhatsApp Share Link
    if (whatsappShareBtn) {
      whatsappShareBtn.href = ComparatorEngine.generateWhatsAppShare(result);
    }

    const platforms = [result.dominos, result.eatsure, result.magicpin, result.ondc, result.swiggy, result.zomato].filter(Boolean);

    comparisonResultGrid.innerHTML = platforms.map(p => {
      const isWinner = p.isWinner;
      const brandClass = p.platform.toLowerCase().includes("zomato") ? "zomato" :
                         p.platform.toLowerCase().includes("swiggy") ? "swiggy" :
                         p.platform.toLowerCase().includes("domino") ? "dominos" :
                         p.platform.toLowerCase().includes("eatsure") ? "eatsure" :
                         p.platform.toLowerCase().includes("ondc") ? "ondc" : "magicpin";

      return `
        <div class="platform-card ${isWinner ? 'winner' : ''}">
          ${isWinner ? `<div class="winner-crown">👑 LOWEST PRICE (SAVE ₹${result.totalSaved})</div>` : ''}
          
          <div class="platform-top">
            <div class="platform-brand">
              <span class="brand-dot ${brandClass}"></span>
              <span>${p.platform}</span>
            </div>
            ${p.promoCode !== "None" ? `<span style="font-size:0.75rem;font-weight:700;color:var(--savings-dark);">Code Applied</span>` : ''}
          </div>

          <div class="final-price-box">
            <div class="final-price-label">Net Payable Bill</div>
            <div class="final-price-value">₹${p.finalPrice}</div>
          </div>

          <div class="breakdown-list">
            <div class="breakdown-row">
              <span>Item Total (Menu Base)</span>
              <span>₹${p.base}</span>
            </div>
            <div class="breakdown-row">
              <span>GST Taxes (5%)</span>
              <span>₹${p.gst}</span>
            </div>
            <div class="breakdown-row">
              <span>Platform Fee</span>
              <span>${p.platformFee === 0 ? '<strong style="color:var(--savings-green)">₹0 FREE</strong>' : `₹${p.platformFee}`}</span>
            </div>
            <div class="breakdown-row">
              <span>Delivery &amp; Packaging</span>
              <span>₹${p.delivery + p.packaging}</span>
            </div>
            ${p.discount > 0 ? `
              <div class="breakdown-row breakdown-discount">
                <span>Discount (${p.promoCode})</span>
                <span>-₹${p.discount}</span>
              </div>
            ` : ''}
          </div>

          ${p.promoCode !== "None" ? `
            <div class="applied-coupon-pill">
              🎉 Auto-applied: <strong>${p.promoCode}</strong> (${p.promoHeadline})
            </div>
          ` : `
            <div class="applied-coupon-pill" style="border-color:#E2E8F0;background:#F8FAFC;color:var(--text-muted)">
              ℹ️ Standard Rates (No min coupon matched)
            </div>
          `}

          <button type="button" class="order-btn ${brandClass}" onclick="openOrderGuide('${p.promoCode !== 'None' ? p.promoCode : 'BESTDEAL'}', 'Cart Total (₹${amount})', '${p.platform.split(' ')[0]}', ${p.base}, ${p.finalPrice}, '${p.deepLink}')">
            <span>Order on ${p.platform.split(' ')[0]} (₹${p.finalPrice}) →</span>
          </button>
        </div>
      `;
    }).join("");
  }

  window.setBillAmount = function(amt) {
    if (cartInput) {
      cartInput.value = amt;
    }
    presetBtns.forEach(btn => {
      if (parseInt(btn.textContent.replace(/[^0-9]/g, '')) === amt) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    renderComparison();
    showToast(`Bill set to ₹${amt}! Live net prices recalculated.`);
  };

  if (cartInput) {
    cartInput.addEventListener("input", renderComparison);
  }
  if (paymentSelect) {
    paymentSelect.addEventListener("change", renderComparison);
  }
  if (orderTypeSelect) {
    orderTypeSelect.addEventListener("change", renderComparison);
  }

  renderComparison();

  // Platform Fee Slider
  if (ordersSlider) {
    ordersSlider.addEventListener("input", (e) => {
      const count = parseInt(e.target.value) || 12;
      if (ordersPerMonthDisplay) ordersPerMonthDisplay.textContent = `${count} Orders/Month`;
      const annualWasted = count * 10 * 12;
      if (annualWastedFee) annualWastedFee.textContent = `₹${annualWasted.toLocaleString('en-IN')}`;
    });
  }

  // ==========================================
  // 6. 50% - 60% SLASHED RESTAURANT DEALS
  // ==========================================
  function renderHotDeals() {
    if (!hotDealsContainer) return;
    if (typeof HOT_RESTAURANT_DEALS === "undefined") return;

    let list = HOT_RESTAURANT_DEALS;
    if (currentDealCategory !== "all") {
      list = list.filter(d => d.category === currentDealCategory);
    }

    hotDealsContainer.innerHTML = list.map(deal => {
      const savings = deal.originalAvgPrice - deal.slashedNetPrice;

      return `
        <div class="deal-restaurant-card">
          <div class="deal-badge-floating">${deal.discountBadge}</div>
          
          <div>
            <div class="deal-rest-header">
              <span class="deal-rest-emoji">${deal.emoji}</span>
              <div>
                <div class="deal-rest-name">${deal.restaurant}</div>
                <div class="deal-rest-sub">${deal.cuisine} • <strong style="color:var(--text-dark)">${deal.rating}</strong> (${deal.deliveryTime})</div>
              </div>
            </div>

            <div class="deal-meal-highlight">
              ✨ <strong>Popular Deal:</strong> ${deal.dealHighlight}
            </div>

            <div class="deal-price-slashed-box">
              <div class="slashed-price-left">
                <span class="deal-original-striked">Avg: ₹${deal.originalAvgPrice}</span>
                <span class="deal-final-slashed">₹${deal.slashedNetPrice} <span style="font-size:0.75rem;color:var(--text-muted);font-weight:600;">Net Bill</span></span>
              </div>
              <div class="deal-coupon-applied-tag">
                <span>🏷️ ${deal.couponCode}</span>
                <span>Applied</span>
              </div>
            </div>
          </div>

          <button type="button" class="deal-order-direct-btn" onclick="directAutoOrder('${deal.couponCode}', '${deal.restaurant}', '${deal.platform}', ${savings}, ${deal.originalAvgPrice}, ${deal.slashedNetPrice}, '${deal.deepLink}')">
            <span>⚡ Order on ${deal.platform} (Save ₹${savings}) ➔</span>
          </button>
        </div>
      `;
    }).join("");
  }

  dealTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      dealTabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentDealCategory = btn.dataset.category;
      renderHotDeals();
    });
  });

  renderHotDeals();

  // ==========================================
  // 7. VERIFIED PROMO CODES HUB
  // ==========================================
  function renderCoupons() {
    if (!couponsContainer) return;
    if (typeof COUPONS_DATA === "undefined") return;

    let list = COUPONS_DATA;
    if (currentCouponFilter !== "all") {
      list = list.filter(c => c.category === currentCouponFilter);
    }

    couponsContainer.innerHTML = list.map(c => {
      const platformClass = c.platform.toLowerCase().replace(/[^a-z0-9]/g, "");
      const savedUpvotes = parseInt(localStorage.getItem(`vote_up_${c.id}`)) || c.usesToday;
      const isGuar = !!c.isGuaranteed;

      return `
        <div class="coupon-card ${isGuar ? 'is-guaranteed' : ''}">
          <div>
            <div class="coupon-card-top">
              <span class="coupon-badge">${escapeHTML(c.badge)}</span>
              <span class="coupon-platform ${platformClass}">${escapeHTML(c.platform)}</span>
            </div>

            <div class="coupon-headline">${escapeHTML(c.discountHeadline)}</div>
            <div class="coupon-desc">${escapeHTML(c.description)}</div>

            ${c.warningNote ? `
              <div class="coupon-warning-box ${isGuar ? 'guaranteed' : ''}">
                ${escapeHTML(c.warningNote)}
              </div>
            ` : ''}

            <div class="coupon-conditions">
              <div class="condition-item">
                <span>📌</span>
                <span>Min Order: <strong>₹${c.minOrder}</strong></span>
              </div>
              <div class="condition-item">
                <span>💳</span>
                <span>Payment: <strong>${escapeHTML(c.paymentMethod)}</strong></span>
              </div>
              <div class="condition-item">
                <span>⏱️</span>
                <span>Validity: <strong>${escapeHTML(c.expiresIn)}</strong></span>
              </div>
            </div>
          </div>

          <div>
            <div class="coupon-action-row">
              <div class="coupon-code-pill" onclick="${isGuar ? `showToast('✨ Auto-Applied Deal! Pre-applied on the restaurant menu.')` : `copyCouponCode('${escapeHTML(c.code)}', '${escapeHTML(c.platform)}', ${c.discountPercent || c.discountAmount || 60})`}" title="${isGuar ? 'Direct Deal - No Code Needed' : 'Click to copy code'}">
                <span>${escapeHTML(c.code)}</span>
                <span class="copy-label">${isGuar ? '✨ Direct Deal' : '📋 Copy'}</span>
              </div>
              <a href="${c.appUrl}" target="_blank" class="open-app-btn" onclick="addPersonalSavings(${c.discountAmount || 75})">
                <span>${isGuar ? 'Avail Deal' : `Open ${escapeHTML(c.platform)}`}</span>
                <span>↗</span>
              </a>
            </div>

            <div class="coupon-footer">
              <div class="success-stat">
                <span>🟢</span>
                <span>${c.successRate}% Success</span>
              </div>
              <div class="vote-actions">
                <button class="vote-btn" onclick="voteCoupon('${c.id}', 'up', this)" title="Working">
                  👍 <span class="vote-count">${savedUpvotes}</span>
                </button>
                <button class="vote-btn" onclick="voteCoupon('${c.id}', 'down', this)" title="Report expired">
                  👎
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  couponFilterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      couponFilterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentCouponFilter = tab.dataset.filter;
      renderCoupons();
    });
  });

  renderCoupons();

  // Copy coupon handler
  window.copyCouponCode = function(code, platform, approxSavings = 60) {
    addPersonalSavings(approxSavings);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        showToast(`Code "${code}" copied! Open ${platform} to save ~₹${approxSavings}.`);
      }).catch(() => {
        fallbackCopy(code, platform, approxSavings);
      });
    } else {
      fallbackCopy(code, platform, approxSavings);
    }
  };

  function fallbackCopy(code, platform, approxSavings) {
    const el = document.createElement("textarea");
    el.value = code;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    showToast(`Code "${code}" copied! Open ${platform} to save ~₹${approxSavings}.`);
  }

  // Community vote handler
  window.voteCoupon = function(id, type, btn) {
    if (type === "up") {
      const countSpan = btn.querySelector(".vote-count");
      let current = parseInt(countSpan.textContent) || 0;
      current += 1;
      countSpan.textContent = current;
      localStorage.setItem(`vote_up_${id}`, current);
      btn.style.color = "var(--savings-dark)";
      btn.style.borderColor = "var(--savings-green)";
      showToast("✅ Thank you! Working coupon vote recorded.");
    } else {
      btn.style.color = "var(--primary-red)";
      btn.style.borderColor = "var(--primary-red)";
      showToast("⚠️ Reported! Tip: Check '✨ Guaranteed Deals' for zero coupon hassle.");
    }
  };

  // ==========================================
  // 8. CITY SWITCHER
  // ==========================================
  const cities = ["Ludhiana", "Delhi NCR", "Chandigarh", "Mumbai", "Bengaluru", "Jaipur", "Lucknow"];
  let cityIndex = 0;

  if (citySelectorBtn) {
    citySelectorBtn.addEventListener("click", () => {
      cityIndex = (cityIndex + 1) % cities.length;
      if (currentCityLabel) currentCityLabel.textContent = cities[cityIndex];
      showToast(`Location updated to ${cities[cityIndex]}! Local restaurant rates reloaded.`);
      if (selectedDish) {
        renderDishFaceoff(selectedDish);
      }
      renderComparison();
    });
  }

  // ==========================================
  // 9. LIVE SAVINGS TICKER SIMULATION
  // ==========================================
  let baseOrders = 1540;
  let baseSavings = 215000;
  setInterval(() => {
    baseOrders += Math.floor(Math.random() * 2) + 1;
    baseSavings += Math.floor(Math.random() * 120) + 40;
    const statElem = document.getElementById("liveSavingsStat");
    if (statElem) {
      statElem.textContent = `⚡ ${baseOrders.toLocaleString('en-IN')}+ foodies saved ₹${baseSavings.toLocaleString('en-IN')} across India today!`;
    }
  }, 9000);
});
