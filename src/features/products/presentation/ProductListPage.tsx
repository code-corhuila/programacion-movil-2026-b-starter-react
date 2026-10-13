import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getErrorMessage } from '../data/api-error';
import { getProducts } from '../data/products-api';
import {
  CATEGORIES,
  filterProducts,
  toProductView,
  type Product,
} from '../domain/product';
import ProductCard from './ProductCard';
import EmptyState from './EmptyState';

type LoadStatus = 'loading' | 'ready' | 'error';

const ProductListPage: React.FC = () => {
  const history = useHistory();
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const isLoadingRef = useRef(false);

  const loadProducts = useCallback(async () => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setStatus('loading');
    setErrorMessage('');

    try {
      setProducts(await getProducts());
      setStatus('ready');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setStatus('error');
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useIonViewWillEnter(() => {
    void loadProducts();
  });

  const filteredProducts = filterProducts(products, { search, category });
  const productViews = filteredProducts.map(toProductView);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Catálogo de productos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonInput
          label="Buscar producto"
          labelPlacement="floating"
          fill="outline"
          placeholder="Escribe un nombre..."
          value={search}
          onIonInput={(event) =>
            setSearch(String(event.detail.value ?? ''))
          }
        />

        <IonItem className="ion-margin-top">
          <IonLabel>Categoría</IonLabel>
          <IonSelect
            value={category}
            placeholder="Todas las categorías"
            onIonChange={(event) =>
              setCategory(String(event.detail.value ?? ''))
            }
          >
            <IonSelectOption value="">Todas las categorías</IonSelectOption>
            {CATEGORIES.map((item) => (
              <IonSelectOption key={item} value={item}>
                {item}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <IonButton
          expand="block"
          className="ion-margin-top"
          routerLink="/productos/nuevo"
        >
          Nuevo producto
        </IonButton>

        {status === 'loading' && (
          <p className="ion-padding">Cargando productos...</p>
        )}

        {status === 'error' && (
          <EmptyState
            title="No se pudo cargar el catálogo"
            message={errorMessage}
            actionLabel="Reintentar"
            onAction={() => void loadProducts()}
          />
        )}

        {status === 'ready' && products.length === 0 && (
          <EmptyState
            title="Todavía no hay productos"
            message="Crea un producto para comenzar tu catálogo."
            actionLabel="Crear producto"
            onAction={() => history.push('/productos/nuevo')}
          />
        )}

        {status === 'ready' &&
          products.length > 0 &&
          productViews.length === 0 && (
            <EmptyState
              title="Sin resultados"
              message="No hay productos que coincidan con tu búsqueda y categoría."
            />
          )}

        {status === 'ready' && productViews.length > 0 && (
          <IonList className="ion-margin-top">
            {productViews.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(id) => history.push(`/productos/${id}`)}
              />
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductListPage;