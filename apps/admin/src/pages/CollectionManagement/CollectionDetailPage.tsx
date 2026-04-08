import { useParams } from 'react-router-dom';
import CollectionForm from './CollectionForm';
import { collections } from './collectionsMockData';

const CollectionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const collection = collections.find((item) => item.id === id);

  return <CollectionForm initialValues={collection} isEdit />;
};

export default CollectionDetailPage;
