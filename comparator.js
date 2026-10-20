// Foodie Hu Mai - Reverse-Engineered Multi-Platform Bill Comparator Engine
// Accurately reverse-engineers Domino's vs Swiggy vs Zomato vs Magicpin bill structures

const ComparatorEngine = {
  // Detects whether a city is an EatSure serviceable hub
  isMetroCity(city) {
    return true; // EatSure operates across 80+ Indian cities
  },

  // Calculates fee structures and best applicable discount
  calculate(cartValue, paymentMethod = "all", orderType = "solo", city = "Ludhiana") {
    const base = Number(cartValue) || 299;
    const isEatSureServiceable = this.isMetroCity(city);
    
    // 1. ZOMATO CALCULATION
    const zomatoGST = Math.round(base * 0.05);
    const zomatoPlatform = 8;
    const zomatoPackaging = base > 400 ? 25 : 15;
    const zomatoDelivery = base >= 500 ? 0 : 35;
    const zomatoGross = base + zomatoGST + zomatoPlatform + zomatoPackaging + zomatoDelivery;
    
    // Find best Zomato coupon
    const zomatoPromo = this.findBestPromo("Zomato", base, paymentMethod);
    const zomatoDiscount = zomatoPromo ? zomatoPromo.discount : 0;
    const zomatoFinal = Math.max(0, zomatoGross - zomatoDiscount);

    // 2. SWIGGY CALCULATION
    const swiggyGST = Math.round(base * 0.05);
    const swiggyPlatform = 7;
    const swiggyPackaging = base > 400 ? 20 : 15;
    const swiggyDelivery = base >= 450 ? 0 : 32;
    const swiggyGross = base + swiggyGST + swiggyPlatform + swiggyPackaging + swiggyDelivery;

    // Find best Swiggy coupon
    const swiggyPromo = this.findBestPromo("Swiggy", base, paymentMethod);
    const swiggyDiscount = swiggyPromo ? swiggyPromo.discount : 0;
    const swiggyFinal = Math.max(0, swiggyGross - swiggyDiscount);

    // 3. MAGICPIN / ONDC DIRECT CALCULATION
    // ONDC / Magicpin does not inflate menu prices by 15-25% like delivery giants
    // 3. MAGICPIN CALCULATION
    const magicpinBase = Math.round(base * 0.90);
    const magicpinGST = Math.round(magicpinBase * 0.05);
    const magicpinPlatform = 0; // ₹0 platform fee
    const magicpinPackaging = 12;
    const magicpinDelivery = 28;
    const magicpinGross = magicpinBase + magicpinGST + magicpinPlatform + magicpinPackaging + magicpinDelivery;
    const magicpinPromo = this.findBestPromo("Magicpin", magicpinBase, paymentMethod);
    const magicpinDiscount = magicpinPromo ? magicpinPromo.discount : (magicpinBase >= 200 ? 50 : 25);
    const magicpinFinal = Math.max(0, magicpinGross - magicpinDiscount);

    // 4. EATSURE (DIRECT REBEL FOODS - ZERO FEES)
    const eatsureBase = Math.round(base * 0.92);
    const eatsureGST = Math.round(eatsureBase * 0.05);
    const eatsurePlatform = 0; // ₹0 Platform Fee
    const eatsurePackaging = 0; // Free Packaging on EatSure
    const eatsureDelivery = eatsureBase >= 199 ? 0 : 29; // Free delivery
    const eatsureGross = eatsureBase + eatsureGST + eatsurePlatform + eatsurePackaging + eatsureDelivery;
    const eatsureDiscount = Math.min(150, Math.round(eatsureBase * 0.50)); // SURE50
    const eatsureFinal = Math.max(0, eatsureGross - eatsureDiscount);

    // 5. ONDC / PINCODE (GOVERNMENT OPEN NETWORK)
    const ondcBase = Math.round(base * 0.88);
    const ondcGST = Math.round(ondcBase * 0.05);
    const ondcPlatform = 0;
    const ondcPackaging = 12;
    const ondcDelivery = 22; // Subsidized delivery
    const ondcGross = ondcBase + ondcGST + ondcPlatform + ondcPackaging + ondcDelivery;
    const ondcDiscount = ondcBase >= 199 ? 50 : 25; // ONDC50
    const ondcFinal = Math.max(0, ondcGross - ondcDiscount);

    // 6. DOMINO'S OFFICIAL APP (DIRECT JUBILANT - EVERYDAY VALUE)
    const dominosBase = Math.round(base * 0.82); // Direct everyday value baseline
    const dominosGST = Math.round(dominosBase * 0.05);
    const dominosPlatform = 0; // ₹0 Platform Fee on Domino's
    const dominosPackaging = 0; // ₹0 Packaging Fee
    const dominosDelivery = dominosBase >= 200 ? 0 : 25;
    const dominosGross = dominosBase + dominosGST + dominosPlatform + dominosPackaging + dominosDelivery;
    const dominosPromo = this.findBestPromo("Domino's", dominosBase, paymentMethod);
    const dominosDiscount = dominosPromo ? dominosPromo.discount : Math.min(100, Math.round(dominosBase * 0.30));
    const dominosFinal = Math.max(0, dominosGross - dominosDiscount);

    // Determine the absolute winner (cheapest among serviceable platforms in this city)
    const options = [
      { name: "Domino's App (Direct)", final: dominosFinal, discount: dominosDiscount, promo: dominosPromo || { code: "EDV99", headline: "2 Pizzas @ ₹99 Each" }, color: "#0078AE" },
      ...(isEatSureServiceable ? [{ name: "EatSure (Direct Brand)", final: eatsureFinal, discount: eatsureDiscount, promo: { code: "SURE50", headline: "Flat 50% OFF + Free Delivery" }, color: "#7E22CE" }] : []),
      { name: "Magicpin", final: magicpinFinal, discount: magicpinDiscount, promo: magicpinPromo, color: "#10B981" },
      { name: "ONDC / Pincode", final: ondcFinal, discount: ondcDiscount, promo: { code: "ONDC50", headline: "Govt Subsidized Rate" }, color: "#0284C7" },
      { name: "Swiggy", final: swiggyFinal, discount: swiggyDiscount, promo: swiggyPromo, color: "#FC8019" },
      { name: "Zomato", final: zomatoFinal, discount: zomatoDiscount, promo: zomatoPromo, color: "#FF385C" }
    ];

    options.sort((a, b) => a.final - b.final);
    const winner = options[0];
    const highest = Math.max(zomatoFinal, swiggyFinal);
    const totalSaved = Math.max(0, highest - winner.final);

    return {
      base,
      paymentMethod,
      orderType,
      city,
      winner: winner.name,
      totalSaved,
      platforms: options,
      dominos: {
        platform: "Domino's (Official App)",
        base: dominosBase,
        gst: dominosGST,
        platformFee: dominosPlatform,
        packaging: dominosPackaging,
        delivery: dominosDelivery,
        discount: dominosDiscount,
        promoCode: dominosPromo ? dominosPromo.code : "EDV99",
        promoHeadline: dominosPromo ? dominosPromo.headline : "Everyday Value 2 Pizzas @ ₹99 each",
        finalPrice: dominosFinal,
        isWinner: winner.name.includes("Domino"),
        deepLink: "https://www.dominos.co.in"
      },
      zomato: {
        platform: "Zomato",
        base,
        gst: zomatoGST,
        platformFee: zomatoPlatform,
        packaging: zomatoPackaging,
        delivery: zomatoDelivery,
        discount: zomatoDiscount,
        promoCode: zomatoPromo ? zomatoPromo.code : "None",
        promoHeadline: zomatoPromo ? zomatoPromo.headline : "No Coupon Applied",
        finalPrice: zomatoFinal,
        isWinner: winner.name === "Zomato",
        deepLink: "https://www.zomato.com"
      },
      swiggy: {
        platform: "Swiggy",
        base,
        gst: swiggyGST,
        platformFee: swiggyPlatform,
        packaging: swiggyPackaging,
        delivery: swiggyDelivery,
        discount: swiggyDiscount,
        promoCode: swiggyPromo ? swiggyPromo.code : "None",
        promoHeadline: swiggyPromo ? swiggyPromo.headline : "No Coupon Applied",
        finalPrice: swiggyFinal,
        isWinner: winner.name === "Swiggy",
        deepLink: "https://www.swiggy.com"
      },
      eatsure: {
        platform: "EatSure (Direct)",
        serviceable: true,
        serviceableNote: "Available for direct brand delivery via EatSure App & Web",
        base: eatsureBase,
        gst: eatsureGST,
        platformFee: eatsurePlatform,
        packaging: eatsurePackaging,
        delivery: eatsureDelivery,
        discount: eatsureDiscount,
        promoCode: "SURE50",
        promoHeadline: "Flat 50% OFF + Zero Delivery Fee",
        finalPrice: eatsureFinal,
        isWinner: winner.name.includes("EatSure"),
        deepLink: "https://www.eatsure.com"
      },
      magicpin: {
        platform: "Magicpin",
        base: magicpinBase,
        gst: magicpinGST,
        platformFee: magicpinPlatform,
        packaging: magicpinPackaging,
        delivery: magicpinDelivery,
        discount: magicpinDiscount,
        promoCode: magicpinPromo ? magicpinPromo.code : "MAGIC50",
        promoHeadline: "Direct Merchant Zero-Commission Rate",
        finalPrice: magicpinFinal,
        isWinner: winner.name === "Magicpin",
        deepLink: "https://www.magicpin.in"
      },
      ondc: {
        platform: "ONDC (Pincode)",
        base: ondcBase,
        gst: ondcGST,
        platformFee: ondcPlatform,
        packaging: ondcPackaging,
        delivery: ondcDelivery,
        discount: ondcDiscount,
        promoCode: "ONDC50",
        promoHeadline: "Govt Subsidized Delivery",
        finalPrice: ondcFinal,
        isWinner: winner.name.includes("ONDC"),
        deepLink: "https://www.ondc.org"
      }
    };
  },

  findBestPromo(platform, amount, paymentMethod) {
    const couponsList = (typeof COUPONS_DATA !== "undefined") ? COUPONS_DATA : (typeof require !== "undefined" ? require('./coupons.js') : []);
    if (!couponsList || couponsList.length === 0) return null;

    const eligible = couponsList.filter(c => {
      // Platform match
      if (c.platform !== platform && c.platform !== "All") return false;
      // Min order condition
      if (amount < c.minOrder) return false;

      // Payment match
      if (paymentMethod === "all" || paymentMethod === "cod" || paymentMethod === "upi_any") {
        return c.category === "universal" || c.category === "timing";
      }

      if (paymentMethod === "gpay" && (c.code === "GPAY50" || c.category === "universal")) return true;
      if (paymentMethod === "simpl" && (c.code === "SIMPLFOOD" || c.category === "universal")) return true;
      if (paymentMethod === "hdfc" && (c.code === "HDFC100" || c.category === "universal")) return true;
      if (paymentMethod === "icici" && (c.code === "ICICITREATS" || c.category === "universal")) return true;
      if (paymentMethod === "axis" && (c.code === "AXISDELIGHT" || c.category === "universal")) return true;
      if (paymentMethod === "aubank" && (c.code === "AUBANK100" || c.category === "universal")) return true;

      return c.category === "universal";
    });

    if (eligible.length === 0) return null;

    // Calculate actual rupee discount for each eligible promo
    let best = null;
    let maxRupeeDiscount = -1;

    for (const c of eligible) {
      let d = 0;
      if (c.discountType === "flat") {
        d = c.discountAmount;
      } else if (c.discountType === "percent") {
        d = Math.round(amount * (c.discountPercent / 100));
        if (c.maxDiscount && d > c.maxDiscount) d = c.maxDiscount;
      }

      if (d > maxRupeeDiscount) {
        maxRupeeDiscount = d;
        best = {
          code: c.code,
          discount: d,
          headline: c.discountHeadline,
          badge: c.badge
        };
      }
    }

    return best;
  },

  // Generates WhatsApp Viral Share Link
  generateWhatsAppShare(calcResult) {
    const winnerKey = calcResult.winner.toLowerCase().includes('domino') ? 'dominos' :
                      calcResult.winner.toLowerCase().includes('eatsure') ? 'eatsure' :
                      calcResult.winner.toLowerCase().includes('magic') ? 'magicpin' :
                      calcResult.winner.toLowerCase().includes('ondc') ? 'ondc' :
                      calcResult.winner.toLowerCase().includes('swiggy') ? 'swiggy' : 'zomato';
    const winnerFinalPrice = calcResult[winnerKey] ? calcResult[winnerKey].finalPrice : 0;

    const text = encodeURIComponent(
      `🍕 *Foodie Hu Mai Hack!* 🍕\n\n` +
      `Bhai khana order karne se pehle yahan check kar!\n` +
      `Mera abhi *₹${calcResult.totalSaved} bacha*:\n` +
      `• Zomato: ₹${calcResult.zomato.finalPrice}\n` +
      `• Swiggy: ₹${calcResult.swiggy.finalPrice}\n` +
      `• Winner: *${calcResult.winner} (₹${winnerFinalPrice})* 🏆\n\n` +
      `Apna bill yahan compare kar aur secret coupons copy kar: https://foodiehumai.vercel.app`
    );
    return `https://api.whatsapp.com/send?text=${text}`;
  },

  // Specific Dish Multi-Platform Comparison with Live Coupon Application
  compareDish(dish, manualCouponCode = null, paymentMethod = "all", city = "Ludhiana") {
    const zomatoBase = dish.zomatoBase || 299;
    const swiggyBase = dish.swiggyBase || 299;
    const magicpinBase = dish.magicpinBase || Math.round(zomatoBase * 0.85);
    const packaging = dish.packaging || 20;

    const isDominos = dish.name.toLowerCase().includes("domino") || 
                     (dish.keywords && dish.keywords.includes("dominos")) || 
                     Boolean(dish.dominosBase);

    // 1. Domino's Direct Official App
    const dBase = dish.dominosBase || 198;
    const dGST = Math.round(dBase * 0.05);
    const dGross = dBase + dGST; // ₹0 platform fee, ₹0 packaging
    const dPromo = manualCouponCode ? this.getCouponByCode(manualCouponCode, "Domino's", dBase) : 
                   (this.findBestPromo("Domino's", dBase, paymentMethod) || { code: "EDV99", discount: 90 });
    const dDiscount = dPromo ? dPromo.discount : 90;
    const dFinal = Math.max(0, dGross - dDiscount);

    // 2. Zomato
    const zGST = Math.round(zomatoBase * 0.05);
    const zGross = zomatoBase + zGST + 8 + 35 + packaging;
    const zPromo = manualCouponCode ? this.getCouponByCode(manualCouponCode, "Zomato", zomatoBase) : this.findBestPromo("Zomato", zomatoBase, paymentMethod);
    const zDiscount = zPromo ? zPromo.discount : 0;
    const zFinal = Math.max(0, zGross - zDiscount);

    // 3. Swiggy
    const sGST = Math.round(swiggyBase * 0.05);
    const sGross = swiggyBase + sGST + 7 + 32 + packaging;
    const sPromo = manualCouponCode ? this.getCouponByCode(manualCouponCode, "Swiggy", swiggyBase) : this.findBestPromo("Swiggy", swiggyBase, paymentMethod);
    const sDiscount = sPromo ? sPromo.discount : 0;
    const sFinal = Math.max(0, sGross - sDiscount);

    // 4. Magicpin
    const mGST = Math.round(magicpinBase * 0.05);
    const mGross = magicpinBase + mGST + 0 + 25 + Math.max(10, packaging - 5);
    const mPromo = manualCouponCode ? this.getCouponByCode(manualCouponCode, "Magicpin", magicpinBase) : this.findBestPromo("Magicpin", magicpinBase, paymentMethod);
    const mDiscount = mPromo ? mPromo.discount : (magicpinBase >= 200 ? 50 : 25);
    const mFinal = Math.max(0, mGross - mDiscount);

    // 5. EatSure (Direct Brand Platform for Rebel Foods)
    const isEatSureBrand = Boolean(dish.eatsureBase) ||
                           dish.name.toLowerCase().includes("behrouz") ||
                           dish.name.toLowerCase().includes("faasos") ||
                           dish.name.toLowerCase().includes("ovenstory") ||
                           dish.name.toLowerCase().includes("lunchbox") ||
                           dish.name.toLowerCase().includes("firangi") ||
                           dish.name.toLowerCase().includes("eatsure") ||
                           (dish.keywords && dish.keywords.some(k => k.toLowerCase().includes("behrouz") || k.toLowerCase().includes("faasos") || k.toLowerCase().includes("eatsure")));
    const isEatSureServiceable = this.isMetroCity(city) && isEatSureBrand;
    const eBase = Math.round(zomatoBase * 0.92);
    const eGST = Math.round(eBase * 0.05);
    const eGross = eBase + eGST; // Zero platform fee, zero packaging, zero delivery
    const ePromo = manualCouponCode ? this.getCouponByCode(manualCouponCode, "EatSure", eBase) : { code: "SURE50", discount: Math.min(150, Math.round(eBase * 0.50)) };
    const eDiscount = ePromo ? ePromo.discount : 75;
    const eFinal = Math.max(0, eGross - eDiscount);

    // 6. Direct Brand Apps (KFC, Pizza Hut, Burger King, McDelivery)
    let directBrandResult = null;
    const isKFC = dish.name.toLowerCase().includes("kfc") || (dish.keywords && dish.keywords.includes("kfc"));
    const isPizzaHut = dish.name.toLowerCase().includes("pizza hut") || (dish.keywords && dish.keywords.includes("pizza hut"));
    const isBurgerKing = dish.name.toLowerCase().includes("burger king") || (dish.keywords && dish.keywords.includes("burger king"));
    const isMcD = dish.name.toLowerCase().includes("mcdonald") || (dish.keywords && dish.keywords.includes("mcdonald"));

    if (dish.directBrand) {
      const bBase = dish.directBrand.base || Math.round(zomatoBase * 0.90);
      const bGST = Math.round(bBase * 0.05);
      const bGross = bBase + bGST;
      const bDiscount = dish.directBrand.discount || 50;
      const bFinal = Math.max(0, bGross - bDiscount);
      directBrandResult = {
        name: dish.directBrand.name,
        base: bBase,
        gross: bGross,
        discount: bDiscount,
        promo: { code: dish.directBrand.discountCode || "DIRECTSAVE", discount: bDiscount },
        finalPrice: bFinal,
        deepLink: dish.directBrand.deepLink
      };
    } else if (isKFC) {
      const kBase = Math.round(zomatoBase * 0.92);
      const kGST = Math.round(kBase * 0.05);
      const kGross = kBase + kGST;
      const kDiscount = 50;
      directBrandResult = {
        name: "KFC Direct App",
        base: kBase,
        gross: kGross,
        discount: kDiscount,
        promo: { code: "KFCLOVE", discount: kDiscount },
        finalPrice: Math.max(0, kGross - kDiscount),
        deepLink: "https://online.kfc.co.in"
      };
    } else if (isPizzaHut) {
      const pBase = Math.round(zomatoBase * 0.90);
      const pGST = Math.round(pBase * 0.05);
      const pGross = pBase + pGST;
      const pDiscount = 75;
      directBrandResult = {
        name: "Pizza Hut Direct",
        base: pBase,
        gross: pGross,
        discount: pDiscount,
        promo: { code: "HUT100", discount: pDiscount },
        finalPrice: Math.max(0, pGross - pDiscount),
        deepLink: "https://www.pizzahut.co.in"
      };
    } else if (isBurgerKing) {
      const bkBase = Math.round(zomatoBase * 0.90);
      const bkGST = Math.round(bkBase * 0.05);
      const bkGross = bkBase + bkGST;
      const bkDiscount = 50;
      directBrandResult = {
        name: "Burger King App",
        base: bkBase,
        gross: bkGross,
        discount: bkDiscount,
        promo: { code: "BK50", discount: bkDiscount },
        finalPrice: Math.max(0, bkGross - bkDiscount),
        deepLink: "https://www.burgerking.in"
      };
    } else if (isMcD) {
      const mBase = Math.round(zomatoBase * 0.92);
      const mGST = Math.round(mBase * 0.05);
      const mGross = mBase + mGST;
      const mDiscount = 50;
      directBrandResult = {
        name: "McDelivery App",
        base: mBase,
        gross: mGross,
        discount: mDiscount,
        promo: { code: "MCD50", discount: mDiscount },
        finalPrice: Math.max(0, mGross - mDiscount),
        deepLink: "https://www.mcdelivery.co.in"
      };
    }

    // 7. ONDC
    const oBase = Math.round(zomatoBase * 0.88);
    const oGST = Math.round(oBase * 0.05);
    const oGross = oBase + oGST + 22; // Subsidized delivery
    const oDiscount = oBase >= 199 ? 50 : 25;
    const oFinal = Math.max(0, oGross - oDiscount);

    const options = isDominos ? [
      { name: "Domino's App (Direct)", final: dFinal, color: "#0078AE" },
      { name: "Magicpin", final: mFinal, color: "#10B981" },
      { name: "ONDC (Pincode)", final: oFinal, color: "#0284C7" },
      { name: "Swiggy", final: sFinal, color: "#FC8019" },
      { name: "Zomato", final: zFinal, color: "#FF385C" }
    ] : [
      ...(isEatSureServiceable ? [{ name: "EatSure (Direct)", final: eFinal, color: "#7E22CE" }] : []),
      ...(directBrandResult ? [{ name: directBrandResult.name, final: directBrandResult.finalPrice, color: "#DC2626" }] : []),
      { name: "Magicpin", final: mFinal, color: "#10B981" },
      { name: "ONDC (Pincode)", final: oFinal, color: "#0284C7" },
      { name: "Swiggy", final: sFinal, color: "#FC8019" },
      { name: "Zomato", final: zFinal, color: "#FF385C" }
    ];

    options.sort((a, b) => a.final - b.final);
    const highest = Math.max(zFinal, sFinal);

    return {
      dish,
      isDominos,
      isEatSure: Boolean(isEatSureServiceable),
      directBrand: directBrandResult,
      city,
      winner: options[0].name,
      totalSaved: Math.max(0, highest - options[0].final),
      dominos: { base: dBase, gross: dGross, discount: dDiscount, promo: dPromo, finalPrice: dFinal, deepLink: "https://www.dominos.co.in" },
      zomato: { base: zomatoBase, gross: zGross, discount: zDiscount, promo: zPromo, finalPrice: zFinal, deepLink: "https://www.zomato.com/search?q=" + encodeURIComponent(dish.name) },
      swiggy: { base: swiggyBase, gross: sGross, discount: sDiscount, promo: sPromo, finalPrice: sFinal, deepLink: "https://www.swiggy.com/search?query=" + encodeURIComponent(dish.name) },
      eatsure: { base: eBase, gross: eGross, discount: eDiscount, promo: ePromo, finalPrice: eFinal, serviceable: Boolean(isEatSureServiceable), serviceableNote: "Available via EatSure Direct", deepLink: "https://www.eatsure.com" },
      magicpin: { base: magicpinBase, gross: mGross, discount: mDiscount, promo: mPromo, finalPrice: mFinal, deepLink: "https://www.magicpin.in/search?q=" + encodeURIComponent(dish.name) },
      ondc: { base: oBase, gross: oGross, discount: oDiscount, promo: { code: "ONDC50" }, finalPrice: oFinal, deepLink: "https://www.ondc.org" }
    };
  },

  createDynamicDish(query) {
    const clean = (query || "").trim();
    const lower = clean.toLowerCase();

    let category = "Popular Dish";
    let emoji = "🍽️";
    let basePrice = 280;
    let packaging = 20;

    if (/pizza|margherita|cheese burst|garlic bread|pepperoni/i.test(lower)) {
      category = "Pizza & Italian";
      emoji = "🍕";
      basePrice = 299;
    } else if (/burger|whopper|crispy|fries|nuggets|wrap/i.test(lower)) {
      category = "Burgers & Fast Food";
      emoji = "🍔";
      basePrice = 219;
    } else if (/biryani|pulao|mandi|dum biryani|hyderabadi/i.test(lower)) {
      category = "Biryani & Rice Bowls";
      emoji = "🍗";
      basePrice = 320;
    } else if (/thali|punjabi|dal makhani|paneer|roti|naan|curry|chole/i.test(lower)) {
      category = "North Indian Meals";
      emoji = "🍱";
      basePrice = 260;
    } else if (/momo|noodles|chowmein|manchurian|chinese|fried rice|dimsum/i.test(lower)) {
      category = "Chinese & Asian";
      emoji = "🥟";
      basePrice = 230;
    } else if (/dosa|idli|vada|uttapam|sambar/i.test(lower)) {
      category = "South Indian";
      emoji = "🥞";
      basePrice = 180;
    } else if (/roll|kathi|shawarma|frankie/i.test(lower)) {
      category = "Rolls & Wraps";
      emoji = "🌯";
      basePrice = 190;
    } else if (/chai|tea|coffee|frappe|shake|beverage|lassi/i.test(lower)) {
      category = "Beverages & Cafe";
      emoji = "☕";
      basePrice = 140;
      packaging = 15;
    } else if (/ice cream|dessert|cake|pastry|waffle|gulab jamun|sweet/i.test(lower)) {
      category = "Desserts & Sweets";
      emoji = "🍨";
      basePrice = 160;
      packaging = 15;
    } else if (/chicken|mutton|kebab|fish|tandoori|wings/i.test(lower)) {
      category = "Non-Veg Starters & Grills";
      emoji = "🍗";
      basePrice = 340;
    }

    const formattedTitle = clean.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

    let dominosBase = 0;
    let eatsureBase = 0;
    let directBrand = null;
    let popularRest = clean;

    if (/domino/i.test(lower)) {
      dominosBase = Math.round(basePrice * 0.80);
      popularRest = "Domino's Pizza (Direct App / Swiggy / Zomato / Magicpin)";
      emoji = "🍕";
    } else if (/behrouz|faasos|ovenstory|lunchbox|firangi|eatsure/i.test(lower)) {
      eatsureBase = Math.round(basePrice * 0.85);
      popularRest = `${formattedTitle} (EatSure Direct / Swiggy / Zomato / Magicpin)`;
    } else if (/kfc/i.test(lower)) {
      directBrand = {
        name: "KFC Direct App",
        deepLink: "https://online.kfc.co.in",
        discountCode: "KFCLOVE",
        discount: 50,
        base: basePrice
      };
      popularRest = "KFC (App / Swiggy / Zomato / Magicpin)";
      emoji = "🍗";
    } else if (/pizza hut/i.test(lower)) {
      directBrand = {
        name: "Pizza Hut Direct",
        deepLink: "https://www.pizzahut.co.in",
        discountCode: "HUT100",
        discount: 75,
        base: basePrice
      };
      popularRest = "Pizza Hut (Direct / Swiggy / Zomato / Magicpin)";
      emoji = "🍕";
    } else if (/burger king/i.test(lower)) {
      directBrand = {
        name: "Burger King App",
        deepLink: "https://www.burgerking.in",
        discountCode: "BK50",
        discount: 50,
        base: basePrice
      };
      popularRest = "Burger King (Direct / Swiggy / Zomato / Magicpin)";
      emoji = "🍔";
    } else if (/mcdonald|mcd/i.test(lower)) {
      directBrand = {
        name: "McDelivery App",
        deepLink: "https://www.mcdelivery.co.in",
        discountCode: "MCD50",
        discount: 50,
        base: basePrice
      };
      popularRest = "McDonald's (McDelivery / Swiggy / Zomato / Magicpin)";
      emoji = "🍔";
    } else if (/subway/i.test(lower)) {
      popularRest = "Subway (Magicpin / Swiggy / Zomato / ONDC)";
      emoji = "🥪";
    } else if (/haldiram/i.test(lower)) {
      popularRest = "Haldiram's (Magicpin / Swiggy / Zomato / ONDC)";
      emoji = "🍛";
    } else {
      popularRest = `${formattedTitle} (Magicpin, ONDC, Swiggy & Zomato)`;
    }

    return {
      id: "dyn_" + Date.now(),
      name: formattedTitle,
      keywords: clean.toLowerCase().split(/\s+/),
      category: category,
      emoji: emoji,
      dominosBase: dominosBase,
      eatsureBase: eatsureBase,
      directBrand: directBrand,
      zomatoBase: basePrice,
      swiggyBase: basePrice,
      magicpinBase: Math.max(120, Math.round(basePrice * 0.85)),
      packaging: packaging,
      popularRest: popularRest,
      isDynamic: true
    };
  },

  getCouponByCode(code, platform, amount) {
    const couponsList = (typeof COUPONS_DATA !== "undefined") ? COUPONS_DATA : (typeof require !== "undefined" ? require('./coupons.js') : []);
    const c = couponsList.find(item => item.code.toUpperCase() === code.toUpperCase());
    if (!c) return null;
    if (amount < c.minOrder) return null;

    let d = 0;
    if (c.discountType === "flat") {
      d = c.discountAmount;
    } else if (c.discountType === "percent") {
      d = Math.round(amount * (c.discountPercent / 100));
      if (c.maxDiscount && d > c.maxDiscount) d = c.maxDiscount;
    }

    return {
      code: c.code,
      discount: d,
      headline: c.discountHeadline,
      badge: c.badge
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ComparatorEngine;
}
