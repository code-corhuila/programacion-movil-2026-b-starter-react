import { IonButton, IonItem, IonLabel, IonInput, IonNote, IonSelect, IonSelectOption } from '@ionic/react';
import { useState } from 'react';

import { CATEGORIES, NAME_MAX_LENGTH, validateProduct, type ProductInput } from '../domain/product';

export interface ProductFormProps {
  /** Valores iniciales (modo edición). Sin ellos, el formulario arranca vacío (modo crear). */
  initialValues?: Partial<ProductInput>;
  /** Se invoca con los datos ya validados cuando la persona pulsa «Guardar». */
  onSubmit: (input: ProductInput) => void | Promise<void>;
  /** true mientras se guarda: deshabilita el botón para evitar envíos dobles. */
  isSubmitting?: boolean;
  /** Texto del botón principal. */
  submitLabel?: string;
  /** Mensaje general que devolvió el servidor al rechazar los datos. */
  serverError?: string;
  /** Mensajes `details` que devolvió el servidor. */
  serverDetails?: string[];
}

/**
 * Formulario de producto (crear y editar), sin conocer la API ni la navegación.
 * Autor: Andrés Felipe Gómez Anacona.
 *
 * Los campos son controlados con `useState`. Precio y stock se guardan como TEXTO mientras se
 * escribe y se convierten a número solo al validar. Los errores se DERIVAN de los valores con
 * `validateProduct` una vez que la persona intentó guardar (no se guardan como estado).
 */
const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Guardar',
  serverError = '',
  serverDetails = [],
}) => {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [priceText, setPriceText] = useState(
    initialValues?.price !== undefined ? String(initialValues.price) : '',
  );
  const [category, setCategory] = useState(initialValues?.category ?? '');
  const [stockText, setStockText] = useState(
    initialValues?.stock !== undefined ? String(initialValues.stock) : '',
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);

  /** Convierte el texto de un campo numérico: vacío o no numérico se vuelve NaN (inválido). */
  const toNumber = (text: string): number => (text.trim() === '' ? Number.NaN : Number(text));

  const buildInput = (): ProductInput => ({
    name: name.trim(),
    price: toNumber(priceText),
    category,
    stock: toNumber(stockText),
  });

  const errors = hasSubmitted ? validateProduct(buildInput()).errors : {};

  const handleSubmit = () => {
    setHasSubmitted(true);
    const input = buildInput();
    if (!validateProduct(input).isValid) return;
    void onSubmit(input);
  };

  return (
    <div>
      <IonItem lines="none">
        <IonInput
          label="Nombre"
          labelPlacement="floating"
          fill="outline"
          maxlength={NAME_MAX_LENGTH + 20}
          value={name}
          onIonInput={(event) => setName(String(event.detail.value ?? ''))}
        />
      </IonItem>
      {errors.name && (
        <IonNote color="danger" className="ion-padding-start">
          {errors.name}
        </IonNote>
      )}

      <IonItem lines="none">
        <IonInput
          label="Precio (COP)"
          labelPlacement="floating"
          fill="outline"
          type="number"
          inputmode="decimal"
          value={priceText}
          onIonInput={(event) => setPriceText(String(event.detail.value ?? ''))}
        />
      </IonItem>
      {errors.price && (
        <IonNote color="danger" className="ion-padding-start">
          {errors.price}
        </IonNote>
      )}

      <IonItem lines="none">
        <IonSelect
          label="Categoría"
          labelPlacement="floating"
          fill="outline"
          placeholder="Seleccione"
          value={category}
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
        <IonNote color="danger" className="ion-padding-start">
          {errors.category}
        </IonNote>
      )}

      <IonItem lines="none">
        <IonInput
          label="Stock"
          labelPlacement="floating"
          fill="outline"
          type="number"
          inputmode="numeric"
          value={stockText}
          onIonInput={(event) => setStockText(String(event.detail.value ?? ''))}
        />
      </IonItem>
      {errors.stock && (
        <IonNote color="danger" className="ion-padding-start">
          {errors.stock}
        </IonNote>
      )}

      {serverError && (
        <IonItem lines="none">
          <IonLabel color="danger" className="ion-text-wrap">
            <h3>{serverError}</h3>
            {serverDetails.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
          </IonLabel>
        </IonItem>
      )}

      <IonButton expand="block" className="ion-margin-top" disabled={isSubmitting} onClick={handleSubmit}>
        {isSubmitting ? 'Guardando…' : submitLabel}
      </IonButton>
    </div>
  );
};

export default ProductForm;