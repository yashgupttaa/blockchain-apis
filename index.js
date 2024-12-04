const express = require('express');
const { ethers } = require('ethers');
require('dotenv').config();
const abi = require('./ReviewStorageABI.json');

const app = express();
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, abi, wallet);

console.log("contract", contract);


// app.post('/addReview', async (req, res) => {
//     const { rating, reviewText, productId, userId } = req.body;
//     try {
//         const tx = await contract.addReview(rating, reviewText, productId, userId);
//         await tx.wait();
//         res.send({ message: "Review added successfully!", tx });
//     } catch (error) {
//         res.status(500).send({ error: error.message });
//     }
// });

app.post('/addReview', async (req, res) => {
    const { rating, reviewText, productId, userId } = req.body;
    try {
        const tx = await contract.addReview(rating, reviewText, productId, userId);
        res.send({
            message: "Transaction submitted. Review will be added upon confirmation.",
            txHash: tx.hash
        });

        const receipt = await tx.wait();
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/getReviews', async (req, res) => {
    try {
        const reviews = await contract.getAllReviews();
        const formattedReviews = reviews.map((review) => ({
            rating: review.rating.toString(),
            reviewText: review.reviewText,
            productId: review.productId,
            userId: review.userId
        }));

        res.send(formattedReviews);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));