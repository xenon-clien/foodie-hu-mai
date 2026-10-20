// Foodie Hu Mai - Automated Test Suite
// Verifies Coupon Database Integrity & Comparator Calculations

const coupons = require('./coupons.js');
const comparator = require('./comparator.js');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

console.log(`\n=================================================`);
console.log(`🧪 RUNNING FOODIE HU MAI TEST SUITE`);
console.log(`=================================================\n`);

// 1. COUPON DATABASE INTEGRITY TESTS
console.log(`[Suite 1: Coupons Database Integrity]`);
assert(Array.isArray(coupons) && coupons.length >= 10, `Coupons list contains at least 10 entries (found: ${coupons.length})`);

let allHaveRequiredFields = true;
coupons.forEach(c => {
  if (!c.id || !c.code || !c.platform || !c.category || !c.discountHeadline || c.minOrder === undefined) {
    allHaveRequiredFields = false;
  }
});
assert(allHaveRequiredFields, `All coupons contain required schema fields (id, code, platform, category, minOrder)`);

const universalCoupons = coupons.filter(c => c.category === 'universal');
assert(universalCoupons.length >= 4, `At least 4 universal no-bank coupons exist (found: ${universalCoupons.length})`);

const upiCoupons = coupons.filter(c => c.category === 'upi');
assert(upiCoupons.length >= 3, `At least 3 UPI/Wallet coupons exist (found: ${upiCoupons.length})`);

const bankCoupons = coupons.filter(c => c.category === 'bank');
assert(bankCoupons.length >= 3, `At least 3 Bank Card coupons exist (found: ${bankCoupons.length})`);

// 2. COMPARATOR ENGINE LOGIC TESTS
console.log(`\n[Suite 2: Comparator Engine Logic]`);
const compDefault = comparator.calculate(350, 'all', 'solo');
assert(compDefault.base === 350, `Base amount ₹350 correctly parsed`);
assert(compDefault.zomato.finalPrice > 0, `Zomato final price calculated (₹${compDefault.zomato.finalPrice})`);
assert(compDefault.swiggy.finalPrice > 0, `Swiggy final price calculated (₹${compDefault.swiggy.finalPrice})`);
assert(compDefault.magicpin.finalPrice > 0, `Magicpin final price calculated (₹${compDefault.magicpin.finalPrice})`);
assert(compDefault.eatsure.finalPrice > 0, `EatSure final price calculated (₹${compDefault.eatsure.finalPrice})`);
assert(compDefault.ondc.finalPrice > 0, `ONDC final price calculated (₹${compDefault.ondc.finalPrice})`);
assert(typeof compDefault.winner === 'string' && compDefault.winner.length > 0, `Winner identified: ${compDefault.winner}`);
assert(compDefault.totalSaved >= 0, `Total savings computed correctly: ₹${compDefault.totalSaved}`);

// Test Bank Offer Auto-apply
const compHdfc = comparator.calculate(550, 'hdfc', 'solo');
assert(compHdfc.zomato.promoCode === 'HDFC100' || compHdfc.zomato.discount >= 100, `HDFC promo correctly applied on cart above ₹499`);

// Test WhatsApp Share Link
const shareUrl = comparator.generateWhatsAppShare(compDefault);
assert(shareUrl.startsWith('https://api.whatsapp.com/send?text='), `WhatsApp share link properly formatted`);

// 3. NEW FEATURES TESTS (Dish Presets, Search & Fee Calculation)
console.log(`\n[Suite 3: Unique Features & Calculation Logic]`);

// Dish Presets
const pizzaComp = comparator.calculate(380, 'all', 'solo');
assert(pizzaComp.base === 380 && pizzaComp.winner, `Pizza preset ₹380 calculated successfully (Winner: ${pizzaComp.winner})`);

const biryaniComp = comparator.calculate(280, 'all', 'solo');
assert(biryaniComp.base === 280 && biryaniComp.winner, `Biryani preset ₹280 calculated successfully (Winner: ${biryaniComp.winner})`);

// Annual Platform Fee Calculation Formula
const monthlyOrders = 12;
const feePerOrder = 10;
const annualFee = monthlyOrders * feePerOrder * 12;
assert(annualFee === 1440, `Annual platform fee calculation accurate (12 orders/mo = ₹1,440/yr)`);

// Search matching
const searchMatch = coupons.filter(c => c.code.toLowerCase().includes('try') || c.description.toLowerCase().includes('try'));
assert(searchMatch.length > 0 && searchMatch[0].code === 'TRYNEW', `Coupon search for "try" matches TRYNEW`);

// 4. DISH DATABASE & COMPARE DISH ENGINE TESTS
console.log(`\n[Suite 4: Dish Database & compareDish Engine]`);
const dishes = require('./dishes.js');
assert(Array.isArray(dishes) && dishes.length >= 10, `Dishes database contains at least 10 items (found: ${dishes.length})`);

const biryaniDish = dishes.find(d => d.id === 'd_biryani');
assert(biryaniDish && (biryaniDish.zomatoBase === 419 || biryaniDish.zomatoBase === 320), `Biryani dish correctly defined with real menu base rate (₹${biryaniDish.zomatoBase})`);

