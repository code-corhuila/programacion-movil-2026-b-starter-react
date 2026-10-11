import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
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
import EmptyState from './EmptyState';
import ProductCard from './ProductCard';

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
      const data = await getProducts();
      setProducts(data);
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

  const filteredProducts = filterProducts(products, {
    search,
    category,
  });

  const hasFilters =
    search.trim() !== '' || category !== '';

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Productos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="ion-padding">
          <IonInput
            label="Buscar producto"
            labelPlacement="stacked"
            placeholder="Escriba un nombre"
            value={search}
            onIonInput={(event) =>
              setSearch(String(event.detail.value ?? ''))
            }
          />

          <div className="ion-margin-top">
            <IonButton
              size="small"
              fill={category === '' ? 'solid' : 'outline'}
              onClick={() => setCategory('')}
            >
              Todas
            </IonButton>

            {CATEGORIES.map((item) => (
              <IonButton
                key={item}
                size="small"
                fill={category === item ? 'solid' : 'outline'}
                onClick={() => setCategory(item)}
              >
                {item}
              </IonButton>
            ))}
          </div>
        </div>

        {status === 'loading' && (
          <p className="ion-padding">
            Cargando productos...
          </p>
        )}

        {status === 'error' && (
          <EmptyState
            title="No se pudo cargar"
            message={errorMessage}
            actionLabel="Reintentar"
            onAction={() => void loadProducts()}
          />
        )}

        {status === 'ready' && products.length === 0 && (
          <EmptyState
            title="Sin productos"
            message="Todavía no hay productos registrados."
          />
        )}

        {status === 'ready' &&
          products.length > 0 &&
          filteredProducts.length === 0 &&
          hasFilters && (
            <EmptyState
              title="Sin resultados"
              message="No hay productos que coincidan con la búsqueda o categoría seleccionada."
            />
          )}

        {status === 'ready' &&
          filteredProducts.length > 0 && (
            <div>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={toProductView(product)}
                  onSelect={(id) =>
                    history.push(`/productos/${id}`)
                  }
                />
              ))}
            </div>
          )}

        <IonButton
          routerLink="/productos/nuevo"
          expand="block"
          className="ion-margin"
        >
          Nuevo producto
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProductListPage;