import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { createProduct, getProduct, updateProduct } from '../data/products-api';
import { getErrorMessage } from '../data/api-error';
import {
  CATEGORIES,
  validateProduct,
  type ProductInput,
  type ValidationResult,
} from '../domain/product';

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const isEditing = id !== undefined;
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('0');
  const [errors, setErrors] = useState<ValidationResult['errors']>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) return;

    const productId = Number(id);
    if (!Number.isInteger(productId) || productId <= 0) {
      setServerError('El identificador del producto no es válido.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    getProduct(productId)
      .then((product) => {
        if (cancelled) return;
        setName(product.name);
        setPrice(String(product.price));
        setCategory(product.category);
        setStock(String(product.stock));
      })
      .catch((error: unknown) => {
        if (!cancelled) setServerError(getErrorMessage(error));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, isEditing]);

  const submit = async () => {
    setServerError('');

    const input: ProductInput = {
      name,
      price: price.trim() === '' ? Number.NaN : Number(price),
      category,
      stock: stock.trim() === '' ? Number.NaN : Number(stock),
    };

    const result = validateProduct(input);
    setErrors(result.errors);

    if (!result.isValid) return;

    setSaving(true);
    try {
      if (isEditing) {
        await updateProduct(Number(id), input);
      } else {
        await createProduct(input);
      }
      history.replace('/productos');
    } catch (error: unknown) {
      setServerError(getErrorMessage(error));
    } finally {
      setSaving(false);
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
        {loading ? (
          <p>Cargando datos del producto...</p>
        ) : (
          <>
            <IonInput
              label="Nombre"
              labelPlacement="floating"
              fill="outline"
              maxlength={60}
              value={name}
              onIonInput={(event) => setName(String(event.detail.value ?? ''))}
            />
            {errors.name && <IonNote color="danger">{errors.name}</IonNote>}

            <IonInput
              className="ion-margin-top"
              label="Precio"
              labelPlacement="floating"
              fill="outline"
              type="number"
              min="0.01"
              value={price}
              onIonInput={(event) => setPrice(String(event.detail.value ?? ''))}
            />
            {errors.price && <IonNote color="danger">{errors.price}</IonNote>}

            <IonItem className="ion-margin-top">
              <IonLabel>Categoría</IonLabel>
              <IonSelect
                value={category}
                placeholder="Selecciona una categoría"
                onIonChange={(event) => setCategory(String(event.detail.value ?? ''))}
              >
                {CATEGORIES.map((item) => (
                  <IonSelectOption key={item} value={item}>
                    {item}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            {errors.category && (
              <IonNote color="danger">{errors.category}</IonNote>
            )}

            <IonInput
              className="ion-margin-top"
              label="Inventario"
              labelPlacement="floating"
              fill="outline"
              type="number"
              min="0"
              step="1"
              value={stock}
              onIonInput={(event) => setStock(String(event.detail.value ?? ''))}
            />
            {errors.stock && <IonNote color="danger">{errors.stock}</IonNote>}

            {serverError && (
              <p role="alert">
                <IonNote color="danger">{serverError}</IonNote>
              </p>
            )}

            <IonButton
              expand="block"
              className="ion-margin-top"
              onClick={() => void submit()}
              disabled={saving}
            >
              {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductFormPage;