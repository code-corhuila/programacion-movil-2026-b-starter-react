import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonPage,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { getErrorMessage } from '../data/api-error';
import { getProducts } from '../data/products-api';
import { CATEGORIES, filterProducts, type Product } from '../domain/product';
import EmptyState from './EmptyState';
import ProductCard from './ProductCard';

/** Valor del selector para «sin filtro de categoría» (el dominio lo entiende como cadena vacía). */
const ALL_CATEGORIES = 'todas';

type LoadStatus = 'loading' | 'ready' | 'error';

/**
 * Pantalla: lista de productos (ruta /productos).
 * Autor: Andrés Felipe Gómez Anacona.
 *
 *  - `useState` guarda los productos, el estado de la carga, el mensaje de error y los filtros;
 *  - `useEffect` con `[]` carga la lista UNA vez, al abrir la pantalla;
 *  - `useIonViewWillEnter` la recarga cuando la persona VUELVE a esta pantalla (Ionic mantiene la
 *    página en memoria, así que sin esto no se vería un producto recién creado o eliminado);
 *  - la lista visible se DERIVA con `filterProducts` (no se guarda como estado).
 */
const ProductListPage: React.FC = () => {
  const history = useHistory();
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const isLoadingRef = useRef(false);

  const loadProducts = useCallback(async () => {
    if (isLoadingRef.current) return; // evita pedir la lista dos veces a la vez
    isLoadingRef.current = true;
    // Si ya había lista, se conserva en pantalla mientras se refresca (sin parpadeo).
    setStatus((previous) => (previous === 'ready' ? previous : 'loading'));
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

  const visibleProducts = useMemo(
    () =>
      filterProducts(products, {
        search,
        category: category === ALL_CATEGORIES ? '' : category,
      }),
    [products, search, category],
  );

  const clearFilters = () => {
    setSearch('');
    setCategory(ALL_CATEGORIES);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Productos</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={search}
            placeholder="Buscar por nombre"
            debounce={0}
            onIonInput={(event) => setSearch(event.detail.value ?? '')}
          />
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {status === 'loading' && (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" />
            <p>Cargando productos…</p>
          </div>
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
            message="Cree el primer producto del catálogo."
            actionLabel="Nuevo producto"
            onAction={() => history.push('/productos/nuevo')}
          />
        )}

        {status === 'ready' && products.length > 0 && (
          <>
            <IonItem lines="none">
              <IonSelect
                label="Categoría"
                labelPlacement="start"
                interface="popover"
                value={category}
                onIonChange={(event) => setCategory(String(event.detail.value ?? ALL_CATEGORIES))}
              >
                <IonSelectOption value={ALL_CATEGORIES}>Todas</IonSelectOption>
                {CATEGORIES.map((item) => (
                  <IonSelectOption key={item} value={item}>
                    {item}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            {visibleProducts.length === 0 ? (
              <EmptyState
                title="Sin resultados"
                message="Ningún producto coincide con la búsqueda o la categoría."
                actionLabel="Limpiar filtros"
                onAction={clearFilters}
              />
            ) : (
              visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)
            )}
          </>
        )}

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton routerLink="/productos/nuevo" aria-label="Nuevo producto">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ProductListPage;