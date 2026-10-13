
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { getErrorMessage } from '../data/api-error';
import { deleteProduct, getProduct } from '../data/products-api';
import { toProductView, type ProductView } from '../domain/product';
import EmptyState from './EmptyState';

type LoadStatus = 'loading' | 'ready' | 'error';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const productId = Number(id);

  const [product, setProduct] = useState<ProductView | null>(null);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      if (!Number.isInteger(productId) || productId <= 0) {
        setErrorMessage('El identificador del producto no es válido.');
        setStatus('error');
        return;
      }

      setStatus('loading');
      try {
        const result = await getProduct(productId);
        if (active) {
          setProduct(toProductView(result));
          setStatus('ready');
        }
      } catch (error) {
        if (active) {
          setErrorMessage(getErrorMessage(error));
          setStatus('error');
        }
      }
    };

    void loadProduct();

    return () => {
      active = false;
    };
  }, [productId]);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError('');

    try {
      await deleteProduct(productId);
      history.replace('/productos');
    } catch (error) {
      setDeleteError(getErrorMessage(error));
      setDeleting(false);
    }
  };

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
          <p role="status">Cargando producto…</p>
        )}

        {status === 'error' && (
          <EmptyState
            title="No se pudo cargar el producto"
            message={errorMessage}
            actionLabel="Volver a productos"
            onAction={() => history.replace('/productos')}
          />
        )}

        {status === 'ready' && product && (
          <>
            <h2>{product.name}</h2>
            <p><strong>Categoría:</strong> {product.category}</p>
            <p><strong>Precio:</strong> {product.priceLabel}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
            <p><strong>Estado del stock:</strong> {product.stockLabel}</p>

            {product.isOutOfStock && (
              <p className="ion-text-danger">
                Aviso: este producto está agotado.
              </p>
            )}

            {product.isLowStock && (
              <p className="ion-text-warning">
                Aviso: quedan pocas unidades.
              </p>
            )}

            <IonButton
              expand="block"
              routerLink={`/productos/${product.id}/editar`}
            >
              Editar
            </IonButton>

            {!confirmDelete ? (
              <IonButton
                expand="block"
                color="danger"
                onClick={() => setConfirmDelete(true)}
              >
                Eliminar
              </IonButton>
            ) : (
              <div className="ion-margin-top">
                <p>¿Eliminar este producto?</p>
                <IonButton
                  expand="block"
                  color="danger"
                  disabled={deleting}
                  onClick={() => void handleDelete()}
                >
                  {deleting ? 'Eliminando…' : 'Confirmar'}
                </IonButton>
                <IonButton
                  expand="block"
                  fill="outline"
                  disabled={deleting}
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancelar
                </IonButton>
              </div>
            )}

            {deleteError && (
              <p role="alert" className="ion-text-danger">
                No se pudo eliminar: {deleteError}
              </p>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductDetailPage;