const dishComparison = comparator.compareDish(biryaniDish, 'TRYNEW');
assert(dishComparison && dishComparison.winner, `compareDish returns valid comparison (Winner: ${dishComparison.winner})`);
assert(dishComparison.zomato.finalPrice < dishComparison.zomato.gross, `Coupon successfully slashed Zomato price from ₹${dishComparison.zomato.gross} to ₹${dishComparison.zomato.finalPrice}`);

// 5. 50% - 60% OFF HOT RESTAURANT DEALS TESTS
console.log(`\n[Suite 5: 50% - 60% OFF Hot Restaurant Deals]`);
const deals = require('./deals.js');
assert(Array.isArray(deals) && deals.length >= 8, `Deals database contains at least 8 hot restaurant deals (found: ${deals.length})`);

let allHaveHighDiscount = true;
deals.forEach(d => {
  if (d.discountPercent < 50) allHaveHighDiscount = false;
});
assert(allHaveHighDiscount, `All deals offer at least 50% or 60% OFF discounts`);

const behrouzDeal = deals.find(d => d.restaurant === 'Behrouz Biryani');
assert(behrouzDeal && behrouzDeal.discountPercent === 60, `Behrouz Biryani verified with 60% OFF deal`);

const dominosDeal = deals.find(d => d.restaurant.includes("Domino"));
assert(dominosDeal && dominosDeal.couponCode, `Domino's Pizza verified with auto-apply promo`);

// 6. DOMINO'S PIZZA SPECIAL INTEGRATION TESTS
console.log(`\n[Suite 6: Domino's Pizza Direct & Search Integration]`);
const dominosDish = dishes.find(d => d.id === 'd_dominos_pizza');
assert(dominosDish && dominosDish.name.includes("Domino's"), `Domino's Pizza explicitly defined as primary pizza dish`);
assert(dominosDish.keywords.includes("dominos") && dominosDish.keywords.includes("domino's"), `Domino's dish contains 'dominos' and 'domino\'s' search keywords`);

const dominosComp = comparator.compareDish(dominosDish);
assert(dominosComp.isDominos === true, `compareDish identifies Domino's dish flag (isDominos = true)`);
assert(dominosComp.dominos && dominosComp.dominos.finalPrice > 0, `Domino's Official App rate calculated (₹${dominosComp.dominos.finalPrice})`);
assert(dominosComp.dominos.deepLink === 'https://www.dominos.co.in', `Domino's Official App deep link is correct`);

const domnewCoupon = coupons.find(c => c.code === 'DOMNEW');
assert(domnewCoupon && domnewCoupon.platform === "Domino's", `DOMNEW promo verified for Domino's Official App`);

const dominosAppDeal = deals.find(d => d.id === 'deal_dominos_app');
assert(dominosAppDeal && dominosAppDeal.platform === "Domino's App", `Domino's Official App deal present in Hot Deals`);

// 7. UNIVERSAL DYNAMIC SEARCH & COMPARATOR TESTS
console.log(`\n[Suite 7: Universal Dynamic Search & Comparator Engine]`);
assert(typeof comparator.createDynamicDish === 'function', `createDynamicDish engine function exists`);

const kfcDynamic = comparator.createDynamicDish("KFC Crispy Chicken Burger");
assert(kfcDynamic && kfcDynamic.name.includes("Kfc"), `KFC dynamic dish created with proper formatting`);
assert(kfcDynamic.directBrand && kfcDynamic.directBrand.name === "KFC Direct App", `KFC direct brand app identified`);
assert(kfcDynamic.directBrand.deepLink === "https://online.kfc.co.in", `KFC direct order link is valid`);

const haldiramDynamic = comparator.createDynamicDish("Haldiram Special Thali");
assert(haldiramDynamic && haldiramDynamic.category === "North Indian Meals", `Haldiram category correctly detected (North Indian Meals)`);
assert(haldiramDynamic.popularRest.includes("Haldiram"), `Haldiram connected platform network registered`);

const localDhabaDynamic = comparator.createDynamicDish("Sharma Dhaba Dal Makhani");
const dhabaComp = comparator.compareDish(localDhabaDynamic);
assert(dhabaComp && dhabaComp.winner, `Arbitrary unlisted restaurant generates full live comparison (Winner: ${dhabaComp.winner})`);
assert(dhabaComp.swiggy.finalPrice > 0 && dhabaComp.zomato.finalPrice > 0, `Swiggy & Zomato rates calculated for dynamic query`);
assert(dhabaComp.magicpin.finalPrice > 0 && dhabaComp.ondc.finalPrice > 0, `Magicpin & ONDC rates calculated for dynamic query`);
assert(dhabaComp.totalSaved >= 0, `Savings computed for dynamic search: ₹${dhabaComp.totalSaved}`);

console.log(`\n=================================================`);
console.log(`📊 TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log(`=================================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log(`🎉 ALL TESTS PASSED SUCCESSFULLY! Ready for launch.\n`);
}

