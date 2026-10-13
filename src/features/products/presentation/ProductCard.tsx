import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
} from '@ionic/react';
import { createOutline, eyeOutline } from 'ionicons/icons';

import { formatCOP, toProductView, type Product } from '../domain/product';

export interface ProductCardProps {
  /** Producto tal como lo entrega la API; la tarjeta calcula su vista con `toProductView`. */
  product: Product;
}

/**
 * Tarjeta reutilizable de un producto (se usa en la lista).
 * Autor: Andrés Felipe Gómez Anacona.
 *
 * Solo muestra datos y ofrece dos accesos: «Ver detalle» (/productos/:id) y «Editar»
 * (/productos/:id/editar). No sabe de dónde vienen los datos.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const view = toProductView(product);

  let badgeColor = 'success';
  if (view.isOutOfStock) {
    badgeColor = 'danger';
  } else if (view.isLowStock) {
    badgeColor = 'warning';
  }

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardSubtitle>{view.category}</IonCardSubtitle>
        <IonCardTitle>{view.name}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p>
          <strong>{formatCOP(product.price)}</strong>
        </p>
        <p>
          <IonBadge color={badgeColor}>{view.stockLabel}</IonBadge>{' '}
          <span>{view.stock} en stock</span>
        </p>
        <IonButton fill="outline" size="small" routerLink={`/productos/${product.id}`}>
          <IonIcon slot="start" icon={eyeOutline} />
          Ver detalle
        </IonButton>
        <IonButton fill="clear" size="small" routerLink={`/productos/${product.id}/editar`}>
          <IonIcon slot="start" icon={createOutline} />
          Editar
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default ProductCard;