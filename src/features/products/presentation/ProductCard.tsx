import {
  IonBadge,
  IonItem,
  IonLabel,
  IonNote,
} from '@ionic/react';

import type { ProductView } from '../domain/product';

export interface ProductCardProps {
  product: ProductView;
  /** Se invoca con el id del producto cuando la persona toca la tarjeta. */
  onSelect?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
}) => {
  const stockColor = product.isOutOfStock
    ? 'danger'
    : product.isLowStock
      ? 'warning'
      : 'success';

  return (
    <IonItem
      button={Boolean(onSelect)}
      detail={Boolean(onSelect)}
      onClick={() => onSelect?.(product.id)}
    >
      <IonLabel>
        <h2>{product.name}</h2>
        <p>{product.category}</p>
        <p>{product.priceLabel}</p>
      </IonLabel>

      <IonNote slot="end">
        <IonBadge color={stockColor}>
          {product.stockLabel}
        </IonBadge>
        <div>Stock: {product.stock}</div>
      </IonNote>
    </IonItem>
  );
};

export default ProductCard;