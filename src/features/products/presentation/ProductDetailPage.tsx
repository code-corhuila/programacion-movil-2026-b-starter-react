import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { useCallback, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { deleteProduct, getProduct } from '../data/products-api';
import { getErrorMessage } from '../data/api-error';
import { toProductView, type Product } from '../domain/product';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setError('');

    const productId = Number(id);
    if (!Number.isInteger(productId) || productId <= 0) {
      setProduct(null);
      setError('El identificador del producto no es válido.');
      setLoading(false);
      return;
    }

    try {
      setProduct(await getProduct(productId));
    } catch (loadError: unknown) {
      setProduct(null);
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useIonViewWillEnter(() => {
    void loadProduct();
  });

  const confirmDelete = async () => {
    if (!product) return;

    setDeleting(true);
    setError('');

    try {
      await deleteProduct(product.id);
      history.replace('/productos');
    } catch (deleteError: unknown) {
      setError(getErrorMessage(deleteError));
      setShowDeleteAlert(false);
    } finally {
      setDeleting(false);
    }
  };

  const productView = product ? toProductView(product) : null;

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
        {loading && <p>Cargando producto...</p>}

        {!loading && error && (
          <>
            <p role="alert">{error}</p>
            <IonButton onClick={() => void loadProduct()}>
              Reintentar
            </IonButton>
          </>
        )}

        {!loading && product && productView && (
          <>
            <h2>{productView.name}</h2>
            <p><strong>Identificador:</strong> {product.id}</p>
            <p><strong>Precio:</strong> {productView.priceLabel}</p>
            <p><strong>Categoría:</strong> {product.category}</p>
            <p><strong>Inventario:</strong> {product.stock}</p>
            <p><strong>Estado:</strong> {productView.stockLabel}</p>

            <IonButton
              expand="block"
              routerLink={`/productos/${product.id}/editar`}
            >
              Editar producto
            </IonButton>

            <IonButton
              expand="block"
              color="danger"
              disabled={deleting}
              onClick={() => setShowDeleteAlert(true)}
            >
              Eliminar producto
            </IonButton>
          </>
        )}

        <IonAlert
          isOpen={showDeleteAlert}
          header="Eliminar producto"
          message={`¿Seguro que deseas eliminar ${product?.name ?? 'este producto'}? Esta acción no se puede deshacer.`}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => setShowDeleteAlert(false),
            },
            {
              text: 'Eliminar',
              role: 'destructive',
              handler: () => void confirmDelete(),
            },
          ]}
          onDidDismiss={() => setShowDeleteAlert(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default ProductDetailPage;