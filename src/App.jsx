import { AuthProvider } from "context/AuthContext";
import { ImageCacheProvider } from "context/ImageCacheContext";

import MainRouter from "router";
import ErrorBoundary from "router/modules/ErrorBoundary";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "assets/styles/cores.css";
import "assets/styles/fontes.css";
import "assets/styles/imgs.scss";
import "assets/styles/Restyling.scss";
import "assets/styles/bootstrap.css";
import "assets/styles/App.scss";
import "assets/styles/icons.scss";

const App = () => (
  <AuthProvider>
    <ErrorBoundary>
      <ImageCacheProvider>
        <MainRouter />
      </ImageCacheProvider>
    </ErrorBoundary>
  </AuthProvider>
);

export default App;
