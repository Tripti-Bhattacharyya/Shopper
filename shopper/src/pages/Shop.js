import React from "react";
import all_product from '../assets/all_product';
import ProductCard from '../components/ProductCard';
//console.log('Product data:', all_product);
const Shop = () => {
  return(
  <div className="product-listing">
    {all_product.map(product=>(
       <ProductCard key={product.id} product={product} />
    ))}
  </div>
  );
};

export default Shop;
