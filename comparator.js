// Foodie Hu Mai - Reverse-Engineered Multi-Platform Bill Comparator Engine
// Accurately reverse-engineers Domino's vs Swiggy vs Zomato vs Magicpin bill structures

const ComparatorEngine = {
  // Detects whether a city is a direct EatSure serviceable metro
  isMetroCity(city) {
    if (!city) return false;
    const c = String(city).toLowerCase();
    const metros = ["delhi", "ncr", "gurgaon", "noida", "mumbai", "bengaluru", "bangalore", "pune", "hyderabad", "chennai", "kolkata"];
    return metros.some(m => c.includes(m));
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
        serviceable: isEatSureServiceable,
        serviceableNote: isEatSureServiceable ? "Available for direct delivery" : `Direct app not serving in ${city || 'this city'} • Order via Swiggy/Zomato`,
        base: eatsureBase,
        gst: eatsureGST,
        platformFee: eatsurePlatform,
        packaging: eatsurePackaging,
        delivery: eatsureDelivery,
        discount: eatsureDiscount,
        promoCode: "SURE50",
        promoHeadline: isEatSureServiceable ? "Flat 50% OFF + Zero Delivery Fee" : "Metro Only (Delhi/Mumbai/Blr)",
        finalPrice: eatsureFinal,
        isWinner: isEatSureServiceable && winner.name.includes("EatSure"),
        deepLink: isEatSureServiceable ? "https://www.eatsure.com" : "https://www.swiggy.com/search?query=behrouz+biryani"
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

    // 5. EatSure (Direct Brand Platform)
    const isEatSureServiceable = this.isMetroCity(city);
    const eBase = Math.round(zomatoBase * 0.92);
    const eGST = Math.round(eBase * 0.05);
    const eGross = eBase + eGST; // Zero platform fee, zero packaging, zero delivery
    const ePromo = manualCouponCode ? this.getCouponByCode(manualCouponCode, "EatSure", eBase) : { code: "SURE50", discount: Math.min(150, Math.round(eBase * 0.50)) };
    const eDiscount = ePromo ? ePromo.discount : 75;
    const eFinal = Math.max(0, eGross - eDiscount);

    // 6. ONDC
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
      city,
      winner: options[0].name,
      totalSaved: Math.max(0, highest - options[0].final),
      dominos: { base: dBase, gross: dGross, discount: dDiscount, promo: dPromo, finalPrice: dFinal, deepLink: "https://www.dominos.co.in" },
      zomato: { base: zomatoBase, gross: zGross, discount: zDiscount, promo: zPromo, finalPrice: zFinal, deepLink: "https://www.zomato.com/search?q=" + encodeURIComponent(dish.name) },
      swiggy: { base: swiggyBase, gross: sGross, discount: sDiscount, promo: sPromo, finalPrice: sFinal, deepLink: "https://www.swiggy.com/search?query=" + encodeURIComponent(dish.name) },
      eatsure: { base: eBase, gross: eGross, discount: eDiscount, promo: ePromo, finalPrice: eFinal, serviceable: isEatSureServiceable, serviceableNote: isEatSureServiceable ? "Available" : `EatSure direct not in ${city || 'this area'}`, deepLink: isEatSureServiceable ? "https://www.eatsure.com" : "https://www.swiggy.com/search?query=" + encodeURIComponent(dish.name) },
      magicpin: { base: magicpinBase, gross: mGross, discount: mDiscount, promo: mPromo, finalPrice: mFinal, deepLink: "https://www.magicpin.in/search?q=" + encodeURIComponent(dish.name) },
      ondc: { base: oBase, gross: oGross, discount: oDiscount, promo: { code: "ONDC50" }, finalPrice: oFinal, deepLink: "https://www.ondc.org" }
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
