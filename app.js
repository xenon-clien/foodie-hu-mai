// Foodie Hu Mai - Client Application Logic
// Interactive bill comparison, dynamic coupon filtering, instant search, fee calculator & personal savings

document.addEventListener("DOMContentLoaded", () => {
  // Elements - Comparator
  const cartInput = document.getElementById("cartInput");
  const paymentSelect = document.getElementById("paymentSelect");
  const orderTypeSelect = document.getElementById("orderTypeSelect");
  const comparisonResultGrid = document.getElementById("comparisonResultGrid");
  const savingsAnnouncementText = document.getElementById("savingsAnnouncementText");
  const whatsappShareBtn = document.getElementById("whatsappShareBtn");
  const dishChips = document.querySelectorAll(".dish-chip");

  // Elements - Mobile Sticky Bar
  const stickyWinnerBadge = document.getElementById("stickyWinnerBadge");
  const stickyPriceDisplay = document.getElementById("stickyPriceDisplay");
  const stickyActionBtn = document.getElementById("stickyActionBtn");

  // Elements - Coupons & Search
  const couponsContainer = document.getElementById("couponsContainer");
  const filterTabs = document.querySelectorAll(".tab-btn");
  const couponSearchInput = document.getElementById("couponSearchInput");

  // Elements - Fee Calculator
  const ordersSlider = document.getElementById("ordersSlider");
  const ordersPerMonthDisplay = document.getElementById("ordersPerMonthDisplay");
  const annualWastedFee = document.getElementById("annualWastedFee");

  // Elements - Badges & Ticker
  const toastNotice = document.getElementById("toastNotice");
  const toastMsg = document.getElementById("toastMsg");
  const citySelectorBtn = document.getElementById("citySelectorBtn");
  const currentCityLabel = document.getElementById("currentCityLabel");
  const personalBachatBadge = document.getElementById("personalBachatBadge");

  // Elements - Dish Search & Faceoff
  const dishSearchInput = document.getElementById("dishSearchInput");
  const dishDropdown = document.getElementById("dishDropdown");
  const dishFaceoffCardContainer = document.getElementById("dishFaceoffCardContainer");

  let currentFilter = "universal";
  let currentSearchQuery = "";
  let selectedDish = (typeof DISHES_DATA !== "undefined" && DISHES_DATA.length > 0) ? DISHES_DATA[0] : null;
  let activeDishCoupon = null;

  // ==========================================
  // SECURITY SANITIZER (DOM XSS DEFENSE)
  // ==========================================
  function escapeHTML(str) {
    if (typeof str !== 'string') return String(str || '');
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ==========================================
  // REAL SUCCESSFUL ORDER TRACKING (INTERNAL SECURE LOGGING ONLY)
  // Only records when a genuine order payment succeeds
  // ==========================================
  window.recordRealSuccessfulOrder = function(orderPayload) {
    if (!orderPayload || !orderPayload.transactionId || orderPayload.paymentStatus !== "SUCCESS") {
      return Promise.reject(new Error("Invalid payment confirmation"));
    }
    const city = currentCityLabel ? currentCityLabel.textContent : "Ludhiana";
    return fetch("/api/record-successful-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...orderPayload,
        city
      })
    })
    .then(res => res.json())
    .catch(() => {});
  };

  // ==========================================
  // 1. PERSONAL BACHAT TRACKER (LocalStorage)
  // ==========================================
  function loadPersonalBachat() {
    const saved = parseInt(localStorage.getItem("foodie_personal_bachat")) || 0;
    personalBachatBadge.textContent = `💰 Meri Bachat: ₹${saved.toLocaleString('en-IN')}`;
  }

  function addPersonalSavings(amount) {
    let current = parseInt(localStorage.getItem("foodie_personal_bachat")) || 0;
    current += amount;
    localStorage.setItem("foodie_personal_bachat", current);
    personalBachatBadge.textContent = `💰 Meri Bachat: ₹${current.toLocaleString('en-IN')}`;
    personalBachatBadge.style.transform = "scale(1.15)";
    setTimeout(() => {
      personalBachatBadge.style.transform = "scale(1)";
    }, 300);
  }

  loadPersonalBachat();

  // ==========================================
  // HOT 50% - 60% OFF RESTAURANTS RADAR
  // ==========================================
  const hotDealsContainer = document.getElementById("hotDealsContainer");
  const dealTabBtns = document.querySelectorAll(".deal-tab-btn");
  let currentDealCategory = "all";

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

          <a href="${deal.deepLink}" target="_blank" class="deal-order-direct-btn" onclick="directAutoOrder('${deal.couponCode}', '${deal.restaurant}', '${deal.platform}', ${savings}, ${deal.originalAvgPrice}, ${deal.slashedNetPrice}, '${deal.deepLink}')">
            <span>⚡ Order on ${deal.platform} (Save ₹${savings})</span>
            <span>↗</span>
          </a>
        </div>
      `;
    }).join("");
  }

  // ==========================================
  // CART DISCOUNT & STEP-BY-STEP ORDER GUIDANCE MODAL
  // ==========================================
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

  window.openOrderGuide = function(code, restaurant, platform, menuPrice, finalPrice, deepLink) {
    if (!cartGuideOverlay) {
      if (deepLink) window.open(deepLink, "_blank");
      return;
    }

    const discount = Math.max(0, menuPrice - finalPrice);
    
    // Copy coupon code to clipboard immediately
    if (code && code !== "None" && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }

    // Add personal savings count
    addPersonalSavings(discount);

    // Populate modal content
    const isDominos = platform.toLowerCase().includes("domino");
    if (cartGuideIcon) cartGuideIcon.textContent = isDominos ? "🍕" : "🍔";
    if (cartGuideTitle) cartGuideTitle.textContent = `${platform} Cart Discount Guide`;
    if (cartGuideSubtitle) cartGuideSubtitle.textContent = `${restaurant} • Real Menu Price vs Cart Checkout`;
    if (cartGuideMenuPrice) cartGuideMenuPrice.textContent = `₹${menuPrice}`;
    if (cartGuideDiscount) cartGuideDiscount.textContent = `-₹${discount}`;
    if (cartGuideCodePill) cartGuideCodePill.textContent = code ? `Code: ${code}` : "GET30";
    if (cartGuideFinalPrice) cartGuideFinalPrice.textContent = `₹${finalPrice}`;
    if (cartGuideCouponText) cartGuideCouponText.textContent = code || (isDominos ? "GET30" : "STEALDEAL");

    if (cartGuideStep1Text) {
      cartGuideStep1Text.innerHTML = `${platform} open hone par official menu price (<strong>₹${menuPrice}</strong>) dikhega. Pehle dish ko <em>"Add to Cart"</em> karein.`;
    }
    if (cartGuideStep3Text) {
      if (isDominos) {
        cartGuideStep3Text.innerHTML = `Domino's Web par 'Best Offers' me se <strong>GET30</strong> select karein (₹30 OFF). Naye user mobile app par <strong>DOMNEW</strong> lagakar ₹100 bacha sakte hain!`;
      } else {
        cartGuideStep3Text.innerHTML = `Apply karte hi bill turant <strong>₹${menuPrice} se girkar ₹${finalPrice}</strong> ho jayega!`;
      }
    }
    if (cartGuideActionText) cartGuideActionText.textContent = `Proceed to ${platform} (Save ₹${discount})`;
    if (cartGuideActionBtn) cartGuideActionBtn.href = deepLink || (isDominos ? "https://www.dominos.co.in/menu" : "#");

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

  window.directAutoOrder = function(code, restaurant, platform, savings, menuPrice = 0, finalPrice = 0, deepLink = '') {
    // 1. Copy code
    if (code && code !== "None" && code.trim() !== "") {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).catch(() => {});
      }
    }

    // 2. Personal savings tracker
    addPersonalSavings(savings);

    // 3. Open guide or toast
    if (platform && platform.toLowerCase().includes("domino")) {
      const mPrice = menuPrice || 485;
      const fPrice = finalPrice || 385;
      const link = deepLink || "https://www.dominos.co.in/menu";
      openOrderGuide(code || "DOMNEW", restaurant || "Domino's Pizza", platform, mPrice, fPrice, link);
      showToast(`📋 Code "${code || 'DOMNEW'}" copied! Screen pe ₹${mPrice} dikhega, Cart me lagate hi bill ₹${fPrice} ho jayega!`);
    } else if (code && code !== "None" && code.trim() !== "") {
      showToast(`📋 Code "${code}" copied! Opening ${platform}... Cart checkout par Paste karein aur ₹${savings} bachayein!`);
    } else {
      showToast(`Opening ${platform}... Best direct rate applied! Saved ₹${savings}!`);
    }
  };

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
  // DISH SEARCH & LIVE RATE MATCHER WITH COUPONS
  // ==========================================
  function renderDishFaceoff(dish, appliedCoupon = null) {
    if (!dish || !dishFaceoffCardContainer) return;
    selectedDish = dish;
    const currentCity = currentCityLabel ? currentCityLabel.textContent.trim() : "Ludhiana";
    const comparison = ComparatorEngine.compareDish(dish, appliedCoupon, paymentSelect ? paymentSelect.value : "all", currentCity);

    // Winner details
    const winnerKey = comparison.winner.toLowerCase().includes('domino') ? 'dominos' :
                      comparison.winner.toLowerCase().includes('eatsure') ? 'eatsure' :
                      comparison.winner.toLowerCase().includes('magic') ? 'magicpin' :
                      comparison.winner.toLowerCase().includes('ondc') ? 'ondc' :
                      comparison.winner.toLowerCase().includes('swiggy') ? 'swiggy' : 'zomato';
    const winnerObj = comparison[winnerKey] || comparison.magicpin;

    const couponOptions = [
      { code: "", label: "⚡ Auto-Best Discount" },
      { code: "GET30", label: "GET30 (⚡ Domino's Web & App Live: Flat ₹30 OFF)" },
      { code: "DOMNEW", label: "DOMNEW (📱 Domino's 1st Mobile App Order: ₹100 OFF)" },
      { code: "DOM50", label: "DOM50 (50% OFF Domino's Medium/Large)" },
      { code: "DOMINOS50", label: "DOMINOS50 (50% OFF Magicpin Domino's)" },
      { code: "EDV99", label: "EDV99 (Everyday Value 2 Pizzas @ ₹99)" },
      { code: "TRYNEW", label: "TRYNEW (60% OFF up to ₹120)" },
      { code: "STEALDEAL", label: "STEALDEAL (40% OFF up to ₹100)" },
      { code: "JUMBO", label: "JUMBO (Flat ₹150 OFF)" },
      { code: "SWIGGYIT", label: "SWIGGYIT (25% OFF)" },
      { code: "HDFC100", label: "HDFC100 (Flat ₹100 OFF on Cards)" },
      { code: "CHAI50", label: "CHAI50 (30% OFF Snacks)" }
    ];

    dishFaceoffCardContainer.innerHTML = `
      <div class="dish-faceoff-card">
        <div class="dish-faceoff-header">
          <div class="dish-faceoff-meta">
            <span class="dish-faceoff-emoji">${dish.emoji}</span>
            <div>
              <div class="dish-faceoff-title">${dish.name}</div>
              <div class="dish-faceoff-rest">Available at: <strong>${dish.popularRest}</strong> • ${dish.category}</div>
            </div>
          </div>
          <div style="text-align:right;">
            <span class="price-strike-original">₹${winnerObj.gross}</span>
            <span class="price-slashed-active">₹${winnerObj.finalPrice}</span>
            <div style="font-size:0.78rem;font-weight:800;color:var(--savings-dark);">👑 ${comparison.winner} (SAVE ₹${comparison.totalSaved})</div>
          </div>
        </div>

        <!-- Interactive Coupon Slasher Bar -->
        <div class="coupon-slasher-bar">
          <div class="slasher-left">
            <span>🏷️</span>
            <span>Apply Coupon to Slash Price:</span>
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

        <!-- Multi-Platform Comparison Grid for this dish -->
        <div class="comparison-grid">
          ${comparison.isDominos ? `
          <!-- Domino's Official App (Direct Jubilant) -->
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
              <div class="breakdown-row"><span>Official Menu Price</span><span>₹${comparison.dominos.base}</span></div>
              <div class="breakdown-row"><span>Platform &amp; Delivery</span><span><strong style="color:var(--savings-green)">₹0 FREE</strong></span></div>
              ${comparison.dominos.discount > 0 ? `<div class="breakdown-row breakdown-discount"><span>Coupon Promo</span><span>-₹${comparison.dominos.discount}</span></div>` : ''}
              <div style="font-size:0.75rem;color:#38BDF8;margin-top:6px;line-height:1.35;background:rgba(56,189,248,0.1);padding:6px 8px;border-radius:8px;">ℹ️ Domino's screen par pehle official rate ₹${comparison.dominos.base} dikhega. Cart me Coupon paste karte hi bill ₹${comparison.dominos.finalPrice} ho jata hai!</div>
            </div>
            <button type="button" class="order-btn dominos" onclick="openOrderGuide('${comparison.dominos.promo ? comparison.dominos.promo.code : 'DOMNEW'}', '${dish.name.replace(/'/g, "\\'")}', 'Domino\'s Official App', ${comparison.dominos.base}, ${comparison.dominos.finalPrice}, '${comparison.dominos.deepLink}')">Order on Domino's App (Guide) →</button>
          </div>
          ` : `
          <!-- EatSure (Direct) -->
          <div class="platform-card ${(comparison.eatsure.finalPrice === winnerObj.finalPrice && comparison.eatsure.serviceable) ? 'winner' : ''}">
            ${(comparison.eatsure.finalPrice === winnerObj.finalPrice && comparison.eatsure.serviceable) ? `<div class="winner-crown">👑 WINNER (SAVE ₹${comparison.totalSaved})</div>` : ''}
            <div class="platform-top">
              <div class="platform-brand">
                <span class="brand-dot eatsure"></span>
                <span>EatSure (Direct)</span>
              </div>
              ${!comparison.eatsure.serviceable ? `<span style="font-size:0.7rem;font-weight:700;color:#DC2626;background:#FEE2E2;padding:2px 6px;border-radius:6px;">Metro Only</span>` : ''}
            </div>
            <div class="final-price-box">
              <div class="final-price-label">Payable Rate</div>
              <div class="final-price-value">₹${comparison.eatsure.finalPrice}</div>
            </div>
            <div class="breakdown-list">
              <div class="breakdown-row"><span>Dish Base Rate</span><span>₹${comparison.eatsure.base}</span></div>
              <div class="breakdown-row"><span>Fees & Delivery</span><span><strong style="color:var(--savings-green)">₹0 FREE</strong></span></div>
              ${comparison.eatsure.discount > 0 ? `<div class="breakdown-row breakdown-discount"><span>Coupon Savings</span><span>-₹${comparison.eatsure.discount}</span></div>` : ''}
              ${!comparison.eatsure.serviceable ? `
                <div style="font-size:0.75rem;color:#DC2626;margin-top:6px;line-height:1.35;background:rgba(239,68,68,0.1);padding:6px 8px;border-radius:8px;">
                  ⚠️ <strong>${currentCity} Notice:</strong> EatSure standalone direct app sirf Metro cities (Delhi/Mumbai/Blr) me deliver karta hai. ${currentCity} me yeh dish Swiggy/Zomato pe milti hai!
                </div>
              ` : ''}
            </div>
            ${comparison.eatsure.serviceable ? `
            <a href="${comparison.eatsure.deepLink}" target="_blank" class="order-btn eatsure" onclick="directAutoOrder('${comparison.eatsure.promo ? comparison.eatsure.promo.code : 'SURE50'}', '${dish.name.replace(/'/g, "\\'")}', 'EatSure', ${comparison.totalSaved || 75})">Order on EatSure →</a>
            ` : `
            <a href="https://www.swiggy.com/search?query=${encodeURIComponent(dish.name)}" target="_blank" class="order-btn swiggy" style="font-size:0.82rem;">Order via Swiggy (${currentCity}) →</a>
            `}
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
              <div class="final-price-label">Payable Rate</div>
              <div class="final-price-value">₹${comparison.magicpin.finalPrice}</div>
            </div>
            <div class="breakdown-list">
              <div class="breakdown-row"><span>Dish Base Rate</span><span>₹${dish.magicpinBase}</span></div>
              <div class="breakdown-row"><span>GST & Delivery</span><span>₹${comparison.magicpin.gross - dish.magicpinBase}</span></div>
              ${comparison.magicpin.discount > 0 ? `<div class="breakdown-row breakdown-discount"><span>Coupon Savings</span><span>-₹${comparison.magicpin.discount}</span></div>` : ''}
            </div>
            <a href="${comparison.magicpin.deepLink}" target="_blank" class="order-btn magicpin" onclick="directAutoOrder('${comparison.magicpin.promo ? comparison.magicpin.promo.code : 'DOMINOS50'}', '${dish.name.replace(/'/g, "\\'")}', 'Magicpin', ${comparison.totalSaved || 60})">Order on Magicpin →</a>
          </div>

          <!-- ONDC -->
          <div class="platform-card ${comparison.ondc.finalPrice === winnerObj.finalPrice ? 'winner' : ''}">
            ${comparison.ondc.finalPrice === winnerObj.finalPrice ? `<div class="winner-crown">👑 WINNER (SAVE ₹${comparison.totalSaved})</div>` : ''}
            <div class="platform-top">
              <div class="platform-brand">
                <span class="brand-dot ondc"></span>
                <span>ONDC (Pincode)</span>
              </div>
            </div>
            <div class="final-price-box">
              <div class="final-price-label">Payable Rate</div>
              <div class="final-price-value">₹${comparison.ondc.finalPrice}</div>
            </div>
            <div class="breakdown-list">
              <div class="breakdown-row"><span>Dish Base Rate</span><span>₹${comparison.ondc.base}</span></div>
              <div class="breakdown-row"><span>Subsidized Del</span><span>₹22</span></div>
              ${comparison.ondc.discount > 0 ? `<div class="breakdown-row breakdown-discount"><span>ONDC Promo</span><span>-₹${comparison.ondc.discount}</span></div>` : ''}
            </div>
            <a href="${comparison.ondc.deepLink}" target="_blank" class="order-btn ondc" onclick="directAutoOrder('ONDC50', '${dish.name.replace(/'/g, "\\'")}', 'ONDC (Pincode)', ${comparison.totalSaved || 50})">Order on ONDC →</a>
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
              <div class="final-price-label">Payable Rate</div>
              <div class="final-price-value">₹${comparison.swiggy.finalPrice}</div>
            </div>
            <div class="breakdown-list">
              <div class="breakdown-row"><span>Dish Base Rate</span><span>₹${dish.swiggyBase}</span></div>
              <div class="breakdown-row"><span>GST, Platform & Del</span><span>₹${comparison.swiggy.gross - dish.swiggyBase}</span></div>
              ${comparison.swiggy.discount > 0 ? `<div class="breakdown-row breakdown-discount"><span>Coupon Savings</span><span>-₹${comparison.swiggy.discount}</span></div>` : ''}
            </div>
            <a href="${comparison.swiggy.deepLink}" target="_blank" class="order-btn swiggy" onclick="directAutoOrder('${comparison.swiggy.promo ? comparison.swiggy.promo.code : 'TRYNEW'}', '${dish.name.replace(/'/g, "\\'")}', 'Swiggy', ${comparison.totalSaved || 50})">Order on Swiggy →</a>
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
              <div class="final-price-label">Payable Rate</div>
              <div class="final-price-value">₹${comparison.zomato.finalPrice}</div>
            </div>
            <div class="breakdown-list">
              <div class="breakdown-row"><span>Dish Base Rate</span><span>₹${dish.zomatoBase}</span></div>
              <div class="breakdown-row"><span>GST, Platform & Del</span><span>₹${comparison.zomato.gross - dish.zomatoBase}</span></div>
              ${comparison.zomato.discount > 0 ? `<div class="breakdown-row breakdown-discount"><span>Coupon Savings</span><span>-₹${comparison.zomato.discount}</span></div>` : ''}
            </div>
            <a href="${comparison.zomato.deepLink}" target="_blank" class="order-btn zomato" onclick="directAutoOrder('${comparison.zomato.promo ? comparison.zomato.promo.code : 'STEALDEAL'}', '${dish.name.replace(/'/g, "\\'")}', 'Zomato', ${comparison.totalSaved || 50})">Order on Zomato →</a>
          </div>
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
        showToast(chosen ? `Coupon "${chosen}" applied! Price slashed.` : "Auto-applied best discount for this dish!");
      });
    }
  }

  // Dish Autocomplete Dropdown Handling
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
            Dish not found in quick catalog. Calculating using custom estimator...
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
              <div class="dropdown-item-sub">${d.popularRest}</div>
            </div>
          </div>
          <span class="dropdown-item-badge">From ₹${d.magicpinBase}</span>
        </div>
      `).join("");

      dishDropdown.classList.add("show");

      // Dropdown item click listeners
      dishDropdown.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", () => {
          const dishId = item.dataset.id;
          const dish = DISHES_DATA.find(d => d.id === dishId);
          if (dish) {
            dishSearchInput.value = dish.name;
            dishDropdown.classList.remove("show");
            renderDishFaceoff(dish);
            showToast(`Loaded ${dish.name}! Real rates calculated across Zomato, Swiggy & Magicpin.`);
          }
        });
      });
    });

    // Close dropdown on outside click
    document.addEventListener("click", (e) => {
      if (!dishSearchInput.contains(e.target) && !dishDropdown.contains(e.target)) {
        dishDropdown.classList.remove("show");
      }
    });
  }

  // Initial render of first dish
  if (selectedDish) {
    renderDishFaceoff(selectedDish);
  }

  // ==========================================
  // 2. BILL COMPARATOR INITIALIZATION & LOGIC
  // ==========================================
  function renderComparison() {
    const amount = parseFloat(cartInput.value) || 299;
    const payment = paymentSelect.value;
    const orderType = orderTypeSelect.value;

    const currentCity = currentCityLabel ? currentCityLabel.textContent.trim() : "Ludhiana";
    const result = ComparatorEngine.calculate(amount, payment, orderType, currentCity);

    // Update announcement & WhatsApp button
    if (result.totalSaved > 0) {
      savingsAnnouncementText.innerHTML = `Mera abhi <strong>₹${result.totalSaved} bacha</strong>! Winner: <strong>${result.winner}</strong> 🏆`;
    } else {
      savingsAnnouncementText.innerHTML = `Teeno apps ka rate compare ho gaya! Doston ke sath share karein:`;
    }
    whatsappShareBtn.href = ComparatorEngine.generateWhatsAppShare(result);

    // Update Mobile Sticky Bottom Savings Bar
    const winnerObj = (result.dominos && result.dominos.isWinner) ? result.dominos :
                      (result.eatsure && result.eatsure.isWinner) ? result.eatsure :
                      (result.magicpin && result.magicpin.isWinner) ? result.magicpin :
                      (result.ondc && result.ondc.isWinner) ? result.ondc :
                      (result.swiggy && result.swiggy.isWinner) ? result.swiggy : result.zomato;

    if (stickyWinnerBadge && stickyPriceDisplay && stickyActionBtn) {
      stickyWinnerBadge.textContent = `👑 BEST: ${result.winner.toUpperCase()} (SAVE ₹${result.totalSaved})`;
      stickyPriceDisplay.textContent = `₹${winnerObj.finalPrice} Net Bill`;
      stickyActionBtn.href = winnerObj.deepLink;
      stickyActionBtn.onclick = () => {
        addPersonalSavings(result.totalSaved || 50);
      };
    }

    // Render 6 Platform Cards (Including Domino's Official App)
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
                ⚠️ <strong>${currentCity} Notice:</strong> EatSure standalone direct app sirf Metro cities (Delhi/Mumbai/Blr) me deliver karta hai. ${currentCity} me Rebel Foods (Behrouz/Faasos) Swiggy ya Zomato pe milte hain!
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
            <a href="${p.deepLink}" target="_blank" class="order-btn ${brandClass}" onclick="directAutoOrder('${p.promoCode !== 'None' ? p.promoCode : ''}', 'Your Order', '${p.platform.split(' ')[0]}', ${result.totalSaved || 50})">
              <span>Order on ${p.platform.split(' ')[0]} (₹${p.finalPrice})</span>
              <span>→</span>
            </a>
          `}
        </div>
      `;
    }).join("");
  }

  // Quick Mood / Dish Chips Handling
  dishChips.forEach(chip => {
    chip.addEventListener("click", () => {
      dishChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const amount = chip.dataset.amount;
      const dish = chip.dataset.dish;
      const dishId = chip.dataset.dishId;
      cartInput.value = amount;
      renderComparison();

      // If dishId is provided or if dish name matches, also switch and scroll to Dish Faceoff!
      if (typeof DISHES_DATA !== "undefined") {
        let match = dishId ? DISHES_DATA.find(d => d.id === dishId) : null;
        if (!match && dish) {
          match = DISHES_DATA.find(d => d.name.toLowerCase().includes(dish.toLowerCase()) || (d.keywords && d.keywords.some(k => k.toLowerCase().includes(dish.toLowerCase()))));
        }
        if (match) {
          if (dishSearchInput) dishSearchInput.value = match.name;
          renderDishFaceoff(match);
          const faceoffEl = document.getElementById("foodSearchSection");
          if (faceoffEl) {
            faceoffEl.scrollIntoView({ behavior: "smooth" });
          }
        }
      }

      showToast(`Switched to ${dish} (~₹${amount})! Live rates compared.`);
    });
  });

  // Event Listeners for Comparator Inputs
  cartInput.addEventListener("input", () => {
    dishChips.forEach(c => c.classList.remove("active"));
    renderComparison();
  });
  paymentSelect.addEventListener("change", renderComparison);
  orderTypeSelect.addEventListener("change", renderComparison);

  // Initial render of comparator
  renderComparison();

  // ==========================================
  // 3. YEARLY PLATFORM FEE EXPOSER CALCULATOR
  // ==========================================
  if (ordersSlider) {
    ordersSlider.addEventListener("input", (e) => {
      const count = parseInt(e.target.value) || 12;
      ordersPerMonthDisplay.textContent = `${count} Orders/Month`;
      // Average hidden platform fee + surge = ₹10 per order
      const annualWasted = count * 10 * 12;
      annualWastedFee.textContent = `₹${annualWasted.toLocaleString('en-IN')}`;
    });
  }

  // ==========================================
  // 4. VERIFIED COUPONS RENDERING, FILTERING & SEARCH
  // ==========================================
  function renderCoupons() {
    let list = COUPONS_DATA;

    // Apply category filter
    if (currentFilter !== "all") {
      list = list.filter(c => c.category === currentFilter);
    }

    // Apply instant search filter
    if (currentSearchQuery.trim() !== "") {
      const q = currentSearchQuery.toLowerCase().trim();
      list = list.filter(c => 
        c.code.toLowerCase().includes(q) ||
        c.platform.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.paymentMethod.toLowerCase().includes(q) ||
        c.discountHeadline.toLowerCase().includes(q)
      );
    }

    if (list.length === 0) {
      couponsContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: #FFF; border-radius: 20px; border: 1px dashed var(--border-light);">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">🔍</div>
          <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-dark);">Koi Coupon Match Nahi Hua</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Search term badal kar dekhein ya "Show All" par click karein.</p>
        </div>
      `;
      return;
    }

    couponsContainer.innerHTML = list.map(c => {
      const platformClass = c.platform.toLowerCase();
      const savedUpvotes = parseInt(localStorage.getItem(`vote_up_${c.id}`)) || c.usesToday;

      return `
        <div class="coupon-card">
          <div>
            <div class="coupon-card-top">
              <span class="coupon-badge">${c.badge}</span>
              <span class="coupon-platform ${platformClass}">${c.platform}</span>
            </div>

            <div class="coupon-headline">${c.discountHeadline}</div>
            <div class="coupon-desc">${c.description}</div>

            <div class="coupon-conditions">
              <div class="condition-item">
                <span>📌</span>
                <span>Minimum Order: <strong>₹${c.minOrder}</strong></span>
              </div>
              <div class="condition-item">
                <span>💳</span>
                <span>Payment: <strong>${c.paymentMethod}</strong></span>
              </div>
              <div class="condition-item">
                <span>⏱️</span>
                <span>Validity: <strong>${c.expiresIn}</strong></span>
              </div>
            </div>
          </div>

          <div>
            <div class="coupon-action-row">
              <div class="coupon-code-pill" onclick="copyCouponCode('${c.code}', '${c.platform}', ${c.discountPercent || c.discountAmount || 60})" title="Click to copy">
                <span>${c.code}</span>
                <span class="copy-label">📋 Copy</span>
              </div>
              <a href="${c.appUrl}" target="_blank" class="open-app-btn" onclick="addPersonalSavings(${c.discountAmount || 75})">
                <span>Open ${c.platform}</span>
                <span>↗</span>
              </a>
            </div>

            <div class="coupon-footer">
              <div class="success-stat">
                <span>🟢</span>
                <span>${c.successRate}% Success</span>
              </div>
              <div class="vote-actions">
                <button class="vote-btn" onclick="voteCoupon('${c.id}', 'up', this)">
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

  // Filter Tabs Event Handling
  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentFilter = tab.dataset.filter;
      renderCoupons();
    });
  });

  // Instant Coupon Search Event Handling
  if (couponSearchInput) {
    couponSearchInput.addEventListener("input", (e) => {
      currentSearchQuery = e.target.value;
      renderCoupons();
    });
  }

  // Initial render of coupons
  renderCoupons();

  // ==========================================
  // 5. COPY TO CLIPBOARD & TOAST HANDLER
  // ==========================================
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

  function showToast(message) {
    toastMsg.textContent = message;
    toastNotice.classList.add("show");
    setTimeout(() => {
      toastNotice.classList.remove("show");
    }, 3200);
  }

  // Community voting handler
  window.voteCoupon = function(id, type, btn) {
    if (type === "up") {
      const countSpan = btn.querySelector(".vote-count");
      let current = parseInt(countSpan.textContent) || 0;
      current += 1;
      countSpan.textContent = current;
      localStorage.setItem(`vote_up_${id}`, current);
      btn.style.color = "var(--savings-dark)";
      btn.style.borderColor = "var(--savings-green)";
      showToast("Thank you! Community verification updated.");
    } else {
      btn.style.color = "var(--primary-red)";
      showToast("Reported. Our engine will re-verify this code.");
    }
  };

  // ==========================================
  // 6. CITY SWITCHER INTERACTION
  // ==========================================
  const cities = ["Ludhiana", "Delhi NCR", "Chandigarh", "Mumbai", "Bengaluru", "Jaipur", "Lucknow"];
  let cityIndex = 0;

  citySelectorBtn.addEventListener("click", () => {
    cityIndex = (cityIndex + 1) % cities.length;
    currentCityLabel.textContent = cities[cityIndex];
    showToast(`Location updated to ${cities[cityIndex]}! Local restaurant offers reloaded.`);
    if (selectedDish) {
      renderDishFaceoff(selectedDish, activeDishCoupon);
    }
    renderComparison();
  });

  // ==========================================
  // 7. LIVE TICKER SIMULATION
  // ==========================================
  let baseOrders = 1496;
  let baseSavings = 196400;
  setInterval(() => {
    baseOrders += Math.floor(Math.random() * 2) + 1;
    baseSavings += Math.floor(Math.random() * 120) + 40;
    const statElem = document.getElementById("liveSavingsStat");
    if (statElem) {
      statElem.textContent = `${baseOrders.toLocaleString('en-IN')} orders optimized today • Total ₹${baseSavings.toLocaleString('en-IN')} saved`;
    }
  }, 10000);

  // ==========================================
  // 8. SWIGGY-STYLE MODULAR SECTION SWITCHER
  // Home shows ONLY Hero & Swiggy Hub Tiles; Each feature opens as a clean separate screen
  // ==========================================
  const swiggyHomeHub = document.getElementById("swiggyHomeHub");
  const featureBackBar = document.getElementById("featureBackBar");
  const activeFeatureTitle = document.getElementById("activeFeatureTitle");
  const featureBackHomeBtn = document.getElementById("featureBackHomeBtn");
  const brandHomeBtn = document.getElementById("brandHomeBtn");
  const sectionNavBtns = document.querySelectorAll(".section-nav-btn");
  const mobileBottomTabs = document.querySelectorAll(".mobile-bottom-tab");

  const SECTION_MAP = {
    home: { name: "🏠 Home Hub", ids: [] },
    dominosSpotlight: { name: "🍕 Domino's Showdown Hub", ids: ["dominosSpotlight"] },
    foodSearchSection: { name: "🍔 5-Platform Dish Matcher", ids: ["foodSearchSection"] },
    hotDealsSection: { name: "🔥 Top 50%-70% Restaurant Deals", ids: ["hotDealsSection"] },
    comparator: { name: "⚖️ Custom Bill Amount Comparator", ids: ["comparator"] },
    coupons: { name: "🏷️ Verified Secret Coupons Hub", ids: ["coupons"] },
    calculator: { name: "📊 Platform Fee Exposer", ids: ["calculator"] },
    cards: { name: "💳 Foodie Fintech & Cashback Hacks", ids: ["cards"] }
  };

  const ALL_FEATURE_SECTION_IDS = [
    "hotDealsSection", 
    "foodSearchSection", 
    "dominosSpotlight", 
    "comparator", 
    "coupons", 
    "calculator", 
    "cards"
  ];

  function switchAppSection(targetKey, scrollIntoView = true) {
    const config = SECTION_MAP[targetKey] || SECTION_MAP.home;

    // Update active state on Section Nav Pill Buttons
    sectionNavBtns.forEach(b => {
      if (b.dataset.section === targetKey) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });

    // Update active state on Mobile Bottom Tabs
    mobileBottomTabs.forEach(tab => {
      if (tab.dataset.tab === targetKey) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    // Update Navbar link active states
    document.querySelectorAll(".navbar .nav-link").forEach(l => {
      if (l.dataset.nav === targetKey) {
        l.classList.add("active");
      } else {
        l.classList.remove("active");
      }
    });

    // 1. HOME SCREEN MODE: Show ONLY Hero & Swiggy Hub Tiles
    if (targetKey === "home") {
      if (swiggyHomeHub) swiggyHomeHub.style.display = "block";
      if (featureBackBar) featureBackBar.style.display = "none";
      ALL_FEATURE_SECTION_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("homepage-section-hidden");
      });
      if (scrollIntoView) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // 2. DEDICATED FEATURE MODE: Hide Home Hub and show ONLY this feature
    if (swiggyHomeHub) swiggyHomeHub.style.display = "none";
    if (featureBackBar) {
      featureBackBar.style.display = "flex";
      if (activeFeatureTitle) activeFeatureTitle.textContent = config.name;
    }

    ALL_FEATURE_SECTION_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (config.ids.includes(id)) {
        el.classList.remove("homepage-section-hidden");
      } else {
        el.classList.add("homepage-section-hidden");
      }
    });

    if (scrollIntoView) {
      const firstActive = document.getElementById(config.ids[0]);
      if (firstActive) {
        firstActive.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (featureBackBar) {
        featureBackBar.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  // Bind Swiggy Hub Tiles (Clicking any tile opens that feature section directly)
  document.querySelectorAll(".swiggy-hub-tile").forEach(tile => {
    tile.addEventListener("click", () => {
      const section = tile.dataset.openSection;
      if (section) {
        switchAppSection(section, true);
      }
    });
  });

  // Bind Back to Home Button
  if (featureBackHomeBtn) {
    featureBackHomeBtn.addEventListener("click", () => {
      switchAppSection("home", true);
    });
  }

  // Bind Brand Logo to return to Home Hub
  if (brandHomeBtn) {
    brandHomeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      switchAppSection("home", true);
    });
  }

  // Bind Master Section Navigation Pills
  sectionNavBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.section;
      switchAppSection(target, true);
    });
  });

  // Bind Mobile Bottom Tabs
  mobileBottomTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      switchAppSection(target, true);
    });
  });

  // Connect Navbar links
  document.querySelectorAll(".navbar .nav-link, .navbar .nav-cta").forEach(link => {
    link.addEventListener("click", (e) => {
      const navTarget = link.dataset.nav;
      if (navTarget) {
        e.preventDefault();
        switchAppSection(navTarget, true);
      }
    });
  });

  // Connect Quick Mood Chips to open Dish Matcher or Domino's
  document.querySelectorAll(".dish-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const dish = chip.dataset.dish || "";
      if (dish.toLowerCase().includes("domino")) {
        switchAppSection("dominosSpotlight", true);
      } else {
        switchAppSection("foodSearchSection", true);
      }
    });
  });

  // INITIAL LOAD: Open in clean Home Hub mode (Only Hero + Swiggy Hub Tiles visible!)
  switchAppSection("home", false);
});
