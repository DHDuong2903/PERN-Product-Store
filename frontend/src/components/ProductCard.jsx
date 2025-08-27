import { Link } from "react-router-dom";
import { EditIcon, TrashIcon } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

function ProductCard({ product }) {
  const { deleteProduct, admin } = useProductStore();
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      {/* Product Image */}
      <figure className="relative pt-[56.25%]">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
      </figure>

      <div className="card-body">
        {/* Product Info */}
        <h2 className="card-title text-lg font-seminbold">{product.name}</h2>
        <p className="text-2xl font-bold text-primary">
          {Number(product.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
        </p>

        {/* Card Actions */}

        {admin && (
          <div className="card-actions justify-end mt-4">
            <Link to={`/product/${product.id}`} className="btn btn-sm btn-info btn-outline">
              <EditIcon className="size-4" />
            </Link>

            <button className="btn btn-sm btn-error btn-outline" onClick={() => deleteProduct(product.id)}>
              <TrashIcon className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
