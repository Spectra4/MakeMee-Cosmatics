"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const dispatch = useDispatch();

  // ✅ Fetch products once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products`);
        setProducts(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Handle Add to Cart
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.salePrice,
      quantity: 1,
      image: Array.isArray(product.images) ? product.images[0] : product.images,
    };
    dispatch(addToCart(cartItem));
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  // ✅ Handle Search
  useEffect(() => {
    let updated = [...products];

    if (search.trim()) {
      updated = updated.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // ✅ Handle Sort
    if (sort === "low-high") {
      updated.sort((a, b) => a.salePrice - b.salePrice);
    } else if (sort === "high-low") {
      updated.sort((a, b) => b.salePrice - a.salePrice);
    } else if (sort === "new") {
      updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFiltered(updated);
  }, [search, sort, products]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h2 className="text-2xl font-semibold text-gray-700">Loading products...</h2>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h2 className="text-2xl text-red-500 font-semibold">{error}</h2>
      </div>
    );

  return (
    <>
      <Header />

      {/* ✅ Search + Sort Controls */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-900"
          >
            <option value="">Sort by</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="new">Newest First</option>
          </select>
        </div>
      </div>

      {/* ✅ Product Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col"
              >
                {/* ✅ Product Image */}
                <Link href={`/products/${product._id}`} className="flex-1 flex flex-col">
                  <div className="flex justify-center items-center bg-gray-50 p-5 h-56 sm:h-64">
                    <img
                      src={
                        Array.isArray(product.images)
                          ? product.images[0]
                          : product.images
                      }
                      alt={product.name}
                      className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* ✅ Info */}
                  <div className="px-4 pb-4 pt-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h5 className="text-gray-900 font-semibold text-lg sm:text-xl mb-1 line-clamp-1">
                        {product.name}
                      </h5>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                        {product.description ||
                          "High-quality product with great benefits."}
                      </p>
                    </div>

                    {/* ✅ Price */}
                    <Box display="flex" alignItems="center" gap={1} my={1}>
                      {product.regularPrice &&
                        product.salePrice < product.regularPrice && (
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                              textDecoration: "line-through",
                              fontWeight: "500",
                              fontSize: "0.9rem",
                            }}
                          >
                            ₹{product.regularPrice}
                          </Typography>
                        )}
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#C00000" }}
                      >
                        ₹{product.salePrice}
                      </Typography>
                      {product.regularPrice &&
                        product.salePrice < product.regularPrice && (
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: "bold",
                              color: "green",
                              ml: 1,
                            }}
                          >
                            {Math.round(
                              ((product.regularPrice - product.salePrice) /
                                product.regularPrice) *
                                100
                            )}
                            % off
                          </Typography>
                        )}
                    </Box>
                  </div>
                </Link>

                {/* ✅ Add to Cart */}
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white py-2 sm:py-3 rounded-b-2xl font-semibold transition-all duration-300"
                >
                  <ShoppingCartOutlinedIcon className="text-white text-lg sm:text-xl" />
                  <span>ADD TO CART</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* ✅ Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Product added to cart!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductsPage;
