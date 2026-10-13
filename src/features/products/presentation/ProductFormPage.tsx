
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

import { getErrorMessage, ApiError } from '../data/api-error';
import {
  createProduct,
  getProduct,
  updateProduct,
} from '../data/products-api';
import {
  CATEGORIES,
  validateProduct,
  type ProductField,
  type ProductInput,
} from '../domain/product';

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const isEditing = id !== undefined;
  const productId = Number(id);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<ProductField, string>>
  >({});
  const [serverError, setServerError] = useState('');
  const [serverDetails, setServerDetails] = useState<string[]>([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) return;

    let active = true;

    const loadProduct = async () => {
      if (!Number.isInteger(productId) || productId <= 0) {
        setServerError('El identificador del producto no es válido.');
        setLoading(false);
        return;
      }

      try {
        const product = await getProduct(productId);
        if (!active) return;

        setName(product.name);
        setPrice(String(product.price));
        setCategory(product.category);
        setStock(String(product.stock));
      } catch (error) {
        if (active) setServerError(getErrorMessage(error));
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadProduct();

    return () => {
      active = false;
    };
  }, [isEditing, productId]);

  const handleSubmit = async () => {
    setServerError('');
    setServerDetails([]);

    const input: ProductInput = {
      name,
      price: price.trim() === '' ? Number.NaN : Number(price),
      category,
      stock: stock.trim() === '' ? Number.NaN : Number(stock),
    };

    const validation = validateProduct(input);
    setFieldErrors(validation.errors);

    if (!validation.isValid) return;

    setSaving(true);

    try {
      if (isEditing) {
        await updateProduct(productId, input);
      } else {
        await createProduct(input);
      }

      history.replace('/productos');
    } catch (error) {
      setServerError(getErrorMessage(error));

      if (error instanceof ApiError && Array.isArray(error.details)) {
        setServerDetails(
          error.details.map((detail) =>
            typeof detail === 'string'
              ? detail
              : JSON.stringify(detail),
          ),
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const getFieldError = (field: ProductField) => fieldErrors[field];

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/productos" />
            </IonButtons>
            <IonTitle>Cargar producto</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p role="status">Cargando producto…</p>
        </IonContent>
      </IonPage>
    );
  }

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
        {serverError && (
          <div role="alert" className="ion-margin-bottom">
            <p className="ion-text-danger">{serverError}</p>
            {serverDetails.map((detail, index) => (
              <p key={`${index}-${detail}`} className="ion-text-danger">
                {detail}
              </p>
            ))}
          </div>
        )}

        <IonInput
          label="Nombre"
          labelPlacement="stacked"
          fill="outline"
          value={name}
          onIonInput={(event) => setName(String(event.detail.value ?? ''))}
          onIonBlur={() => {
            setFieldErrors((current) => ({
              ...current,
              name: validateProduct({
                name,
                price: price.trim() === '' ? Number.NaN : Number(price),
                category,
                stock: stock.trim() === '' ? Number.NaN : Number(stock),
              }).errors.name,
            }));
          }}
        />
        {getFieldError('name') && (
          <p role="alert" className="ion-text-danger">{getFieldError('name')}</p>
        )}

        <IonInput
          className="ion-margin-top"
          label="Precio (COP)"
          labelPlacement="stacked"
          fill="outline"
          type="number"
          min="0.01"
          value={price}
          onIonInput={(event) => setPrice(String(event.detail.value ?? ''))}
        />
        {getFieldError('price') && (
          <p role="alert" className="ion-text-danger">{getFieldError('price')}</p>
        )}

        <div className="ion-margin-top">
          <p>Categoría</p>
          {CATEGORIES.map((item) => (
            <IonButton
              key={item}
              fill={category === item ? 'solid' : 'outline'}
              onClick={() => setCategory(item)}
            >
              {item}
            </IonButton>
          ))}
        </div>
        {getFieldError('category') && (
          <p role="alert" className="ion-text-danger">{getFieldError('category')}</p>
        )}

        <IonInput
          className="ion-margin-top"
          label="Stock"
          labelPlacement="stacked"
          fill="outline"
          type="number"
          min="0"
          step="1"
          value={stock}
          onIonInput={(event) => setStock(String(event.detail.value ?? ''))}
        />
        {getFieldError('stock') && (
          <p role="alert" className="ion-text-danger">{getFieldError('stock')}</p>
        )}

        <IonButton
          expand="block"
          className="ion-margin-top"
          disabled={saving}
          onClick={() => void handleSubmit()}
        >
          {saving ? 'Guardando…' : 'Guardar'}
        </IonButton>
        <IonButton
          expand="block"
          fill="outline"
          disabled={saving}
          onClick={() => history.goBack()}
        >
          Cancelar
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProductFormPage;
