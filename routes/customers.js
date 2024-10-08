const {Customer,validateCustomer} = require("../models/customer");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();


router.get("/", async (req, res) => {
        const customers = await Customer.find().sort('name');
        res.send(customers);
})

router.get('/:id', async (req, res) => {

    const customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).send('No customer found.');

    res.send(customer);
});

router.put('/:id',auth,async (req, res) => {
    const {error} = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {name: req.body.name, }, {new: true})

    if (!customer) return res.status(404).send('No customer found.');

    res.send(customer);
});

router.delete('/:id', auth,async (req, res) => {

    const customer = await Customer.findByIdAndDelete(req.params.id)

    if (!customer) return res.status(404).send('No customer found.');

    res.send(customer);
})

router.post("/", auth,async (req, res) => {
    const {error} = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        isGold: req.body.isGold,
    })
    await customer.save();

    res.send(customer)
})



module.exports = router;