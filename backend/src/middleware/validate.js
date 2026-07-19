import Joi from "joi";
import xss from "xss";
import { AppError } from "../utils/errors.js";

function clean(value) {
  if (typeof value === "string") return xss(value.trim());
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, clean(val)]));
  }
  return value;
}

export function validate(schema) {
  return (req, res, next) => {
    const input = clean(req.body);
    const { error, value } = schema.validate(input, { abortEarly: false, stripUnknown: true });
    if (error) {
      return next(new AppError("Validation failed", 422));
    }
    req.body = value;
    next();
  };
}

export const schemas = {
  register: Joi.object({
    full_name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9+\-\s]{8,20}$/).allow("").default(""),
    password: Joi.string().min(8).required(),
    confirm_password: Joi.valid(Joi.ref("password")).required()
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    remember_me: Joi.boolean().default(false)
  }),
  product: Joi.object({
    name: Joi.string().min(2).max(160).required(),
    description: Joi.string().max(5000).required(),
    specifications: Joi.object().default({}),
    price: Joi.number().positive().required(),
    discount_percent: Joi.number().min(0).max(90).default(0),
    stock: Joi.number().integer().min(0).required(),
    image: Joi.string().uri().allow("").required(),
    images: Joi.array().items(Joi.string().uri()).default([]),
    category_id: Joi.number().integer().required(),
    is_featured: Joi.boolean().default(false),
    is_best_seller: Joi.boolean().default(false)
  }),
  category: Joi.object({ category_name: Joi.string().min(2).max(80).required() }),
  cartItem: Joi.object({ product_id: Joi.number().integer().required(), quantity: Joi.number().integer().min(1).required() }),
  address: Joi.object({
    label: Joi.string().max(60).default("Home"),
    line1: Joi.string().required(),
    line2: Joi.string().allow("").default(""),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postal_code: Joi.string().required(),
    country: Joi.string().default("India")
  }),
  order: Joi.object({
    shipping_address_id: Joi.number().integer().required(),
    billing_address_id: Joi.number().integer().required(),
    payment_method: Joi.string().valid("cod", "credit_card", "debit_card", "upi").required(),
    coupon_code: Joi.string().allow("").default("")
  }),
  review: Joi.object({
    product_id: Joi.number().integer().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(1000).allow("").default("")
  })
};
