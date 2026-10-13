import {
  IonItem,
  IonLabel,
  IonNote,
} from '@ionic/react';
import type { ProductView } from '../domain/product';

export interface ProductCardProps {
  product: ProductView;
  onSelect?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => (
  <IonItem
    button
    detail
    onClick={() => onSelect?.(product.id)}
  >
    <IonLabel>
      <h2>{product.name}</h2>
      <p>{product.category}</p>
      <p>{product.priceLabel}</p>
      <p>Inventario: {product.stock}</p>
    </IonLabel>
    <IonNote slot="end" color={product.isOutOfStock ? 'danger' : product.isLowStock ? 'warning' : 'success'}>
      {product.stockLabel}
    </IonNote>
  </IonItem>
);

export default ProductCard;