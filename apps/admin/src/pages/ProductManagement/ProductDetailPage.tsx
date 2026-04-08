import { useParams } from 'react-router-dom';
import ProductForm from './ProductForm';
import { products } from './productsMockData';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((item) => item.id === id);

  return <ProductForm initialValues={product} isEdit />;
};

export default ProductDetailPage;
