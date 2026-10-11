import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { ApiError, getErrorMessage } from '../data/api-error';
import {
  createProduct,
  getProduct,
  updateProduct,
} from '../data/products-api';
import {
  CATEGORIES,
  validateProduct,
  type ProductField,
} from '../domain/product';

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();

  const isEditing = id !== undefined;
  const productId = id !== undefined ? Number(id) : null;

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<ProductField, string>>
  >({});

  const [serverError, setServerError] = useState('');
  const [serverDetails, setServerDetails] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing || productId === null) {
      return;
    }

    const loadProduct = async () => {
      setIsLoading(true);
      setServerError('');
      setServerDetails([]);

      try {
        const product = await getProduct(productId);

        setName(product.name);
        setPrice(String(product.price));
        setCategory(product.category);
        setStock(String(product.stock));
      } catch (error) {
        setServerError(getErrorMessage(error));

        if (error instanceof ApiError) {
          setServerDetails(error.details);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadProduct();
  }, [isEditing, productId]);

  const handleSubmit = async () => {
    setServerError('');
    setServerDetails([]);

    const input = {
      name,
      price: price.trim() === '' ? Number.NaN : Number(price),
      category,
      stock: stock.trim() === '' ? Number.NaN : Number(stock),
    };

    const validation = validateProduct(input);

    setFieldErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && productId !== null) {
        await updateProduct(productId, input);
      } else {
        await createProduct(input);
      }

      history.replace('/productos');
    } catch (error) {
      setServerError(getErrorMessage(error));

      if (error instanceof ApiError) {
        setServerDetails(error.details);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref={
                isEditing && productId !== null
                  ? `/productos/${productId}`
                  : '/productos'
              }
            />
          </IonButtons>

          <IonTitle>
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {isLoading && <p>Cargando producto...</p>}

        {!isLoading && (
          <>
            <IonInput
              label="Nombre"
              labelPlacement="stacked"
              fill="outline"
              value={name}
              maxlength={60}
              onIonInput={(event) => {
                setName(String(event.detail.value ?? ''));
                setFieldErrors((current) => ({
                  ...current,
                  name: undefined,
                }));
              }}
            />

            {fieldErrors.name && (
              <p style={{ color: 'var(--ion-color-danger)' }}>
                {fieldErrors.name}
              </p>
            )}

            <div className="ion-margin-top">
              <IonInput
                label="Precio"
                labelPlacement="stacked"
                fill="outline"
                type="number"
                value={price}
                onIonInput={(event) => {
                  setPrice(String(event.detail.value ?? ''));
                  setFieldErrors((current) => ({
                    ...current,
                    price: undefined,
                  }));
                }}
              />
            </div>

            {fieldErrors.price && (
              <p style={{ color: 'var(--ion-color-danger)' }}>
                {fieldErrors.price}
              </p>
            )}

            <div className="ion-margin-top">
              <p>
                <strong>Categoría</strong>
              </p>

              {CATEGORIES.map((item) => (
                <IonButton
                  key={item}
                  size="small"
                  fill={category === item ? 'solid' : 'outline'}
                  onClick={() => {
                    setCategory(item);
                    setFieldErrors((current) => ({
                      ...current,
                      category: undefined,
                    }));
                  }}
                >
                  {item}
                </IonButton>
              ))}
            </div>

            {fieldErrors.category && (
              <p style={{ color: 'var(--ion-color-danger)' }}>
                {fieldErrors.category}
              </p>
            )}

            <div className="ion-margin-top">
              <IonInput
                label="Stock"
                labelPlacement="stacked"
                fill="outline"
                type="number"
                value={stock}
                onIonInput={(event) => {
                  setStock(String(event.detail.value ?? ''));
                  setFieldErrors((current) => ({
                    ...current,
                    stock: undefined,
                  }));
                }}
              />
            </div>

            {fieldErrors.stock && (
              <p style={{ color: 'var(--ion-color-danger)' }}>
                {fieldErrors.stock}
              </p>
            )}

            {serverError && (
              <div className="ion-margin-top">
                <p style={{ color: 'var(--ion-color-danger)' }}>
                  {serverError}
                </p>

                {serverDetails.length > 0 && (
                  <ul>
                    {serverDetails.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <IonButton
              expand="block"
              className="ion-margin-top"
              disabled={isSubmitting}
              onClick={() => void handleSubmit()}
            >
              {isSubmitting
                ? 'Guardando...'
                : isEditing
                  ? 'Guardar cambios'
                  : 'Crear producto'}
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductFormPage;