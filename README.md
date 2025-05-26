#  E-Commerce Backend (with SSLCommerz Payment Integration)

This is the server-side of an **"Shopfront"** web application. The backend manages product data, user carts, category-wise filtering, discounts, orders, and online payments through SSLCommerz.
##Client-Side Repository: https://github.com/tahminaakterbristy/Shopfront-Client


##  Features

###  Product & Category
- Product data is dynamically fetched from the database.
- Products can be filtered and viewed based on their category.

###  Discounts & Delivery
- Discounted products and free delivery items are loaded from backend endpoints.

###  Cart & Orders
- Users can add products to their cart.
- Cart items can be viewed and managed via the "My Cart" section.
- Users can also see their **previous orders** (Order History).

### 💳Online Payment
- Integrated with **SSLCommerz** for secure online payment processing.
- After successful payment, the order is recorded in the system.



##  Tech Stack

- **Runtime:** Node.js  
- **Database:** MongoDB  
- **Authentication:** Firebase Auth or JWT  
- **Payment Gateway:** SSLCommerz  
- **Environment Config:** dotenv


