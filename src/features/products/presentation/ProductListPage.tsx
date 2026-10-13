
import {
  IonButton,
  IonButtons,
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Productos</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/productos/nuevo">
              Nuevo
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="ion-padding">
          <IonInput
            label="Buscar productos"
            labelPlacement="stacked"
            placeholder="Escribe un nombre..."
            value={search}
            onIonInput={(event) => setSearch(event.detail.value ?? '')}
            clearInput
          />

          <div className="ion-margin-top">
            <p>Filtrar por categoría</p>
            <IonButtons className="ion-flex-wrap">
              <IonButton
                fill={category === '' ? 'solid' : 'outline'}
                onClick={() => setCategory('')}
              >
                Todas
              </IonButton>

              {CATEGORIES.map((item) => (
                <IonButton
                  key={item}
                  fill={category === item ? 'solid' : 'outline'}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </IonButton>
              ))}
            </IonButtons>
          </div>
        </div>

        {status === 'loading' && (
          <p className="ion-padding" role="status">
            Cargando productos…
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
            title="No hay productos"
            message="Todavía no se han registrado productos."
            actionLabel="Crear producto"
            onAction={() => history.push('/productos/nuevo')}
          />
        )}

        {status === 'ready' &&
          products.length > 0 &&
          filteredProducts.length === 0 && (
            <EmptyState
              title="Sin resultados"
              message="No hay productos que coincidan con tu búsqueda o categoría."
              actionLabel="Limpiar filtros"
              onAction={() => {
                setSearch('');
                setCategory('');
              }}
            />
          )}

        {status === 'ready' &&
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={toProductView(product)}
              onSelect={(id) => history.push(`/productos/${id}`)}
            />
          ))}
      </IonContent>
    </IonPage>
  );
};

export default ProductListPage;
