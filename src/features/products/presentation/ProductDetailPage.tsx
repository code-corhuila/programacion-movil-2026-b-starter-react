import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { getErrorMessage } from '../data/api-error';
import {
  deleteProduct,
  getProduct,
} from '../data/products-api';
import {
  toProductView,
  type Product,
} from '../domain/product';

type LoadStatus = 'loading' | 'ready' | 'error';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setStatus('loading');
      setErrorMessage('');

      try {
        const data = await getProduct(productId);
        setProduct(data);
        setStatus('ready');
      } catch (error) {
        setProduct(null);
        setErrorMessage(getErrorMessage(error));
        setStatus('error');
      }
    };

    void loadProduct();
  }, [productId]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage('');

    try {
      await deleteProduct(productId);
      history.replace('/productos');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setConfirmDelete(false);
      setIsDeleting(false);
    }
  };

  const productView = product
    ? toProductView(product)
    : null;

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
          <p>Cargando producto...</p>
        )}

        {status === 'error' && (
          <div>
            <h2>No se pudo cargar el producto</h2>
            <p>{errorMessage}</p>

            <IonButton
              onClick={() => history.replace('/productos')}
            >
              Volver a productos
            </IonButton>
          </div>
        )}

        {status === 'ready' && productView && (
          <>
            <IonList>
              <IonItem>
                <IonLabel>
                  <strong>ID</strong>
                  <p>{productView.id}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <strong>Nombre</strong>
                  <p>{productView.name}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <strong>Categoría</strong>
                  <p>{productView.category}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <strong>Precio</strong>
                  <p>{productView.priceLabel}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <strong>Stock</strong>
                  <p>{productView.stock}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <strong>Estado del stock</strong>
                  <p>{productView.stockLabel}</p>
                </IonLabel>
              </IonItem>
            </IonList>

            <IonButton
              expand="block"
              routerLink={`/productos/${productId}/editar`}
              className="ion-margin-top"
            >
              Editar
            </IonButton>

            {!confirmDelete && (
              <IonButton
                expand="block"
                color="danger"
                onClick={() => setConfirmDelete(true)}
              >
                Eliminar
              </IonButton>
            )}

            {confirmDelete && (
              <div className="ion-padding">
                <p>
                  <strong>¿Eliminar este producto?</strong>
                </p>

                <IonButton
                  color="danger"
                  disabled={isDeleting}
                  onClick={() => void handleDelete()}
                >
                  {isDeleting ? 'Eliminando...' : 'Confirmar'}
                </IonButton>

                <IonButton
                  fill="outline"
                  disabled={isDeleting}
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancelar
                </IonButton>
              </div>
            )}

            {errorMessage && (
              <p className="ion-padding">
                {errorMessage}
              </p>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductDetailPage;