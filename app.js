// Foodie Hu Mai - Client Application Logic
// Ultra-Simple 6-Year-Old Friendly Interface + CashKaro-Style Guided Order Assistant

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // DOM ELEMENT REFERENCES
  // ==========================================

  // Tab Content Shells
  const tabContentFood = document.getElementById("tabContentFood");
  const tabContentCompare = document.getElementById("tabContentCompare");
  const tabContentDeals = document.getElementById("tabContentDeals");

  // Tab Buttons
  const navTabs = document.querySelectorAll(".simple-tabs .nav-tab");
  const mobileBottomTabs = document.querySelectorAll(".mobile-app-bottom-bar .mobile-bottom-tab");
  const brandHomeBtn = document.getElementById("brandHomeBtn");
  const howItWorksBtn = document.getElementById("howItWorksBtn");

  // Food Picker Elements
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

  // Hot Deals & Coupons Elements
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

  // Mobile Sticky Bar
  const mobileStickyBar = document.getElementById("mobileStickyBar");
  const stickyWinnerBadge = document.getElementById("stickyWinnerBadge");
  const stickyPriceDisplay = document.getElementById("stickyPriceDisplay");
  const stickyActionBtn = document.getElementById("stickyActionBtn");

  // Order Assistant Modal Elements
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

  // Passbook Modal Elements
  const passbookModal = document.getElementById("passbookModal");
  const passbookCloseBtn = document.getElementById("passbookCloseBtn");
  const passbookTotalDisplay = document.getElementById("passbookTotalDisplay");
  const pbOrdersCount = document.getElementById("pbOrdersCount");
  const pbFeeSaved = document.getElementById("pbFeeSaved");
  const pbLevelBadge = document.getElementById("pbLevelBadge");
  const passbookShareBtn = document.getElementById("passbookShareBtn");

  // State Variables
  let currentTab = "food";
  let currentCouponFilter = "guaranteed";
  let currentDealCategory = "all";
  let selectedDish = (typeof DISHES_DATA !== "undefined" && DISHES_DATA.length > 0) ? DISHES_DATA[0] : null;

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
  // 1. SIMPLE 3-TAB SWITCHER (ULTRA-EASY NAV)
  // ==========================================
  window.switchTab = function(tabName, scrollUp = true) {
    currentTab = tabName;

    // Toggle Content Shells
    if (tabContentFood) tabContentFood.style.display = (tabName === "food") ? "block" : "none";
    if (tabContentCompare) tabContentCompare.style.display = (tabName === "compare") ? "block" : "none";
    if (tabContentDeals) tabContentDeals.style.display = (tabName === "deals") ? "block" : "none";

    // Update Top Nav Tabs
    navTabs.forEach(tab => {
      if (tab.dataset.tab === tabName) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    // Update Mobile Bottom Bar Tabs
    mobileBottomTabs.forEach(tab => {
      if (tab.dataset.tab === tabName) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    if (scrollUp) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Bind Top Nav Tabs
  navTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      switchTab(tab.dataset.tab, false);
    });
  });

  // Bind Mobile Bottom Tabs
  mobileBottomTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      switchTab(tab.dataset.tab, false);
    });
  });

  // Brand Logo Click -> Reset to Khana Chuno
  if (brandHomeBtn) {
    brandHomeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      switchTab("food", true);
    });
  }

  // How it works button
  if (howItWorksBtn) {
    howItWorksBtn.addEventListener("click", () => {
      showToast("💡 3 Simple Steps: 1. Khana Chuno ➔ 2. Sabse Sasta App Dekho ➔ 3. 1-Tap me Order karke ₹100+ Bachao!");
    });
  }

  // ==========================================
  // 2. MERI BACHAT PASSBOOK (LOCALSTORAGE)
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
      const shareText = `Maine Foodie Hu Mai app se apne food orders par ₹${currentSavings} bachaye! Check karo yahan: https://foodie-hu-mai.vercel.app`;
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
  // 3. CASHKARO-STYLE 3-STEP ORDER ASSISTANT MODAL
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

    // Platform Icon
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
    if (cartGuideSubtitle) cartGuideSubtitle.textContent = `${restaurant} • Real Menu Price vs Net Checkout Bill`;
    if (cartGuideMenuPrice) cartGuideMenuPrice.textContent = `₹${menuPrice}`;
    if (cartGuideDiscount) cartGuideDiscount.textContent = discount > 0 ? `-₹${discount}` : "Pre-Applied";
    if (cartGuideCodePill) cartGuideCodePill.textContent = effectiveCode ? `Code: ${effectiveCode}` : "✨ Auto-Discount";
    if (cartGuideFinalPrice) cartGuideFinalPrice.textContent = `₹${finalPrice}`;
    if (cartGuideCouponText) cartGuideCouponText.textContent = effectiveCode;

    if (cartGuideStep1Text) {
      cartGuideStep1Text.innerHTML = `${platform} open hone par menu rate (<strong>₹${menuPrice}</strong>) dikhega. Pehle dish ko <em>"Add to Cart"</em> karein.`;
    }

    if (cartGuideStep3Text) {
      if (pLower.includes("domino")) {
        cartGuideStep3Text.innerHTML = `Domino's cart me code <strong>${effectiveCode}</strong> paste karein ya Everyday Value deal chunein. Bill turant gir jayega!`;
      } else if (pLower.includes("swiggy")) {
        cartGuideStep3Text.innerHTML = `Swiggy cart me code <strong>${effectiveCode}</strong> paste karein. Bill turant <strong>₹${menuPrice} se girkar ₹${finalPrice}</strong> ho jayega!`;
      } else if (pLower.includes("zomato")) {
        cartGuideStep3Text.innerHTML = `Zomato checkout par promo code <strong>${effectiveCode}</strong> apply karein aur ₹${discount} bachat paayein!`;
      } else {
        cartGuideStep3Text.innerHTML = `Cart me code paste karte hi bill turant <strong>₹${menuPrice} se girkar ₹${finalPrice}</strong> ho jayega!`;
      }
    }

    if (cartGuideActionText) {
      cartGuideActionText.textContent = `Proceed to ${platform} (Save ₹${discount > 0 ? discount : 60}) ↗`;
    }
    if (cartGuideActionBtn) cartGuideActionBtn.href = deepLink || "#";

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
          showToast(`✅ Code "${code}" clipboard me copy ho gaya!`);
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
  // 4. STEP 1: GIANT FOOD CARD PICKER & STEP 2: WINNER ARENA
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

    // Mobile sticky bar update
    if (mobileStickyBar && stickyWinnerBadge && stickyPriceDisplay && stickyActionBtn) {
      mobileStickyBar.style.display = "block";
      stickyWinnerBadge.textContent = `👑 SABSE SASTA: ${comparison.winner.toUpperCase()}`;
      stickyPriceDisplay.textContent = `₹${winnerObj.finalPrice} Net Bill (Save ₹${comparison.totalSaved})`;
      stickyActionBtn.onclick = () => {
        openOrderGuide(winnerObj.promo ? winnerObj.promo.code : "BESTDEAL", dish.name, comparison.winner, winnerObj.gross || winnerObj.base, winnerObj.finalPrice, winnerObj.deepLink);
      };
    }

    const couponOptions = [
      { code: "", label: "⚡ Auto-Best Discount" },
      { code: "EDV99", label: "EDV99 (Everyday Value 2 Pizzas @ ₹99)" },
      { code: "DOMNEW", label: "DOMNEW (Domino's Mobile App: Flat ₹100 OFF)" },
      { code: "GET30", label: "GET30 (Domino's Live: Flat ₹30 OFF)" },
      { code: "DOMINOS50", label: "DOMINOS50 (50% OFF Magicpin Domino's)" },
      { code: "TRYNEW", label: "TRYNEW (60% OFF up to ₹120)" },
      { code: "STEALDEAL", label: "STEALDEAL (40% OFF up to ₹100)" },
      { code: "HDFC100", label: "HDFC100 (Flat ₹100 OFF on Cards)" }
    ];

    dishFaceoffCardContainer.innerHTML = `
      <div class="dish-faceoff-card">
        
        <!-- Olympic Winner Highlight Podium Banner -->
        <div class="winner-hero-banner">
          <div class="whb-badge">🥇 100% SABSE SASTA WINNER</div>
          <div class="whb-main-row">
            <div class="whb-left">
              <span class="whb-emoji">${dish.emoji}</span>
              <div>
                <h3 class="whb-title">${comparison.winner}</h3>
                <p class="whb-dish-info">${dish.name} • ${dish.popularRest}</p>
              </div>
            </div>
            <div class="whb-right">
              <div class="whb-price-box">
                <span class="whb-strike">Screen Rate: ₹${winnerObj.gross || winnerObj.base}</span>
                <span class="whb-final">₹${winnerObj.finalPrice} <small>Net Bill</small></span>
              </div>
              <div class="whb-save-tag">Aapka Bachat: Flat ₹${comparison.totalSaved} 🎉</div>
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
            <span>Coupon Badlo &amp; Rate Dekho:</span>
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

        <!-- All Platform Transparent Comparison Cards -->
        <div class="comparison-grid">
          ${comparison.isDominos ? `
          <!-- Domino's Official App -->
          <div class="platform-card ${comparison.dominos.finalPrice === winnerObj.finalPrice ? 'winner' : ''}">
            ${comparison.dominos.finalPrice === winnerObj.finalPrice ? `<div class="winner-crown">👑 1st Choice (Save ₹${comparison.totalSaved})</div>` : ''}
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
          <div class="platform-card ${(comparison.eatsure.finalPrice === winnerObj.finalPrice && comparison.eatsure.serviceable) ? 'winner' : ''}">
            ${(comparison.eatsure.finalPrice === winnerObj.finalPrice && comparison.eatsure.serviceable) ? `<div class="winner-crown">👑 1st Choice (Save ₹${comparison.totalSaved})</div>` : ''}
            <div class="platform-top">
              <div class="platform-brand">
                <span class="brand-dot eatsure"></span>
                <span>EatSure (Direct)</span>
              </div>
              ${!comparison.eatsure.serviceable ? `<span style="font-size:0.7rem;font-weight:700;color:#DC2626;background:#FEE2E2;padding:2px 6px;border-radius:6px;">Metro Only</span>` : ''}
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
            ${comparison.eatsure.serviceable ? `
            <button type="button" class="order-btn eatsure" onclick="openOrderGuide('${comparison.eatsure.promo ? comparison.eatsure.promo.code : 'SURE50'}', '${dish.name.replace(/'/g, "\\'")}', 'EatSure', ${comparison.eatsure.base}, ${comparison.eatsure.finalPrice}, '${comparison.eatsure.deepLink}')">Order on EatSure (₹${comparison.eatsure.finalPrice}) →</button>
            ` : `
            <a href="https://www.swiggy.com/search?query=${encodeURIComponent(dish.name)}" target="_blank" class="order-btn swiggy" style="font-size:0.82rem;">Order via Swiggy (${currentCity}) →</a>
            `}
          </div>
          `}

          <!-- Magicpin -->
          <div class="platform-card ${comparison.magicpin.finalPrice === winnerObj.finalPrice ? 'winner' : ''}">
            ${comparison.magicpin.finalPrice === winnerObj.finalPrice ? `<div class="winner-crown">👑 1st Choice (Save ₹${comparison.totalSaved})</div>` : ''}
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
            ${comparison.swiggy.finalPrice === winnerObj.finalPrice ? `<div class="winner-crown">👑 1st Choice (Save ₹${comparison.totalSaved})</div>` : ''}
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
            ${comparison.zomato.finalPrice === winnerObj.finalPrice ? `<div class="winner-crown">👑 1st Choice (Save ₹${comparison.totalSaved})</div>` : ''}
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
            ${comparison.ondc.finalPrice === winnerObj.finalPrice ? `<div class="winner-crown">👑 1st Choice (Save ₹${comparison.totalSaved})</div>` : ''}
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
        showToast(chosen ? `Coupon "${chosen}" lagaya! Rate update ho gaya.` : "Auto-best discount lag gaya!");
      });
    }
  }

  // Hook up Giant Food Cards
  foodCards.forEach(card => {
    card.addEventListener("click", () => {
      foodCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      const dishId = card.dataset.dishId;
      const amount = parseFloat(card.dataset.amount) || 350;

      if (typeof DISHES_DATA !== "undefined") {
        const match = DISHES_DATA.find(d => d.id === dishId);
        if (match) {
          renderDishFaceoff(match);
          if (dishSearchInput) dishSearchInput.value = match.name;
        }
      }

      if (cartInput) {
        cartInput.value = amount;
      }
      renderComparison();

      // Smooth scroll to faceoff arena
      const arena = document.getElementById("dishFaceoffCardContainer");
      if (arena) {
        arena.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
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
            Khana nahi mila. Custom bill compare karne ke liye 'Bill Compare' tab dekhein!
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
          <span class="dropdown-item-badge">₹${d.magicpinBase || 250}+</span>
        </div>
      `).join("");

      dishDropdown.classList.add("show");

      // Dropdown item click
      dishDropdown.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", () => {
          const dishId = item.dataset.id;
          const dish = DISHES_DATA.find(d => d.id === dishId);
          if (dish) {
            dishSearchInput.value = dish.name;
            dishDropdown.classList.remove("show");
            switchTab("food", false);
            renderDishFaceoff(dish);
            showToast(`Loaded ${dish.name}! Real rates calculated across platforms.`);
          }
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
      dishSearchInput.focus();
    });
  }

  // Initial render of first dish
  if (selectedDish) {
    renderDishFaceoff(selectedDish);
  }

  // ==========================================
  // 5. TAB 2: BILL COMPARATOR ENGINE
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

      const isUnserviceableEatSure = brandClass === "eatsure" && p.serviceable === false;

      return `
        <div class="platform-card ${isWinner ? 'winner' : ''}">
          ${isWinner ? `<div class="winner-crown">👑 SABSE SASTA (SAVE ₹${result.totalSaved})</div>` : ''}
          
          <div class="platform-top">
            <div class="platform-brand">
              <span class="brand-dot ${brandClass}"></span>
              <span>${p.platform}</span>
            </div>
            ${isUnserviceableEatSure ? `<span style="font-size:0.7rem;font-weight:700;color:#DC2626;background:#FEE2E2;padding:2px 6px;border-radius:6px;">Metro Only</span>` : 
              (p.promoCode !== "None" ? `<span style="font-size:0.75rem;font-weight:700;color:var(--savings-dark);">Code Applied</span>` : '')}
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
            ${isUnserviceableEatSure ? `
              <div style="font-size:0.75rem;color:#DC2626;margin-top:6px;line-height:1.35;background:rgba(239,68,68,0.1);padding:6px 8px;border-radius:8px;">
                ⚠️ <strong>${currentCity} Notice:</strong> EatSure standalone direct app sirf Metro cities (Delhi/Mumbai/Blr) me deliver karta hai. ${currentCity} me yeh dishes Swiggy/Zomato pe milti hain!
              </div>
            ` : ''}
          </div>

          ${p.promoCode !== "None" ? `
            <div class="applied-coupon-pill">
              🎉 Auto-applied: <strong>${p.promoCode}</strong> (${p.promoHeadline})
            </div>
          ` : `
            <div class="applied-coupon-pill" style="border-color:#E2E8F0;background:#F8FAFC;color:var(--text-muted)">
              ℹ️ Normal Rates (No min coupon matched)
            </div>
          `}

          ${isUnserviceableEatSure ? `
            <a href="https://www.swiggy.com/search?query=behrouz+biryani" target="_blank" class="order-btn swiggy" style="font-size:0.82rem;">
              <span>Order via Swiggy (${currentCity}) →</span>
            </a>
          ` : `
            <button type="button" class="order-btn ${brandClass}" onclick="openOrderGuide('${p.promoCode !== 'None' ? p.promoCode : 'BESTDEAL'}', 'Custom Bill (₹${amount})', '${p.platform.split(' ')[0]}', ${p.base}, ${p.finalPrice}, '${p.deepLink}')">
              <span>Order on ${p.platform.split(' ')[0]} (₹${p.finalPrice}) →</span>
            </button>
          `}
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
    showToast(`Bill set to ₹${amt}! Rates calculated.`);
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
  // 6. TAB 3: SUPER DEALS (50%-60% OFF)
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
  // 7. VERIFIED PROMO CODES HUB & COMMUNITY VOTES
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
              <div class="coupon-code-pill" onclick="${isGuar ? `showToast('✨ Auto-Applied Deal! Menu me pehle se laga hua hai.')` : `copyCouponCode('${escapeHTML(c.code)}', '${escapeHTML(c.platform)}', ${c.discountPercent || c.discountAmount || 60})`}" title="${isGuar ? 'Direct Deal - No Code Needed' : 'Click to copy code'}">
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
      showToast("✅ Shukriya! Working coupon vote recorded.");
    } else {
      btn.style.color = "var(--primary-red)";
      btn.style.borderColor = "var(--primary-red)";
      showToast("⚠️ Note: '✨ Guaranteed Deals' me bina coupon code dale discount milta hai!");
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
      statElem.textContent = `⚡ ${baseOrders.toLocaleString('en-IN')}+ logon ne aaj ₹${baseSavings.toLocaleString('en-IN')} bachaye!`;
    }
  }, 9000);

  // Default: Start on 'food' tab
  switchTab("food", false);
});
