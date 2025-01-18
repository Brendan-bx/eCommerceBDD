import yup from "yup";
// Schémas Yup pour validation
export const productSchema = yup.object({
  reference: yup.string().required(),
  name: yup.string().required(),
  description: yup.string().required(),
  unit_price: yup.number().positive().required(),
  stock_quantity: yup.number().integer().min(0).required(),
  category_id: yup.number().integer().required(),
  supplier_id: yup.number().integer().required(),
});

export const categorySchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
});

export const supplierSchema = yup.object({
  company_name: yup.string().required(),
  contact_name: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
});

export const customerSchema = yup.object({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
});

export const orderSchema = yup.object({
  customer_id: yup.number().integer().required(),
  total_amount: yup.number().positive().required(),
});

export const orderLineSchema = yup.object({
  order_id: yup.number().integer().required(),
  product_id: yup.number().integer().required(),
  quantity: yup.number().integer().positive().required(),
  unit_price: yup.number().positive().required(),
});
