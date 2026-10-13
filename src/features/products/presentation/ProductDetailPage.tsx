import {
  IonAlert,
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { createOutline, trashOutline } from 'ionicons/icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { ApiError, getErrorMessage } from '../data/api-error';
import { deleteProduct, getProduct } from '../data/products-api';
import { toProductView, type Product } from '../domain/product';
import EmptyState from './EmptyState';

type LoadStatus = 'loading' | 'ready' | 'error';

/**
 * Pantalla: detalle de un producto (ruta /productos/:id).
 * Autor: Andrés Felipe Gómez Anacona.
 *
 * `useParams` entrega el `:id` como TEXTO; se convierte con `Number(id)` (la ruta ya lo
 * restringe a dígitos). El producto se recarga al volver a la pantalla (por ejemplo, tras editarlo).
 * Eliminar pide confirmación con `IonAlert` y, si sale bien, regresa a /productos.
 */
const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const history = useHistory();

  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [isNotFound, setIsNotFound] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const isLoadingRef = useRef(false);

  const loadProduct = useCallback(async () => {
    if (isLoadingRef.current) return; // evita pedir el producto dos veces a la vez
    isLoadingRef.current = true;
    setStatus((previous) => (previous === 'ready' ? previous : 'loading'));
    try {
      setProduct(await getProduct(productId));
      setIsNotFound(false);
      setStatus('ready');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setIsNotFound(error instanceof ApiError && error.status === 404);
      setStatus('error');
    } finally {
      isLoadingRef.current = false;
    }
  }, [productId]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  useIonViewWillEnter(() => {
    void loadProduct();
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteProduct(productId);
      history.push('/productos');
    } catch (error) {
      setDeleteError(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const view = product ? toProductView(product) : null;

  let badgeColor = 'success';
  if (view?.isOutOfStock) {
    badgeColor = 'danger';
  } else if (view?.isLowStock) {
    badgeColor = 'warning';
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/productos" />
          </IonButtons>
          <IonTitle>Detalle del producto</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {status === 'loading' && (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" />
            <p>Cargando producto…</p>
          </div>
        )}

        {status === 'error' && (
          <EmptyState
            title={isNotFound ? 'Producto no encontrado' : 'No se pudo cargar'}
            message={errorMessage}
            actionLabel={isNotFound ? 'Volver a la lista' : 'Reintentar'}
            onAction={isNotFound ? () => history.push('/productos') : () => void loadProduct()}
          />
        )}

        {status === 'ready' && view && (
          <>
            <IonList>
              <IonItem>
                <IonLabel>
                  <p>Nombre</p>
                  <h2>{view.name}</h2>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <p>Categoría</p>
                  <h2>{view.category}</h2>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <p>Precio</p>
                  <h2>{view.priceLabel}</h2>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <p>Stock</p>
                  <h2>{view.stock} unidades</h2>
                </IonLabel>
                <IonBadge slot="end" color={badgeColor}>
                  {view.stockLabel}
                </IonBadge>
              </IonItem>
            </IonList>

            {deleteError && (
              <IonNote color="danger" className="ion-padding">
                {deleteError}
              </IonNote>
            )}

            <IonButton expand="block" routerLink={`/productos/${productId}/editar`}>
              <IonIcon slot="start" icon={createOutline} />
              Editar
            </IonButton>
            <IonButton expand="block" color="danger" fill="outline" disabled={isDeleting} onClick={() => setIsAlertOpen(true)}>
              <IonIcon slot="start" icon={trashOutline} />
              Eliminar
            </IonButton>
          </>
        )}

        <IonAlert
          isOpen={isAlertOpen}
          header="Eliminar producto"
          message={view ? `¿Eliminar «${view.name}»? Esta acción no se puede deshacer.` : '¿Eliminar este producto?'}
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            {
              text: 'Eliminar',
              role: 'destructive',
              handler: () => {
                void handleDelete();
              },
            },
          ]}
          onDidDismiss={() => setIsAlertOpen(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default ProductDetailPage;