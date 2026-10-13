
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

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const hasStockWarning = product.isLowStock || product.isOutOfStock;

  return (
    <IonItem
      button={Boolean(onSelect)}
      detail={Boolean(onSelect)}
      onClick={() => onSelect?.(product.id)}
      className={hasStockWarning ? 'product-card product-card--warning' : 'product-card'}
    >
      <IonLabel>
        <h2>{product.name}</h2>
        <p>{product.category}</p>
        <p>{product.priceLabel}</p>
        <p>
          Estado del inventario: <strong>{product.stockLabel}</strong>
        </p>
        {hasStockWarning && (
          <IonNote color={product.isOutOfStock ? 'danger' : 'warning'}>
            {product.isOutOfStock
              ? 'Aviso: producto agotado'
              : 'Aviso: quedan pocas unidades'}
          </IonNote>
        )}
      </IonLabel>
    </IonItem>
  );
};

export default ProductCard;
