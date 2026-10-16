// Foodie Hu Mai - Popular Indian Dishes Database
// Real-world baseline pricing across Zomato, Swiggy, and Magicpin/ONDC

const DISHES_DATA = [
  {
    id: "d_dominos_pizza",
    name: "Domino's Peppy Paneer Pizza (Medium)",
    keywords: ["dominos", "domino's", "dominos pizza", "peppy paneer", "pizza", "paneer pizza", "cheese"],
    category: "Pizza & Fast Food",
    emoji: "🍕",
    dominosBase: 485, // Exact live menu price on dominos.co.in
    zomatoBase: 485,
    swiggyBase: 485,
    magicpinBase: 485,
    packaging: 0,
    popularRest: "Domino's Official App vs Magicpin vs Swiggy vs Zomato",
    typicalDiscount: "GET30 (Live Web ₹30 OFF) • App: DOMNEW (₹100)"
  },
  {
    id: "d_dominos_margherita",
    name: "Domino's Classic Margherita (Medium)",
    keywords: ["dominos margherita", "margherita", "cheese pizza", "dominos"],
    category: "Pizza & Fast Food",
    emoji: "🍕",
    dominosBase: 279, // Exact official live menu price on dominos.co.in
    zomatoBase: 279,
    swiggyBase: 279,
    magicpinBase: 279,
    packaging: 0,
    popularRest: "Domino's Official App & Web (Direct Jubilant)",
    typicalDiscount: "DOM50 (50% OFF up to ₹100)"
  },
  {
    id: "d_dominos_double_cheese",
    name: "Domino's Double Cheese Margherita (Medium)",
    keywords: ["double cheese", "double cheese margherita", "margherita", "dominos double cheese", "pizza", "dominos"],
    category: "Pizza & Fast Food",
    emoji: "🍕",
    dominosBase: 345, // Exact live menu price on dominos.co.in from user screenshot
    zomatoBase: 345,
    swiggyBase: 345,
    magicpinBase: 345,
    packaging: 0,
    popularRest: "Domino's Official App & Web",
    typicalDiscount: "GET30 (Flat ₹30 OFF + Free Delivery)"
  },
  {
    id: "d_dominos_mania",
    name: "Domino's Pizza Mania (Golden Corn / Capsicum)",
    keywords: ["dominos 99", "pizza mania", "99 pizza", "dominos mania"],
    category: "Pizza & Fast Food",
    emoji: "🍕",
    dominosBase: 99, // Official Pizza Mania rate
    zomatoBase: 129,
    swiggyBase: 129,
    magicpinBase: 99,
    packaging: 0,
    popularRest: "Domino's Official App (Pizza Mania Tab)",
    typicalDiscount: "EDV99 (Everyday Value 2 @ ₹99)"
  },
  {
    id: "d_biryani",
    name: "Behrouz Shahi Chicken Dum Biryani",
    keywords: ["biryani", "chicken biryani", "dum biryani", "behrouz", "rice"],
    category: "Main Course",
    emoji: "🍗",
    dominosBase: 0,
    zomatoBase: 419, // Exact official Behrouz menu price
    swiggyBase: 419,
    magicpinBase: 360,
    packaging: 25,
    popularRest: "Behrouz Biryani / Swiggy / Zomato",
    typicalDiscount: "TRYNEW (60% OFF up to ₹120)"
  },
  {
    id: "d_butter_chicken",
    name: "Butter Chicken with 2 Butter Naan",
    keywords: ["butter chicken", "chicken", "naan", "curry", "punjabi", "murgh"],
    category: "North Indian",
    emoji: "🍲",
    zomatoBase: 380,
    swiggyBase: 370,
    magicpinBase: 310,
    packaging: 25,
    popularRest: "Dhaba Express / Moti Mahal / Punjabi Rasoi",
    typicalDiscount: "JUMBO (₹150 OFF)"
  },
  {
    id: "d_burger",
    name: "Burger King Crispy Veg Burger Peri Peri Meal (R)",
    keywords: ["burger", "crispy veg", "peri peri meal", "burger king", "whopper", "mcdonalds", "fries", "coke"],
    category: "Fast Food",
    emoji: "🍔",
    zomatoBase: 297,
    swiggyBase: 297, // Exact live Swiggy Burger King cart rate (₹297 slashed to ₹172)
    magicpinBase: 230,
    packaging: 15,
    popularRest: "Burger King (Swiggy 99 Store & Magicpin)",
    typicalDiscount: "99 STORE (Items at ₹148 + Free Delivery ➔ ₹172)"
  },
  {
    id: "d_paneer_tikka",
    name: "Paneer Butter Masala + Garlic Naan",
    keywords: ["paneer", "paneer butter masala", "kadai paneer", "veg", "shahi paneer"],
    category: "North Indian",
    emoji: "🧀",
    zomatoBase: 330,
    swiggyBase: 320,
    magicpinBase: 270,
    packaging: 20,
    popularRest: "Sagar Ratna / Pind Balluchi / Haldiram's",
    typicalDiscount: "TRYNEW (60% OFF)"
  },
  {
    id: "d_momos",
    name: "Crispy Kurkure Momos (Natural 2 / Wow! Momo)",
    keywords: ["momos", "dimsum", "kurkure momos", "kurkure", "natural 2", "chinese", "snacks"],
    category: "Snacks",
    emoji: "🥟",
    zomatoBase: 270,
    swiggyBase: 270, // Exactly matches live Swiggy 'Natural 2' cart rate (₹270)
    magicpinBase: 210,
    packaging: 15,
    popularRest: "Natural 2 / Wow! Momo / Local Street Point",
    typicalDiscount: "TRYNEW (60% OFF up to ₹120)"
  },
  {
    id: "d_chole_bhature",
    name: "Special Chole Bhature (2 Pcs with Chutney)",
    keywords: ["chole bhature", "chhole", "bhature", "breakfast", "punjabi"],
    category: "Breakfast & Lunch",
    emoji: "🍳",
    zomatoBase: 190,
    swiggyBase: 180,
    magicpinBase: 150,
    packaging: 15,
    popularRest: "Nagpal / Sita Ram / Haldiram's / Bikaner",
    typicalDiscount: "LUNCHBOX (₹60 OFF)"
  },
  {
    id: "d_cold_coffee",
    name: "Thick Chocolate Cold Coffee / Frappe",
    keywords: ["cold coffee", "coffee", "shake", "frappe", "beverage", "beverages"],
    category: "Beverages",
    emoji: "🧋",
    zomatoBase: 160,
    swiggyBase: 150,
    magicpinBase: 120,
    packaging: 15,
    popularRest: "Café Coffee Day / Starbucks / Keventers",
    typicalDiscount: "CHAI50 (30% OFF)"
  },
  {
    id: "d_dosa",
    name: "Masala Dosa with Sambhar & Coconut Chutney",
    keywords: ["dosa", "masala dosa", "south indian", "idli", "vada", "sambhar"],
    category: "South Indian",
    emoji: "🥞",
    zomatoBase: 210,
    swiggyBase: 200,
    magicpinBase: 165,
    packaging: 18,
    popularRest: "Sagar Ratna / Saravana Bhavan / Naivedyam",
    typicalDiscount: "STEALDEAL (40% OFF)"
  },
  {
    id: "d_noodles",
    name: "Veg Hakka Noodles & Manchurian Combo",
    keywords: ["noodles", "hakka noodles", "manchurian", "chinese", "fried rice"],
    category: "Chinese",
    emoji: "🍜",
    zomatoBase: 260,
    swiggyBase: 250,
    magicpinBase: 210,
    packaging: 20,
    popularRest: "Mainland China / Berco's / Chopsticks",
    typicalDiscount: "TRYNEW (50% OFF)"
  },
  {
    id: "d_roll",
    name: "Double Egg Chicken Kathi Roll",
    keywords: ["roll", "kathi roll", "chicken roll", "egg roll", "shawarma"],
    category: "Snacks",
    emoji: "🌯",
    zomatoBase: 190,
    swiggyBase: 185,
    magicpinBase: 150,
    packaging: 12,
    popularRest: "Rolls King / Faasos / Khan Chacha",
    typicalDiscount: "SWIGGYIT (25% OFF)"
  },
  {
    id: "d_thali",
    name: "Deluxe Punjabi Thali (Dal Makhani, Shahi Paneer, Rice, 3 Roti, Gulab Jamun)",
    keywords: ["thali", "punjabi thali", "deluxe thali", "lunch", "meal"],
    category: "Lunch & Dinner",
    emoji: "🍱",
    zomatoBase: 320,
    swiggyBase: 310,
    magicpinBase: 250,
    packaging: 25,
    popularRest: "Bikanervala / Haldiram's / Giani's Dhaba",
    typicalDiscount: "LUNCHBOX (₹60 OFF)"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DISHES_DATA;
}
