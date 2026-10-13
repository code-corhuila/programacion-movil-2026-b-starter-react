import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

import ProductDetailPage from '../features/products/presentation/ProductDetailPage';
import ProductFormPage from '../features/products/presentation/ProductFormPage';
import ProductListPage from '../features/products/presentation/ProductListPage';

/* CSS base de Ionic (obligatorio) */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Tema de la aplicación */
import './theme/variables.css';

/**
 * Estructura principal de la app y rutas.
 * Autor: Andrés Felipe Gómez Anacona.
 *
 * React Router v5 puede activar la ruta equivocada si dos patrones coinciden
 * (/productos/nuevo también encajaría con /productos/:id). Por eso :id se restringe
 * a dígitos y «nuevo» no lo activa.
 */
const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/productos" component={ProductListPage} />
        <Route exact path="/productos/nuevo" component={ProductFormPage} />
        <Route exact path="/productos/:id(\d+)" component={ProductDetailPage} />
        <Route exact path="/productos/:id(\d+)/editar" component={ProductFormPage} />
        <Redirect exact from="/" to="/productos" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;