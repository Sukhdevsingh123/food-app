import MenuItem from "../models/MenuItem.js";
import Category from "../models/Category.js";

export const getMenu = async (req, res, next) => {
    try {
        const { category } = req.query;

        let filter = {};

        if (category) {
            const cat = await Category.findOne({ name: new RegExp(`^${category}$`, "i") });
            if (cat) {
                filter.category = cat._id;
            } else {
               
                return res.json([]);
            }
        }

        const items = await MenuItem.find(filter).populate("category");
        res.json(items);
    } catch (err) {
        next(err);
    }
};