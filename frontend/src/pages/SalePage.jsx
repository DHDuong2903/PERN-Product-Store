import { useEffect } from "react";
import { PackageIcon, SearchIcon } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";

function SalePage() {
  const { products, loading, error, fetchProducts, setProducts, allProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSortByPrice = (order) => {
    const sorted = [...products].sort((a, b) => (order === "asc" ? a.price - b.price : b.price - a.price));
    setProducts(sorted);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (query === "") {
      // Nếu rỗng, reset về toàn bộ danh sách ban đầu
      setProducts(allProducts);
      return;
    }

    const filtered = allProducts.filter((product) => product.name.toLowerCase().includes(query));

    setProducts(filtered);
  };

  return (
    <div>
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Thanh chuc nang */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative w-1/3">
            <div className="absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
              <SearchIcon className="size-5" />
            </div>
            <input
              onChange={handleSearch}
              type="text"
              placeholder="Search products..."
              className="input input-bordered focus:outline-none w-full pl-10 py-3 focus:input-primary transition-colors duration-200"
            />
          </div>

          <div className="w-2/3 flex justify-end">
            <div className="dropdown dropdown-hover">
              <div tabIndex={0} role="button" className="btn m-1">
                Category
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                {/* Backend se them truong thong tin category thay cho name */}
                {products.length > 0 &&
                  products.map((product) => (
                    <li key={product.id}>
                      <a>{product.name}</a>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="dropdown dropdown-hover">
              <div tabIndex={0} role="button" className="btn m-1">
                Price
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                <li onClick={() => handleSortByPrice("asc")}>
                  <a>Price tang dan</a>
                </li>
                <li onClick={() => handleSortByPrice("desc")}>
                  <a>Price giam dan</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-error mb-8">{error}</div>}

        {/* Show san pham */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Neu khong co san pham nao */}
        {products.length === 0 && !loading && (
          <div className="flex flex-col justify-center items-center h-96 space-y-4">
            <div className="bg-base-100 rounded-full p-6">
              <PackageIcon className="size-12" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold">No products found</h3>
              <p className="text-gray-500 max-w-sm">Please come back later</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SalePage;
