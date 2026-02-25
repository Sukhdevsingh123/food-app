import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";
import MenuItem from "../models/MenuItem.js";

dotenv.config();

const data = 
[
  // ================= PIZZAS =================
  {
    "name": "Margherita Classic",
    "description": "Fresh mozzarella, basil leaves & rich tomato sauce",
    "price": 299,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771903947/cKuBQqmt9b0oyXa_kMdGMyhQp-fMGmIoaPc1T3hDborg0r0NwRI6usEU2oLsyq8gGGMubTk7z0iCcJWgPl1kK1X7fNenPhxhV6mj1H1vP_M_1_gpgbqj.jpg",
    "category": "Pizza"
  },
  {
    "name": "Pepperoni Supreme",
    "description": "Loaded with spicy pepperoni & mozzarella cheese",
    "price": 399,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771903946/11508-lg_qlfg5q.webp",
    "category": "Pizza"
  },
  {
    "name": "BBQ Chicken Delight",
    "description": "Grilled chicken, BBQ sauce & onion toppings",
    "price": 449,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771903945/SKPZCv05GZI41aoOjN8JSlL7PeYXMsHjN7cv4VS_zGgeiT4brmWiY_aO8it2w24fki1fDpBBwD-D4CsDdWRtuJG0mua733w4y0qqVo23yow_e7xuzd.jpg",
    "category": "Pizza"
  },
  {
    "name": "Farmhouse Veggie Loaded",
    "description": "Capsicum, onion, tomato & mushrooms",
    "price": 379,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771903943/AR-24878-bbq-chicken-pizza-beauty-4x3-39cd80585ad04941914dca4bd82eae3d_zsm9hg.jpg",
    "category": "Pizza"
  },
  {
    "name": "Cheese Burst Explosion",
    "description": "Extra cheese stuffed crust pizza",
    "price": 499,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771903942/smoky-bbq-chicken-pizza-with-caramelized-onions-and-double-cheese_kisqe7.jpg",
    "category": "Pizza"
  },
  {
    "name": "Veggie Supreme",
    "description": "Loaded with olives, jalapenos & fresh veggies",
    "price": 419,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771903941/4AQqGTPNKMzsPqYL7n2fIin55pICzQ8iQUQk-Cky35DZB3D5dHX_VYzbAE_PZNbjxHws-lT9qtLmAnWSSU-2BMHKuMS5-PJO3BkABIIzhik_eabjp6.jpg",
    "category": "Pizza"
  },
  {
    "name": "Paneer Tikka Special",
    "description": "Indian style paneer tikka pizza",
    "price": 429,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771903939/rxTRTIWVQJvM8cvmjmCTOB9MI0WDQ5j4G20xbonjffsc4Eb5KCCklEhdyqXpLFhirkAKgJU6TXOKBueB1KqkqpECiSxasdueVuJ3al9tbxQ_efrvws.jpg",
    "category": "Pizza"
  },
  {
    "name": "Hawaiian Pineapple Twist",
    "description": "Sweet pineapple with smoked ham",
    "price": 459,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771903938/102186130_pizza-05b5b822404542e4bc71f80a0a346c5f_bwzzcv.jpg",
    "category": "Pizza"
  },
 
  // ================= BURGERS =================
  {
    "name": "Classic Cheeseburger",
    "description": "Juicy beef patty with cheddar cheese",
    "price": 199,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771903979/gBTmUmU_wVN2xCYQoxxgvZ7VXXKS6AHhzPODnUtNTBQl4dKOagkNsBcUmnLDAdug-cKkcsk8_CrmLVWibGaCJMsnoF_qHoie9qATj4QfNcg_faadym.jpg",
    "category": "Burger"
  },
  {
    "name": "Double Patty Smash Burger",
    "description": "Two grilled patties with special sauce",
    "price": 249,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771903978/Crispiest-buttermilk-fried-chicken-burgers-90854e5_gb35sw.jpg",
    "category": "Burger"
  },
  {
    "name": "Crispy Chicken Crunch",
    "description": "Fried crispy chicken fillet burger",
    "price": 229,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771903977/YV4HctqcO2ecbRh12LeQm7erfcut_STa-fwvqFw48nYx3a--HxtSD0X5ETHVDC8U-TpgyUIJH0kBl0BRdTDhZ0fpjsvR8tfxLMYffDSZG2k_j09tqb.jpg",
    "category": "Burger"
  },
  {
    "name": "BBQ Bacon Beast",
    "description": "Smoky bacon with BBQ sauce",
    "price": 269,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771903975/QTFP_J6yONkz9qWladLWdEgv8vGSCfnrIObhtUMUb5vhzf4mrS5oVQqLLXdPKSJd0pso8umYTPX_U6qyu8Q08MLUbSt036dvW6IrGesc0Lw_nxwa5z.jpg",
    "category": "Burger"
  },
  {
    "name": "Paneer Supreme Burger",
    "description": "Grilled paneer patty with creamy sauce",
    "price": 219,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771903974/image-281299-1765016980_ce5jyp.jpg",
    "category": "Burger"
  },
  {
    "name": "Mushroom Swiss Melt",
    "description": "Sauteed mushrooms & swiss cheese",
    "price": 239,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771903973/1675435333436_juzkvg.webp",
    "category": "Burger"
  },
  {
    "name": "Jalapeno Heat Burger",
    "description": "Spicy jalapenos & hot sauce",
    "price": 209,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771903971/Crispy-fried-chicken-burgers_5_cisaip.webp",
    "category": "Burger"
  },
  {
    "name": "Veg Aloo Tikki Delight",
    "description": "Indian style aloo tikki burger",
    "price": 179,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771903970/L7mYrjlbD4SMmhbmL5Sq3XlmTzGQh5WH2MQ78P14hNfCncoAkoY6K9qmaqBuDokomQs6oHnEdohJDAnvouP101TUOgL4fYKdu68XNIV6eds_siaaey.jpg",
    "category": "Burger"
  },
  

  // ================= DRINKS =================
  {
    "name": "Coca-Cola Classic",
    "description": "Refreshing chilled cola",
    "price": 79,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771904117/tips-for-homemade-lemonade-clakryojl001hpw1b4lyg3b9u_lkftog.webp",
    "category": "Drinks"
  },
  {
    "name": "Pepsi Chill",
    "description": "Ice cold refreshing Pepsi",
    "price": 79,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771904115/IMG_2009_kc6sz9.webp",
    "category": "Drinks"
  },
  {
    "name": "Fresh Lemonade",
    "description": "Homemade tangy lemonade",
    "price": 99,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771904114/32385-best-lemonade-ever-step-5-186-4b3caf581d6c4f6084c01077a4d6e09a_fi0hus.jpg",
    "category": "Drinks"
  },
  {
    "name": "Mango Smoothie",
    "description": "Creamy fresh mango smoothie",
    "price": 129,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771904112/oncbYb27XUavlX-VTrK_vVjTBAvWmD5myay90Z5Gq82QkFBP4L98MB_k6DgTwJZ_c1saili5aUUylCJMhLjARZNBmO4lnbvRKOVkZ5Yy5HI_ckt2wd.jpg",
    "category": "Drinks"
  },
  {
    "name": "Chocolate Milkshake",
    "description": "Rich chocolate milkshake",
    "price": 149,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771904111/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2016__06__20160620-lemonade-vicky-wasik-cb829ad5574f4d0eac2d387f8694a954_on76me.jpg",
    "category": "Drinks"
  },
  {
    "name": "Iced Coffee",
    "description": "Cold brewed iced coffee",
    "price": 139,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771904109/Lemonade-Non-ShowRecipe-OR_Category-CategoryPageDefault_ID-915346_svfibl.jpg",
    "category": "Drinks"
  },
  {
    "name": "Cold Coffee with Ice Cream",
    "description": "Cold coffee topped with vanilla scoop",
    "price": 159,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771904109/Pepsi-Drinking-Glass-02-GDA_zi9o1j.jpg",
    "category": "Drinks"
  },
  {
    "name": "Fresh Orange Juice",
    "description": "Freshly squeezed orange juice",
    "price": 119,
    "image": "https://res.cloudinary.com/dobf5t7wc/image/upload/v1771904108/Simply-Recipes-Perfect-Lemonade-LEAD-06-B-a488322e63604cd6a1442de661722553_mj6vfo.jpg",
    "category": "Drinks"
  }
]

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Category.deleteMany();
  await MenuItem.deleteMany();

  const pizza = await Category.create({ name: "Pizza" });
  const burger = await Category.create({ name: "Burger" });
  const drinks = await Category.create({ name: "Drinks" });

  const formatted = data.map(item => {
    let categoryId;

    if (item.category === "Pizza") categoryId = pizza._id;
    if (item.category === "Burger") categoryId = burger._id;
    if (item.category === "Drinks") categoryId = drinks._id;

    return { ...item, category: categoryId };
  });

  await MenuItem.insertMany(formatted);

  console.log("Seed data inserted");
  process.exit();
};

seed();