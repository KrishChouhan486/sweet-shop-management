import Sweet from "../models/sweet.model.js";

// Add new sweet (Admin)
export const addSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    if (!name || !category || !price || quantity == null) {
      return res.status(400).json({ message: "All fields required" });
    }

    const sweet = await Sweet.create({
      name,
      category,
      price,
      quantity
    });

    res.status(201).json(sweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all sweets
export const getSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search sweets
export const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (name) query.name = { $regex: name, $options: "i" };
    if (category) query.category = category;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(query);
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update sweet (Admin)
export const updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    Object.assign(sweet, req.body);
    await sweet.save();

    res.json(sweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete sweet (Admin)
export const deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    await sweet.deleteOne();
    res.json({ message: "Sweet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Purchase sweet
export const purchaseSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    if (sweet.quantity <= 0) {
      return res.status(400).json({ message: "Out of stock" });
    }

    sweet.quantity -= 1;
    await sweet.save();

    res.json({ message: "Sweet purchased", sweet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Restock sweet (Admin)
export const restockSweet = async (req, res) => {
  try {
    const { amount } = req.body;
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    sweet.quantity += Number(amount || 1);
    await sweet.save();

    res.json({ message: "Sweet restocked", sweet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
