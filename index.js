require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { default: axios } = require("axios");

// const qs = require('qs');

const app = express();
const port = process.env.PORT || 8000;

// Middleware

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());


// MongoDB Connection
const uri = process.env.DB_URI;
console.log("MongoDB URI:", uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect(); // MongoDB
    console.log("Connected to MongoDB!");

    const db = client.db("shopfront");

    const productCollection = db.collection("products");
    const electronicsCollection = db.collection("electronics");
    const fashionCollection = db.collection("fashion");
    const homeDecorCollection = db.collection("homeDecor");
    const toyCollection = db.collection("toys");
    const booksCollection = db.collection("books");
    const makeupCollection = db.collection("makeUps");
    const discountCollection = db.collection("discountedProducts");
    const saleCollection = db.collection("seasonalSale");
    const cartCollection = db.collection("carts");
    const orderCollection = db.collection("orders");
    const sslCollection = db.collection("payments");

    // Generic GET route handler
    const getCollectionData = (collection) => async (req, res) => {
      const result = await collection.find().toArray();
      res.send(result);
    };

    app.get("/products", getCollectionData(productCollection));
    app.get("/fashion", getCollectionData(fashionCollection));
    app.get("/homeDecor", getCollectionData(homeDecorCollection));
    app.get("/toys", getCollectionData(toyCollection));
    app.get("/books", getCollectionData(booksCollection));
    app.get("/electronics", getCollectionData(electronicsCollection));
    app.get("/makeUps", getCollectionData(makeupCollection));
    app.get("/discountedProducts", getCollectionData(discountCollection));
    app.get("/seasonalSale", getCollectionData(saleCollection));
    app.get("/payments", getCollectionData(sslCollection));

    // Cart Functionality
    app.post("/carts", async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });

    app.get("/carts/:email", async (req, res) => {
      const email = req.params.email;
      const cartItems = await cartCollection.find({ email }).toArray();
      res.send(cartItems);
    });

    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res
          .status(400)
          .send({ success: false, message: "Invalid cart item ID" });
      }
      const result = await cartCollection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount > 0) {
        res.send({ success: true, message: "Item deleted successfully" });
      } else {
        res.status(404).send({ success: false, message: "Item not found" });
      }
    });

    // Orders Functionality
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const orders = await orderCollection.find({ email }).toArray();
      res.send(orders);
    });

    // Payment Intent API
    // app.post("/create-payment", async (req, res) => {
    //   const productInfo = {
    //     amount: amount,
    //     currency: "BDT",
    //     tran_id: "uuidv4()",
    //     success_url: "http://localhost:8000/success",
    //     fail_url: "http://localhost:8000/failure",
    //     cancel_url: "http://localhost:8000/cancel",
    //     ipn_url: "http://localhost:8000/ipn",
    //     paymentStatus: "pending",
    //     shipping_method: "Courier",
    //     product_name: req.body.product_name,
    //     product_category: "Membership",
    //     product_profile: req.body.product_profile,
    //     product_image: req.body.product_image,
    //     cus_name: req.body.cus_name,
    //     cus_email: req.body.cus_email,
    //     cus_add1: "Dhaka",
    //     cus_add2: "Dhaka",
    //     cus_city: "Dhaka",
    //     cus_state: "Dhaka",
    //     cus_postcode: "1000",
    //     cus_country: "Bangladesh",
    //     cus_phone: "01711111111",
    //     cus_fax: "01711111111",
    //     ship_name: req.body.cus_name,
    //     ship_add1: "Dhaka",
    //     ship_add2: "Dhaka",
    //     ship_city: "Dhaka",
    //     ship_state: "Dhaka",
    //     ship_postcode: 1000,
    //     ship_country: "Bangladesh",
    //     multi_card_name: "mastercard",
    //     value_a: "ref001_A",
    //     value_b: "ref002_B",
    //     value_c: "ref003_C",
    //     value_d: "ref004_D",
    //   };

    //   const result = await sslCollection.insertOne(productInfo);

    //   const sslcommer = new SSLCommerzPayment(
    //     process.env.STORE_ID,
    //     process.env.STORE_PASSWORD,
    //     false
    //   );

    //   sslcommer.init(productInfo).then((data) => {
    //     const info = { ...productInfo, ...data };

    //     if (info.GatewayPageURL) {
    //       res.json({ success_url: info.GatewayPageURL }); // ✅ correct format
    //     } else {
    //       return res
    //         .status(400)
    //         .json({ message: "SSL session was not successful" });
    //     }
    //   });
    // });

    // app.post("/success", async (req, res) => {
    //   const result = await sslCollection.updateOne(
    //     { tran_id: req.body.tran_id },
    //     { $set: { val_id: req.body.val_id, paymentStatus: "paid" } }
    //   );

    //   res.redirect(`http://localhost:8000/success/${req.body.tran_id}`);
    // });

    app.get("/ssl", async (req, res) => {
      res.send({ message: "SSL Test API Working" });
    });
    app.post("/add-payment", async (req, res) => {
      const paymentInfo = req.body;
     const trxId = new ObjectId().toString();
      const initiateData = {
        store_id: "progr67f5bbd52b6bc",
        store_passwd: "progr67f5bbd52b6bc@ssl",
        total_amount: paymentInfo.amount,
        currency: "BDT",
        tran_id: trxId,
        success_url: "http://localhost:8000/success-payment",
        fail_url: "http://localhost:8000/fail",
        cancel_url: "http://localhost:8000/cancel",
        cus_name: "Customer Name",
        cus_email: "cust@yahoo.com",
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: "1000",
        shipping_method: "NO",
        product_name: "Laptop",
        product_category: "Electronics",
        product_profile: "Electronics",
        ship_country: "Bangladesh",
        multi_card_name: "mastercard,visacard,amexcard",
        value_a: "ref001_A",
        value_b: "ref002_B",
        value_c: "ref003_C",
        value_d: "ref004_D",
        
      };
      

      const response = await axios({
        method: "POST",
        url:  "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
        data: initiateData,
        
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
       
      const saveData = {
        cus_name: "Dummy",
        paymentId: trxId,
        amount: paymentInfo.amount,
        status: "pending",
      };
     
      const save = await sslCollection.insertOne(saveData);
      if (save) {
        res.send({
          paymentUrl: response.data.GatewayPageURL,
        });
      }
    });
// Update payment status
    app.post("/success-payment", async (req, res) => {
      const success = req.body;

      if (success.status !== "VALID"){
        throw new Error('Unauthorized Payment');
      }

      const query = {
        paymentId : success.tran_id
      }

      const update = {
        $set: {
          status: "Success",
        },
      }
      const updateData = await sslCollection.updateOne(query, update);
      console.log("success", success);
      console.log("dataUpdated", updateData);

      res.redirect("http://localhost:5173/success");
    });
    // Fail Url
    app.post("/fail", async (req, res) => {
    res.redirect("http://localhost:5173/fail");
    });
    app.post("/cancel", async (req, res) => {
      res.redirect("http://localhost:5173/cancel");
    });
    // Search API
    app.get("/search", async (req, res) => {
      try {
        const { query, category } = req.query;
        let filter = {};

        if (category) {
          filter.category = category;
        }
        if (query) {
          filter.$or = [
            { name: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ];
        }

        const products = await productCollection.find(filter).toArray();
        res.json(products);
      } catch (error) {
        res.status(500).json({ message: "Server Error", error });
      }
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`ShopFront is running on port ${port}`);
});
