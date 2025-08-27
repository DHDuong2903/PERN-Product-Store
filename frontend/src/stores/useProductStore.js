import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "";

export const useProductStore = create((set, get) => ({
  // product state
  products: [],
  allProducts: [],
  loading: false,
  error: null,
  currentProduct: null,
  admin: true,

  // Form state
  formData: {
    name: "",
    image: "",
    price: "",
  },

  setFormData: (formData) => {
    set({ formData });
  },

  resetFormData: () => {
    set({
      formData: {
        name: "",
        image: "",
        price: "",
      },
    });
  },

  setProducts: (newProducts) => {
    set({ products: newProducts });
  },

  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });
    try {
      const { formData } = get();
      await axios.post(`${BASE_URL}/api/products`, formData);
      await get().fetchProducts();
      get().resetFormData();
      toast.success("Product added successfully");
      // Close the form
      document.getElementById("add_product_modal").close();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while adding the product");
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      set({ products: response.data.data, allProducts: response.data.data, loading: false, error: null });
    } catch (error) {
      if (error.status === 429) {
        set({ error: "Rate limit exceeded", products: [] });
      } else set({ error: "Something went wrong", products: [] });
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      if (window.confirm("Are you sure you want to delete this product?")) {
        await axios.delete(`${BASE_URL}/api/products/${id}`);
        set((prev) => ({
          products: prev.products.filter((product) => product.id !== id),
          loading: false,
          error: null,
        }));
        toast.success("Product deleted successfully");
      }
    } catch (error) {
      console.log("Error in deleting product:", error);
      toast.error("Something went wrong while deleting the product");
    } finally {
      set({ loading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products/${id}`);
      set({ currentProduct: response.data.data, formData: response.data.data, loading: false, error: null });
    } catch (error) {
      console.log("Error fetching product by ID:", error);
      set({ error: "Something went wrong", loading: false, currentProduct: null });
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      await axios.put(`${BASE_URL}/api/products/${id}`, formData);
      await get().fetchProducts();
      get().resetFormData();
      toast.success("Product updated successfully");
      // Close the form
      document.getElementById("add_product_modal")?.close();
    } catch (error) {
      console.log("Error in updating product:", error);
      toast.error("Something went wrong while updating the product");
    } finally {
      set({ loading: false });
    }
  },
}));
