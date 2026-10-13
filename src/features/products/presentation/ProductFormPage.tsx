import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { ApiError, getErrorMessage } from '../data/api-error';
import { createProduct, getProduct, updateProduct } from '../data/products-api';
import type { ProductInput } from '../domain/product';
import EmptyState from './EmptyState';
import ProductForm from './ProductForm';

type LoadStatus = 'loading' | 'ready' | 'error';

/**
 * Pantalla: formulario de producto. La misma pantalla sirve para dos rutas:
 *  - /productos/nuevo          → crear (no hay `id` en la ruta)
 *  - /productos/:id/editar     → editar (hay `id`; se precargan los campos con `getProduct`)
 * Autor: Andrés Felipe Gómez Anacona.
 *
 * Ionic mantiene esta página en memoria después de navegar hacia adelante, así que cada vez que
 * se vuelve a entrar se reinicia el formulario (`formKey` fuerza un montaje limpio de `ProductForm`)
 * y, al editar, se recargan los datos del producto.
 */
const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = id !== undefined;
  const productId = isEditing ? Number(id) : null;
  const history = useHistory();

  const [initialValues, setInitialValues] = useState<ProductInput | undefined>(undefined);
  const [status, setStatus] = useState<LoadStatus>(isEditing ? 'loading' : 'ready');
  const [loadError, setLoadError] = useState('');
  const [isNotFound, setIsNotFound] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [serverDetails, setServerDetails] = useState<string[]>([]);
  const isLoadingRef = useRef(false);

  const loadInitialValues = useCallback(async () => {
    setServerError('');
    setServerDetails([]);

    if (productId === null) {
      // Crear: formulario vacío y montaje limpio.
      setInitialValues(undefined);
      setFormKey((previous) => previous + 1);
      setStatus('ready');
      return;
    }

    if (isLoadingRef.current) return; // evita pedir el producto dos veces a la vez
    isLoadingRef.current = true;
    setStatus('loading');
    try {
      const product = await getProduct(productId);
      setInitialValues({
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock,
      });
      setFormKey((previous) => previous + 1);
      setIsNotFound(false);
      setStatus('ready');
    } catch (error) {
      setLoadError(getErrorMessage(error));
      setIsNotFound(error instanceof ApiError && error.status === 404);
      setStatus('error');
    } finally {
      isLoadingRef.current = false;
    }
  }, [productId]);

  useEffect(() => {
    void loadInitialValues();
  }, [loadInitialValues]);

  useIonViewWillEnter(() => {
    void loadInitialValues();
  });

  const handleSubmit = async (input: ProductInput) => {
    setIsSubmitting(true);
    setServerError('');
    setServerDetails([]);
    try {
      if (productId === null) {
        await createProduct(input);
      } else {
        await updateProduct(productId, input);
      }
      history.push('/productos');
    } catch (error) {
      setServerError(getErrorMessage(error));
      setServerDetails(error instanceof ApiError ? error.details : []);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/productos" />
          </IonButtons>
          <IonTitle>{isEditing ? 'Editar producto' : 'Nuevo producto'}</IonTitle>
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
            message={loadError}
            actionLabel={isNotFound ? 'Volver a la lista' : 'Reintentar'}
            onAction={isNotFound ? () => history.push('/productos') : () => void loadInitialValues()}
          />
        )}

        {status === 'ready' && (
          <ProductForm
            key={formKey}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel={isEditing ? 'Guardar cambios' : 'Crear producto'}
            serverError={serverError}
            serverDetails={serverDetails}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductFormPage;