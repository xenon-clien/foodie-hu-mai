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
  const cgPlatformTip = document.getElementById("cgPlatformTip");
  const cgTipPlatformName = document.getElementById("cgTipPlatformName");
  const cgTipBody = document.getElementById("cgTipBody");
  const cgTipSwitchBox = document.getElementById("cgTipSwitchBox");
  const cgTipSwitchText = document.getElementById("cgTipSwitchText");
  const cgTipSwitchBtn = document.getElementById("cgTipSwitchBtn");

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
    else pIcon = "🍔";

    if (cartGuideIcon) cartGuideIcon.textContent = pIcon;
    if (cartGuideTitle) cartGuideTitle.textContent = `${platform} Order Assistant`;
    if (cartGuideSubtitle) cartGuideSubtitle.textContent = `${restaurant} • Direct Menu Rate: ₹${menuPrice} (App Screen)`;
    if (cartGuideMenuPrice) cartGuideMenuPrice.textContent = `₹${menuPrice}`;
    if (cartGuideDiscount) cartGuideDiscount.textContent = discount > 0 ? `-₹${discount}` : "Pre-Applied";
    if (cartGuideCodePill) cartGuideCodePill.textContent = effectiveCode ? `Code: ${effectiveCode}` : "✨ Auto-Discount";
    if (cartGuideFinalPrice) cartGuideFinalPrice.textContent = `₹${finalPrice}`;
    if (cartGuideCouponText) cartGuideCouponText.textContent = effectiveCode;

    if (cartGuideStep1Text) {
      if (pLower.includes("domino")) {
        cartGuideStep1Text.innerHTML = `Domino's menu khulega. Direct price ~<strong>₹${menuPrice}</strong> dikhega. Dish ko <em>"Add to Cart"</em> karein.`;
      } else {
        cartGuideStep1Text.innerHTML = `Jab ${platform} khulega, screen par direct menu price <strong>₹${menuPrice}</strong> dikhega. Pehle <strong>${escapeHTML(restaurant)}</strong> ko <em>"Add to Cart"</em> karein.`;
      }
    }

    if (cartGuideStep3Text) {
      if (pLower.includes("domino")) {
        cartGuideStep3Text.innerHTML = `Domino's cart me coupon <strong>${effectiveCode}</strong> paste karein ya Everyday Value se bill slash karein!`;
      } else if (pLower.includes("swiggy")) {
        cartGuideStep3Text.innerHTML = `<strong>Offer checkout par lagega:</strong> Swiggy checkout me <strong>'Apply Coupon >'</strong> tap karke <strong>${effectiveCode}</strong> paste karein aur bill <strong>~₹${finalPrice}</strong> ho jayega (Save ₹${discount})!`;
      } else if (pLower.includes("zomato")) {
        cartGuideStep3Text.innerHTML = `<strong>Offer checkout par lagega:</strong> Zomato checkout me <strong>'View All Coupons'</strong> tap karke <strong>${effectiveCode}</strong> paste karein aur bill <strong>~₹${finalPrice}</strong> ho jayega (Save ₹${discount})!`;
      } else {
        cartGuideStep3Text.innerHTML = `Cart checkout me 'Apply Coupon' box me <strong>${effectiveCode}</strong> paste karein aur bill <strong>~₹${finalPrice}</strong> ho jayega!`;
      }
    }

    // Platform Reality Alert & Switcher
    if (cgPlatformTip) {
      const restLower = (restaurant || "").toLowerCase();
      if (pLower.includes("swiggy") || pLower.includes("zomato")) {
        cgPlatformTip.style.display = "block";
        if (cgTipPlatformName) cgTipPlatformName.textContent = platform;
        if (cgTipBody) {
          cgTipBody.innerHTML = `📌 <strong>Direct Price vs Offer:</strong> Jab ${platform} khulega to restaurant screen par direct menu price <strong>₹${menuPrice}</strong> hi dikhega. Offer checkout par apply hota hai — dish add karke checkout me <strong>'Apply Coupon'</strong> par code <strong>${effectiveCode}</strong> paste karein!`;
        }
        if (cgTipSwitchBox && (restLower.includes("domino") || restLower.includes("pizza"))) {
          cgTipSwitchBox.style.display = "flex";
          if (cgTipSwitchText) {
            cgTipSwitchText.innerHTML = `💡 <strong>Avoid ₹382 on Swiggy!</strong> Domino's Official App charges only <strong>₹198</strong> for pizzas with <strong>₹0 platform fee</strong>.`;
          }
          if (cgTipSwitchBtn) {
            cgTipSwitchBtn.href = "https://www.dominos.co.in";
            cgTipSwitchBtn.textContent = "Switch to Domino's App (Save ₹184) ↗";
          }
        } else if (cgTipSwitchBox && (restLower.includes("biryani") || restLower.includes("behrouz") || restLower.includes("faasos"))) {
          cgTipSwitchBox.style.display = "flex";
          if (cgTipSwitchText) {
            cgTipSwitchText.innerHTML = `💡 <strong>EatSure Direct is Cheaper!</strong> EatSure gives Flat 50% - 60% OFF with ₹0 platform fee.`;
          }
          if (cgTipSwitchBtn) {
            cgTipSwitchBtn.href = "https://www.eatsure.com";
            cgTipSwitchBtn.textContent = "Switch to EatSure (Save ₹150) ↗";
          }
        } else if (cgTipSwitchBox) {
          cgTipSwitchBox.style.display = "none";
        }
      } else {
        cgPlatformTip.style.display = "none";
      }
    }

    if (cartGuideActionText) {
      cartGuideActionText.textContent = `⚡ Open ${platform} (₹${menuPrice} Direct Menu Price) ↗`;
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
      cartGuideActionTextBottom.textContent = `Proceed to ${platform} (₹${menuPrice} Direct Price) ↗`;
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

  // Universal Click Listener for all Data-Triggered Order Buttons (100% immune to quote/apostrophe errors)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-order-trigger]");
    if (!btn) return;
    const code = btn.getAttribute("data-code") || "BESTDEAL";
    const rest = btn.getAttribute("data-rest") || "Your Dish";
    const platform = btn.getAttribute("data-platform") || "Food App";
    const menu = parseFloat(btn.getAttribute("data-menu")) || 0;
    const finalPrice = parseFloat(btn.getAttribute("data-final")) || 0;
    const link = btn.getAttribute("data-link") || "https://www.dominos.co.in/menu";
    openOrderGuide(code, rest, platform, menu, finalPrice, link);
  });

  // ==========================================
  // 4. LIVE DISH FACEOFF ARENA (USER-TRIGGERED)
  // ==========================================
  function renderDishFaceoff(dish, appliedCoupon = null) {
    if (!dish || !dishFaceoffCardContainer) return;
    selectedDish = dish;

    const currentCity = currentCityLabel ? currentCityLabel.textContent.trim() : "Ludhiana";
    const comparison = ComparatorEngine.compareDish(dish, appliedCoupon, paymentSelect ? paymentSelect.value : "all", currentCity);

    // Identify Winner Object
    let winnerObj;
    const wLower = (comparison.winner || "").toLowerCase();
    if (wLower.includes("domino")) {
      winnerObj = comparison.dominos;
    } else if (wLower.includes("eatsure")) {
      winnerObj = comparison.eatsure;
    } else if (comparison.directBrand && comparison.winner === comparison.directBrand.name) {
      winnerObj = comparison.directBrand;
    } else if (wLower.includes("magic")) {
      winnerObj = comparison.magicpin;
    } else if (wLower.includes("swiggy")) {
      winnerObj = comparison.swiggy;
    } else {
      winnerObj = comparison.zomato;
    }
    if (!winnerObj) winnerObj = comparison.magicpin || comparison.swiggy || comparison.zomato;

    // Mobile sticky bar update (Only shown on small screens)
    if (mobileStickyBar && stickyWinnerBadge && stickyPriceDisplay && stickyActionBtn) {
      if (window.innerWidth <= 768) {
        mobileStickyBar.style.display = "block";
      }
      stickyWinnerBadge.textContent = `👑 LOWEST: ${comparison.winner.toUpperCase()}`;
      stickyPriceDisplay.textContent = `₹${winnerObj.base} Direct Price (Pay ~₹${winnerObj.finalPrice} at checkout)`;
      stickyActionBtn.onclick = () => {
        openOrderGuide(winnerObj.promo ? winnerObj.promo.code : "BESTDEAL", dish.name, comparison.winner, winnerObj.base, winnerObj.finalPrice, winnerObj.deepLink);
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
                <h3 class="whb-title">${escapeHTML(comparison.winner)}</h3>
                <p class="whb-dish-info">${escapeHTML(dish.name)} • Available at ${escapeHTML(dish.popularRest)}</p>
              </div>
            </div>
            <div class="whb-right">
              <div class="whb-price-box">
                <span class="whb-strike">App Menu Rate: ₹${winnerObj.base}</span>
                <span class="whb-final">₹${winnerObj.base} <small>Direct Price</small></span>
              </div>
              <div class="whb-save-tag">Pay ~₹${winnerObj.finalPrice} with coupon at checkout (Save ₹${comparison.totalSaved}) 🎉</div>
            </div>
          </div>
          <button type="button" class="whb-order-btn" 
            data-order-trigger="true"
            data-code="${escapeHTML(winnerObj.promo ? winnerObj.promo.code : 'BESTDEAL')}"
            data-rest="${escapeHTML(dish.name)}"
            data-platform="${escapeHTML(comparison.winner)}"
            data-menu="${winnerObj.base}"
            data-final="${winnerObj.finalPrice}"
            data-link="${escapeHTML(winnerObj.deepLink)}">
            ⚡ Open ${escapeHTML(comparison.winner)} (₹${winnerObj.base} Direct Price) ➔
          </button>
        </div>

        <!-- Connected Delivery Platforms Discovery Strip -->
        <div class="connected-platforms-strip" style="background:#F9FAFB; border:1px solid #E5E7EB; border-radius:12px; padding:12px 16px; margin:16px 0 10px 0; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:1.15rem;">📡</span>
            <span style="font-size:0.85rem; font-weight:600; color:#374151;">
              Connected Delivery Platforms for <strong>${escapeHTML(dish.name)}</strong>:
            </span>
          </div>
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            ${comparison.isDominos ? `<span class="connected-chip" style="background:#EBF5FF; color:#0078AE; font-weight:700; font-size:0.75rem; padding:4px 10px; border-radius:20px; border:1px solid #BFDBFE;">Domino's App</span>` : ''}
            ${comparison.isEatSure ? `<span class="connected-chip" style="background:#FAF5FF; color:#7E22CE; font-weight:700; font-size:0.75rem; padding:4px 10px; border-radius:20px; border:1px solid #E9D5FF;">EatSure Direct</span>` : ''}
            ${comparison.directBrand ? `<span class="connected-chip" style="background:#FEF2F2; color:#DC2626; font-weight:700; font-size:0.75rem; padding:4px 10px; border-radius:20px; border:1px solid #FECACA;">${escapeHTML(comparison.directBrand.name)}</span>` : ''}
            <span class="connected-chip" style="background:#ECFDF5; color:#059669; font-weight:700; font-size:0.75rem; padding:4px 10px; border-radius:20px; border:1px solid #A7F3D0;">Magicpin</span>
            <span class="connected-chip" style="background:#FFF7ED; color:#EA580C; font-weight:700; font-size:0.75rem; padding:4px 10px; border-radius:20px; border:1px solid #FED7AA;">Swiggy</span>
            <span class="connected-chip" style="background:#FFF1F2; color:#E11D48; font-weight:700; font-size:0.75rem; padding:4px 10px; border-radius:20px; border:1px solid #FECDD3;">Zomato</span>
          </div>
        </div>

        <!-- Benchmark Rate Explanation & Live Price Adjuster -->
        <div class="rate-clarification-banner" style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:12px; padding:12px 16px; margin:10px 0 16px 0; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:260px;">
            <span style="font-size:1.3rem;">📊</span>
            <div style="font-size:0.84rem; color:#92400E; line-height:1.45;">
              <strong>Benchmark Menu Rate: ₹${dish.swiggyBase || dish.zomatoBase || 180}</strong> (Average price for popular outlets like <em>${escapeHTML(dish.popularRest || 'Haldiram\'s / Bikanervala')}</em>).<br>
              <span style="color:#78350F; font-size:0.78rem;">💡 Rates vary slightly per outlet. Want to compare for a different menu rate or cart bill? Change rate here:</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px; background:#FEF3C7; padding:6px 10px; border-radius:10px; border:1px solid #FCD34D;">
            <span style="font-size:0.8rem; font-weight:700; color:#92400E;">Menu Rate:</span>
            <div style="display:flex; align-items:center; background:#FFF; border:1px solid #D97706; border-radius:6px; padding:2px 6px;">
              <span style="font-size:0.85rem; font-weight:700; color:#B45309;">₹</span>
              <input type="number" id="dishBaseAdjuster" value="${dish.swiggyBase || dish.zomatoBase || 180}" min="30" max="5000" style="width:65px; border:none; outline:none; font-weight:700; font-size:0.9rem; padding:3px; color:#1F2937;">
            </div>
            <button type="button" id="recalcDishBaseBtn" style="background:#D97706; color:#FFF; border:none; border-radius:6px; padding:6px 12px; font-weight:700; font-size:0.8rem; cursor:pointer;">Update ↻</button>
          </div>
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
              <div class="final-price-label">📌 Direct Menu Price</div>
              <div class="final-price-value">₹${comparison.dominos.base}</div>
              <div class="direct-price-note" style="font-size:0.75rem; color:#64748B; font-weight:600; margin-top:2px;">(App screen direct rate)</div>
              ${comparison.dominos.discount > 0 ? `
              <div class="checkout-offer-pill" style="margin-top:6px; display:inline-block; background:#DCFCE7; color:#15803D; font-size:0.75rem; font-weight:700; padding:3px 8px; border-radius:12px;">
                🏷️ Offer at checkout: Save ₹${comparison.dominos.discount} (Pay ~₹${comparison.dominos.finalPrice})
              </div>` : ''}
            </div>
            <div class="breakdown-list">
              <div class="breakdown-row" style="font-weight:700;"><span>Direct Menu Price (App)</span><span>₹${comparison.dominos.base}</span></div>
              <div class="breakdown-row"><span>Delivery &amp; Platform Fee</span><span><strong style="color:var(--savings-green)">₹0 FREE</strong></span></div>
              ${comparison.dominos.discount > 0 ? `<div class="breakdown-row breakdown-discount"><span>Offer at Checkout (${comparison.dominos.promo ? comparison.dominos.promo.code : 'DOMNEW'})</span><span>-₹${comparison.dominos.discount}</span></div>` : ''}
              <div class="breakdown-row" style="border-top:1px dashed #CBD5E1; padding-top:6px; font-weight:700; color:#0F172A;"><span>Est. Net Bill at Checkout</span><span>₹${comparison.dominos.finalPrice}</span></div>
            </div>
            <div class="card-winner-callout" style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:10px; padding:8px 10px; margin-bottom:12px; font-size:0.75rem; color:#1E40AF; line-height:1.4;">
              🏆 <strong>Direct Brand Superpower:</strong> ₹0 Platform Fee &amp; Everyday Value. <strong>Saves ₹${comparison.swiggy.finalPrice - comparison.dominos.finalPrice} vs Swiggy!</strong>
            </div>
            <button type="button" class="order-btn dominos" 
              data-order-trigger="true"
              data-code="${escapeHTML(comparison.dominos.promo ? comparison.dominos.promo.code : 'DOMNEW')}"
              data-rest="${escapeHTML(dish.name)}"
              data-platform="Domino's Official App"
              data-menu="${comparison.dominos.base}"
              data-final="${comparison.dominos.finalPrice}"
              data-link="${escapeHTML(comparison.dominos.deepLink)}">
              Open Domino's (₹${comparison.dominos.base} Direct Price) →
            </button>
          </div>
          ` : ''}

          ${comparison.isEatSure ? `
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
              <div class="final-price-label">📌 Direct Menu Price</div>
              <div class="final-price-value">₹${comparison.eatsure.base}</div>
              <div class="direct-price-note" style="font-size:0.75rem; color:#64748B; font-weight:600; margin-top:2px;">(App screen direct rate)</div>
              ${comparison.eatsure.discount > 0 ? `
              <div class="checkout-offer-pill" style="margin-top:6px; display:inline-block; background:#DCFCE7; color:#15803D; font-size:0.75rem; font-weight:700; padding:3px 8px; border-radius:12px;">
                🏷️ Offer at checkout: Save ₹${comparison.eatsure.discount} (Pay ~₹${comparison.eatsure.finalPrice})
              </div>` : ''}
            </div>
            <div class="breakdown-list">
              <div class="breakdown-row" style="font-weight:700;"><span>Direct Menu Price (App)</span><span>₹${comparison.eatsure.base}</span></div>
              <div class="breakdown-row"><span>Delivery &amp; Platform Fee</span><span><strong style="color:var(--savings-green)">₹0 FREE</strong></span></div>
              ${comparison.eatsure.discount > 0 ? `<div class="breakdown-row breakdown-discount"><span>Offer at Checkout (${comparison.eatsure.promo ? comparison.eatsure.promo.code : 'SURE50'})</span><span>-₹${comparison.eatsure.discount}</span></div>` : ''}
              <div class="breakdown-row" style="border-top:1px dashed #CBD5E1; padding-top:6px; font-weight:700; color:#0F172A;"><span>Est. Net Bill at Checkout</span><span>₹${comparison.eatsure.finalPrice}</span></div>
            </div>
            <button type="button" class="order-btn eatsure"
              data-order-trigger="true"
              data-code="${escapeHTML(comparison.eatsure.promo ? comparison.eatsure.promo.code : 'SURE50')}"
              data-rest="${escapeHTML(dish.name)}"
              data-platform="EatSure"
              data-menu="${comparison.eatsure.base}"
              data-final="${comparison.eatsure.finalPrice}"
              data-link="${escapeHTML(comparison.eatsure.deepLink || 'https://www.eatsure.com')}">
              Open EatSure (₹${comparison.eatsure.base} Direct Price) →
            </button>
          </div>
          ` : ''}

          ${comparison.directBrand ? `
          <!-- Direct Brand App -->
          <div class="platform-card ${comparison.directBrand.finalPrice === winnerObj.finalPrice ? 'winner' : ''}">
            ${comparison.directBrand.finalPrice === winnerObj.finalPrice ? `<div class="winner-crown">👑 WINNER (SAVE ₹${comparison.totalSaved})</div>` : ''}
            <div class="platform-top">
              <div class="platform-brand">
                <span class="brand-dot" style="background:#DC2626;"></span>
                <span>${escapeHTML(comparison.directBrand.name)}</span>
              </div>
            </div>
            <div class="final-price-box">
              <div class="final-price-label">📌 Direct Menu Price</div>
              <div class="final-price-value">₹${comparison.directBrand.base}</div>
              <div class="direct-price-note" style="font-size:0.75rem; color:#64748B; font-weight:600; margin-top:2px;">(App screen direct rate)</div>
              ${comparison.directBrand.discount > 0 ? `
              <div class="checkout-offer-pill" style="margin-top:6px; display:inline-block; background:#DCFCE7; color:#15803D; font-size:0.75rem; font-weight:700; padding:3px 8px; border-radius:12px;">
                🏷️ Offer at checkout: Save ₹${comparison.directBrand.discount} (Pay ~₹${comparison.directBrand.finalPrice})
              </div>` : ''}
            </div>
            <div class="breakdown-list">
              <div class="breakdown-row" style="font-weight:700;"><span>Direct Menu Price (App)</span><span>₹${comparison.directBrand.base}</span></div>
              <div class="breakdown-row"><span>Platform Fee</span><span><strong style="color:var(--savings-green)">₹0 FREE</strong></span></div>
              ${comparison.directBrand.discount > 0 ? `<div class="breakdown-row breakdown-discount"><span>Offer at Checkout</span><span>-₹${comparison.directBrand.discount}</span></div>` : ''}
              <div class="breakdown-row" style="border-top:1px dashed #CBD5E1; padding-top:6px; font-weight:700; color:#0F172A;"><span>Est. Net Bill at Checkout</span><span>₹${comparison.directBrand.finalPrice}</span></div>
            </div>
            <button type="button" class="order-btn" style="background:#DC2626; color:#fff;"
              data-order-trigger="true"
              data-code="${escapeHTML(comparison.directBrand.promo ? comparison.directBrand.promo.code : 'DIRECTSAVE')}"
              data-rest="${escapeHTML(dish.name)}"
              data-platform="${escapeHTML(comparison.directBrand.name)}"
              data-menu="${comparison.directBrand.base}"
              data-final="${comparison.directBrand.finalPrice}"
              data-link="${escapeHTML(comparison.directBrand.deepLink)}">
              Open ${escapeHTML(comparison.directBrand.name)} (₹${comparison.directBrand.base} Direct Price) →
            </button>
          </div>
          ` : ''}

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
              <div class="final-price-label">📌 Direct Menu Price</div>
              <div class="final-price-value">₹${comparison.magicpin.base}</div>
              <div class="direct-price-note" style="font-size:0.75rem; color:#64748B; font-weight:600; margin-top:2px;">(App screen direct rate)</div>
              ${comparison.magicpin.discount > 0 ? `
              <div class="checkout-offer-pill" style="margin-top:6px; display:inline-block; background:#DCFCE7; color:#15803D; font-size:0.75rem; font-weight:700; padding:3px 8px; border-radius:12px;">
                🏷️ Offer at checkout: Save ₹${comparison.magicpin.discount} (Pay ~₹${comparison.magicpin.finalPrice})
              </div>` : ''}
            </div>
            <div class="breakdown-list">
              <div class="breakdown-row" style="font-weight:700;"><span>Direct Menu Price (App)</span><span>₹${comparison.magicpin.base}</span></div>
              <div class="breakdown-row"><span>GST &amp; Delivery</span><span>₹${comparison.magicpin.gross - comparison.magicpin.base}</span></div>
              ${comparison.magicpin.discount > 0 ? `<div class="breakdown-row breakdown-discount"><span>Offer at Checkout (${comparison.magicpin.promo ? comparison.magicpin.promo.code : 'MAGIC50'})</span><span>-₹${comparison.magicpin.discount}</span></div>` : ''}
              <div class="breakdown-row" style="border-top:1px dashed #CBD5E1; padding-top:6px; font-weight:700; color:#0F172A;"><span>Est. Net Bill at Checkout</span><span>₹${comparison.magicpin.finalPrice}</span></div>
            </div>
            <button type="button" class="order-btn magicpin"
              data-order-trigger="true"
              data-code="${escapeHTML(comparison.magicpin.promo ? comparison.magicpin.promo.code : (comparison.isDominos ? 'DOMINOS50' : 'MAGIC50'))}"
              data-rest="${escapeHTML(dish.name)}"
              data-platform="Magicpin"
              data-menu="${comparison.magicpin.base}"
              data-final="${comparison.magicpin.finalPrice}"
              data-link="${escapeHTML(comparison.magicpin.deepLink)}">
              Open Magicpin (₹${comparison.magicpin.base} Direct Price) →
            </button>
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
              <div class="final-price-label">📌 Direct Menu Price</div>
              <div class="final-price-value">₹${comparison.swiggy.base}</div>
              <div class="direct-price-note" style="font-size:0.75rem; color:#64748B; font-weight:600; margin-top:2px;">(App screen direct rate)</div>
              ${comparison.swiggy.discount > 0 ? `
              <div class="checkout-offer-pill" style="margin-top:6px; display:inline-block; background:#DCFCE7; color:#15803D; font-size:0.75rem; font-weight:700; padding:3px 8px; border-radius:12px;">
                🏷️ Offer at checkout: Save ₹${comparison.swiggy.discount} (Pay ~₹${comparison.swiggy.finalPrice})
              </div>` : ''}
            </div>
            <div class="breakdown-list">
              <div class="breakdown-row" style="font-weight:700;"><span>Direct Menu Price (App)</span><span>₹${comparison.swiggy.base}</span></div>
              <div class="breakdown-row"><span>Fees &amp; Delivery</span><span>+₹${comparison.swiggy.gross - comparison.swiggy.base}</span></div>
              ${comparison.swiggy.discount > 0 ? `<div class="breakdown-row breakdown-discount"><span>Offer at Checkout (${comparison.swiggy.promo ? comparison.swiggy.promo.code : 'TRYNEW'})</span><span>-₹${comparison.swiggy.discount}</span></div>` : ''}
              <div class="breakdown-row" style="border-top:1px dashed #CBD5E1; padding-top:6px; font-weight:700; color:#0F172A;"><span>Est. Net Bill at Checkout</span><span>₹${comparison.swiggy.finalPrice}</span></div>
            </div>
            ${comparison.isDominos ? `
            <div class="card-warning-callout" style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:10px; padding:8px 10px; margin-bottom:12px; font-size:0.75rem; color:#92400E; line-height:1.4;">
              ⚠️ <strong>High Swiggy Markup:</strong> Swiggy charges <strong>₹${comparison.swiggy.finalPrice}</strong> (+₹${comparison.swiggy.gross - comparison.swiggy.base} extra fees). <em>Domino's Direct is only ₹${comparison.dominos.finalPrice}!</em>
            </div>` : ''}
            <button type="button" class="order-btn swiggy"
              data-order-trigger="true"
              data-code="${escapeHTML(comparison.swiggy.promo ? comparison.swiggy.promo.code : 'TRYNEW')}"
              data-rest="${escapeHTML(dish.name)}"
              data-platform="Swiggy"
              data-menu="${comparison.swiggy.base}"
              data-final="${comparison.swiggy.finalPrice}"
              data-link="${escapeHTML(comparison.swiggy.deepLink)}">
              Open Swiggy (₹${comparison.swiggy.base} Direct Price) →
            </button>
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
              <div class="final-price-label">📌 Direct Menu Price</div>
              <div class="final-price-value">₹${comparison.zomato.base}</div>
              <div class="direct-price-note" style="font-size:0.75rem; color:#64748B; font-weight:600; margin-top:2px;">(App screen direct rate)</div>
              ${comparison.zomato.discount > 0 ? `
              <div class="checkout-offer-pill" style="margin-top:6px; display:inline-block; background:#DCFCE7; color:#15803D; font-size:0.75rem; font-weight:700; padding:3px 8px; border-radius:12px;">
                🏷️ Offer at checkout: Save ₹${comparison.zomato.discount} (Pay ~₹${comparison.zomato.finalPrice})
              </div>` : ''}
            </div>
            <div class="breakdown-list">
              <div class="breakdown-row" style="font-weight:700;"><span>Direct Menu Price (App)</span><span>₹${comparison.zomato.base}</span></div>
              <div class="breakdown-row"><span>Fees &amp; Delivery</span><span>+₹${comparison.zomato.gross - comparison.zomato.base}</span></div>
              ${comparison.zomato.discount > 0 ? `<div class="breakdown-row breakdown-discount"><span>Offer at Checkout (${comparison.zomato.promo ? comparison.zomato.promo.code : 'STEALDEAL'})</span><span>-₹${comparison.zomato.discount}</span></div>` : ''}
              <div class="breakdown-row" style="border-top:1px dashed #CBD5E1; padding-top:6px; font-weight:700; color:#0F172A;"><span>Est. Net Bill at Checkout</span><span>₹${comparison.zomato.finalPrice}</span></div>
            </div>
            ${comparison.isDominos ? `
            <div class="card-warning-callout" style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:10px; padding:8px 10px; margin-bottom:12px; font-size:0.75rem; color:#92400E; line-height:1.4;">
              ⚠️ <strong>High Zomato Markup:</strong> Zomato charges <strong>₹${comparison.zomato.finalPrice}</strong> (+₹${comparison.zomato.gross - comparison.zomato.base} extra fees). <em>Domino's Direct is only ₹${comparison.dominos.finalPrice}!</em>
            </div>` : ''}
            <button type="button" class="order-btn zomato"
              data-order-trigger="true"
              data-code="${escapeHTML(comparison.zomato.promo ? comparison.zomato.promo.code : 'STEALDEAL')}"
              data-rest="${escapeHTML(dish.name)}"
              data-platform="Zomato"
              data-menu="${comparison.zomato.base}"
              data-final="${comparison.zomato.finalPrice}"
              data-link="${escapeHTML(comparison.zomato.deepLink)}">
              Open Zomato (₹${comparison.zomato.base} Direct Price) →
            </button>
          </div>

        </div>
      </div>
    `;

    // Hook up base rate adjuster
    const dishBaseAdjuster = document.getElementById("dishBaseAdjuster");
    const recalcDishBaseBtn = document.getElementById("recalcDishBaseBtn");
    if (recalcDishBaseBtn && dishBaseAdjuster) {
      recalcDishBaseBtn.addEventListener("click", () => {
        const newBase = parseFloat(dishBaseAdjuster.value);
        if (newBase && newBase > 0) {
          selectedDish.zomatoBase = newBase;
          selectedDish.swiggyBase = newBase;
          selectedDish.magicpinBase = Math.max(40, Math.round(newBase * 0.85));
          if (cartInput) cartInput.value = newBase;
          renderDishFaceoff(selectedDish, appliedCoupon);
          showToast(`Recalculated comparison for ₹${newBase} menu bill!`);
        }
      });
      dishBaseAdjuster.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          recalcDishBaseBtn.click();
        }
      });
    }

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

  // Universal Search & Live Comparison Runner (Supports Any Restaurant or Dish)
  window.searchAndCompare = function(query) {
    const rawVal = (typeof query === "string" && query.trim().length > 0) ? query : (dishSearchInput ? dishSearchInput.value : "");
    const q = (rawVal || "").trim();
    if (!q) {
      if (dishSearchInput) dishSearchInput.focus();
      showToast("Please enter a food item or restaurant (e.g. Pizza, KFC, Biryani)!");
      return;
    }

    if (dishDropdown) dishDropdown.classList.remove("show");

    let dishMatch = null;
    const lower = q.toLowerCase();

    if (typeof DISHES_DATA !== "undefined" && Array.isArray(DISHES_DATA)) {
      // 1. Exact ID match (from food cards or dropdown click)
      dishMatch = DISHES_DATA.find(d => d.id === q);

      // 2. Exact match in name, keyword, or restaurant
      if (!dishMatch) {
        dishMatch = DISHES_DATA.find(d => 
          d.name.toLowerCase() === lower ||
          d.keywords.some(k => k.toLowerCase() === lower) ||
          d.popularRest.toLowerCase() === lower
        );
      }

      // 3. Substring match in name, keywords, or popularRest (safe direction: dish name or keyword contains user query)
      if (!dishMatch) {
        dishMatch = DISHES_DATA.find(d => 
          d.name.toLowerCase().includes(lower) ||
          d.keywords.some(k => k.toLowerCase().includes(lower)) ||
          d.popularRest.toLowerCase().includes(lower)
        );
      }
    }

    // 4. Synthesize Dynamic Dish if not present in pre-configured list
    if (!dishMatch) {
      if (typeof ComparatorEngine !== "undefined" && ComparatorEngine.createDynamicDish) {
        dishMatch = ComparatorEngine.createDynamicDish(q);
      } else {
        dishMatch = {
          id: "dyn_" + Date.now(),
          name: q.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '),
          searchQuery: q,
          userSearchQuery: q,
          keywords: q.toLowerCase().split(/\s+/),
          category: "Popular Dish",
          emoji: "🍽️",
          dominosBase: 0,
          eatsureBase: 0,
          zomatoBase: 179,
          swiggyBase: 175,
          magicpinBase: 145,
          packaging: 15,
          popularRest: `${q} (Magicpin, Swiggy & Zomato)`
        };
      }
    }

    // Preserve user typed search term for 100% deep search accuracy
    dishMatch = Object.assign({}, dishMatch);
    if (!q.startsWith("d_") && !q.startsWith("deal_")) {
      dishMatch.userSearchQuery = q;
    }

    // Highlight matching food card if exists, else deactivate all
    foodCards.forEach(c => {
      if (c.dataset.dishId === dishMatch.id) {
        c.classList.add("active");
      } else {
        c.classList.remove("active");
      }
    });

    if (dishSearchInput) dishSearchInput.value = dishMatch.name;
    if (cartInput) cartInput.value = dishMatch.zomatoBase || 179;

    renderDishFaceoff(dishMatch);
    renderComparison();

    // Smooth scroll down to faceoff arena
    const arena = document.getElementById("dishFaceoffCardContainer");
    if (arena) {
      arena.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    showToast(`⚡ Live comparison ready for "${dishMatch.name}"!`);
  };

  // Quick Select Food Function (used in placeholder tags & food cards)
  window.quickSelectDish = function(dishId) {
    searchAndCompare(dishId);
  };

  // Hook up Giant Food Cards
  foodCards.forEach(card => {
    card.addEventListener("click", () => {
      const dishId = card.dataset.dishId;
      searchAndCompare(dishId);
    });
  });

  // Autocomplete Dish Search Box
  if (dishSearchInput && dishDropdown) {
    dishSearchInput.addEventListener("input", (e) => {
      const q = e.target.value.trim();
      if (!q) {
        dishDropdown.classList.remove("show");
        return;
      }

      const lower = q.toLowerCase();
      let matches = [];
      if (typeof DISHES_DATA !== "undefined") {
        matches = DISHES_DATA.filter(d => 
          d.name.toLowerCase().includes(lower) ||
          d.keywords.some(k => k.toLowerCase().includes(lower)) ||
          d.popularRest.toLowerCase().includes(lower)
        ).slice(0, 5);
      }

      let html = "";
      if (matches.length > 0) {
        html += matches.map(d => `
          <div class="dropdown-item" data-id="${escapeHTML(d.id)}">
            <div class="dropdown-item-left">
              <span class="dropdown-item-emoji">${d.emoji}</span>
              <div>
                <div class="dropdown-item-title">${escapeHTML(d.name)}</div>
                <div class="dropdown-item-sub">${escapeHTML(d.popularRest)} • ${escapeHTML(d.category)}</div>
              </div>
            </div>
            <span class="dropdown-item-badge">From ₹${d.magicpinBase || 220}+</span>
          </div>
        `).join("");

        // Action row to compare query live
        html += `
          <div class="dropdown-item dropdown-item-action" data-search-custom="${escapeHTML(q)}" style="background:#FFFBEB; border-top:1px dashed #FDE68A; cursor:pointer;">
            <div class="dropdown-item-left">
              <span class="dropdown-item-emoji">⚡</span>
              <div>
                <div class="dropdown-item-title" style="color:var(--primary, #E23744); font-weight:700;">Compare "${escapeHTML(q)}" Live ➔</div>
                <div class="dropdown-item-sub">Scan Swiggy, Zomato, Magicpin &amp; Brand Apps</div>
              </div>
            </div>
            <span class="dropdown-item-badge" style="background:#E23744; color:#fff;">Live Rates</span>
          </div>
        `;
      } else {
        // Universal comparison action when not in pre-seeded database
        html = `
          <div class="dropdown-item dropdown-item-action" data-search-custom="${escapeHTML(q)}" style="background:#FFFBEB; cursor:pointer; padding:14px 16px;">
            <div class="dropdown-item-left">
              <span class="dropdown-item-emoji" style="font-size:1.4rem;">🔍</span>
              <div>
                <div class="dropdown-item-title" style="color:var(--primary, #E23744); font-weight:700; font-size:0.95rem;">
                  Compare "${escapeHTML(q)}" Across All Food Apps ➔
                </div>
                <div class="dropdown-item-sub" style="color:#6B7280; font-size:0.8rem; margin-top:2px;">
                  Identify connected platforms (Swiggy, Zomato, Magicpin, Direct Apps) and calculate cheapest net bill!
                </div>
              </div>
            </div>
            <span class="dropdown-item-badge" style="background:#10B981; color:#fff; font-weight:700;">⚡ Compare Now</span>
          </div>
        `;
      }

      dishDropdown.innerHTML = html;
      dishDropdown.classList.add("show");

      // Attach click events to dropdown items
      dishDropdown.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", () => {
          const dishId = item.dataset.id;
          const customSearch = item.dataset.searchCustom;
          dishDropdown.classList.remove("show");
          if (dishId) {
            searchAndCompare(dishId);
          } else if (customSearch) {
            searchAndCompare(customSearch);
          }
        });
      });
    });

    // Enter key press in search box
    dishSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        searchAndCompare(dishSearchInput.value);
      }
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!dishSearchInput.contains(e.target) && !dishDropdown.contains(e.target)) {
        dishDropdown.classList.remove("show");
      }
    });
  }

  // Form submit & Go/Compare button click
  const dishSearchForm = document.getElementById("dishSearchForm");
  if (dishSearchForm) {
    dishSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      searchAndCompare(dishSearchInput ? dishSearchInput.value : "");
    });
  }

  if (searchGoBtn && dishSearchInput) {
    searchGoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      searchAndCompare(dishSearchInput.value);
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

    const platforms = [result.dominos, result.eatsure, result.magicpin, result.swiggy, result.zomato].filter(Boolean);

    comparisonResultGrid.innerHTML = `
      <div class="calc-active-notice" style="grid-column: 1 / -1; background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 12px 16px; font-size: 0.85rem; color: #334155; margin-bottom: 6px;">
        💡 <strong>Cart Value Analysis for ₹${amount}:</strong> Showing real checkout bills including ₹8 platform fees, GST taxes, and delivery. 
        <span style="color:#64748B;">(Domino's rate reflects their Everyday Value 2-Pizza combo; EatSure reflects direct brand savings).</span>
        <div style="margin-top:6px;">
          👉 <em>Want to compare an exact dish like Peppy Paneer or Biryani? <a href="#foodSection" style="color:var(--primary-red);font-weight:700;">Pick in 🍕 Food Matcher above!</a></em>
        </div>
      </div>
    ` + platforms.map(p => {
      const isWinner = p.isWinner;
      const brandClass = p.platform.toLowerCase().includes("zomato") ? "zomato" :
                         p.platform.toLowerCase().includes("swiggy") ? "swiggy" :
                         p.platform.toLowerCase().includes("domino") ? "dominos" :
                         p.platform.toLowerCase().includes("eatsure") ? "eatsure" : "magicpin";

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
              <span>Item Total ${p.platform.includes("Domino") ? '(2 Pizzas Combo)' : p.platform.includes("EatSure") ? '(Brand Menu)' : '(Menu Base)'}</span>
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

          <button type="button" class="order-btn ${brandClass}"
            data-order-trigger="true"
            data-code="${p.promoCode !== 'None' ? p.promoCode : 'BESTDEAL'}"
            data-rest="Cart Total (₹${amount})"
            data-platform="${p.platform}"
            data-menu="${p.base}"
            data-final="${p.finalPrice}"
            data-link="${p.deepLink}">
            <span>Order on ${p.platform} (₹${p.finalPrice}) →</span>
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

          <button type="button" class="deal-order-direct-btn"
            data-order-trigger="true"
            data-code="${deal.couponCode}"
            data-rest="${deal.restaurant}"
            data-platform="${deal.platform}"
            data-menu="${deal.originalAvgPrice}"
            data-final="${deal.slashedNetPrice}"
            data-link="${deal.deepLink}">
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
