const Transaction = require('../models/Transaction');
const User = require('../models/User');
const mongoose = require('mongoose');
const axios = require("axios")
const env = require("dotenv")
env.config()

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ timestamp: -1 });
        res.status(200).json({ success: true, count: transactions.length, data: transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.addTransaction = async (req, res) => {
    const { type, amount, description, category } = req.body;
    const userId = req.user.id;

    if (!type || !amount || !description) {
        return res.status(400).json({ success: false, message: 'Please provide type, amount, and description' });
    }

    let determinedCategory = category;

    // --- AI Categorization Logic ---
    if (type === 'expense' && !category) {
        try {
            const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
            if (!apiKey) {
                throw new Error("Google Gemini API key is not configured on the server.");
            }

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            const systemPrompt = `You are a financial assistant. Your task is to categorize a transaction based on its description. Respond with ONLY ONE WORD, Do not add any extra text, formatting, or explanations.`;
            
            const payload = {
                contents: [{ parts: [{ text: description }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
            };
            
            const apiResponse = await axios.post(apiUrl, payload, { timeout: 10000 });  
            
            const aiResult = apiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text.trim();
            
            if (aiResult) {
                determinedCategory = aiResult;
            } else {
                console.log(determinedCategory)
                determinedCategory = 'Other'; 
            }

        } catch (error) {
            console.error('Gemini API Error:', error.message);
            determinedCategory = 'Other'; 
        }
    }
    // --- End of AI Logic ---

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const finalCategory = type === 'income' ? 'Income' : determinedCategory;

        const transaction = new Transaction({
            user: userId,
            type,
            amount,
            description,
            category: finalCategory,
        });

        await transaction.save({ session });

        const user = await User.findById(userId).session(session);
        user.walletBalance = type === 'income' ? user.walletBalance + parseInt(amount) : user.walletBalance - amount;
        await user.save({ session });

        await session.commitTransaction();
        res.status(201).json({ success: true, data: transaction, newBalance: user.walletBalance });

    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ success: false, message: 'Server Error during transaction' });
    } finally {
        session.endSession();
    }
};



exports.transferFunds = async (req, res) => {
    const { recipientEmail, amount, description } = req.body;
    const senderId = req.user.id;

    const senderInfo = await User.findById(senderId);
    if (senderInfo.email === recipientEmail) {
        return res.status(400).json({ success: false, message: "You cannot transfer money to yourself." });
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        
        const sender = await User.findById(senderId).session(session);
        const recipient = await User.findOne({ email: recipientEmail }).session(session);

        if (!recipient) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: 'Recipient user not found' });
        }

        if (sender.walletBalance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: 'Insufficient funds' });
        }

        
        sender.walletBalance -= amount;
        recipient.walletBalance += parseInt(amount);

        
        await sender.save({ session });
        await recipient.save({ session });

        
        const transactionDetails = {
            type: 'transfer',
            amount,
            category: 'Transfer',
            description,
            senderEmail: sender.email,
            recipientEmail: recipient.email,
        };

        await Transaction.create([{ user: sender._id, ...transactionDetails }], { session });
        await Transaction.create([{ user: recipient._id, ...transactionDetails }], { session });
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, message: 'Transfer successful', newBalance: sender.walletBalance });

    } catch (error) {
        
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ success: false, message: 'Transfer failed', error: error.message });
    }
};
 
