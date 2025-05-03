import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet
} from "react-router-dom";

import Layout from "components/Layout";

import Error404 from "./modules/Erro404";
import LoadingScreen from "./modules/LoadingScreen";
import PrivateRoute from "./modules/PrivateRoute";

// #region imports de paginas
const Home = lazy(() => import("pages/home/index"));
const Login = lazy(() => import("pages/login"));
const PrimeiroAcesso = lazy(() => import("pages/home/PrimeiroAcesso"));
// #endregion

// #region imports de paginas de teste
const TestLoadingScreen = lazy(() => import("pages/test/LoadingTest"));
// #endregion

const MainRouter = () => {
  const routeConfig = createBrowserRouter(
    [
      { path: "*", element: <Error404 /> },
      { path: "/", element: <Navigate to="/login" /> },
      { path: "/login", element: <Login /> },
      {
        path: "/app",
        element: (
          <Layout NomePaginaAtual="Home">
            <PrivateRoute element={Outlet} />
          </Layout>
        ),
        children: [
          // #region Test
          {
            path: "test",
            children: [
              {
                path: "loading-screen",
                element: (
                  <Suspense fallback={<LoadingScreen />}>
                    <TestLoadingScreen />
                  </Suspense>
                )
              }
            ]
          },
          // #endregion

          // #region home
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <PrimeiroAcesso />
              </Suspense>
            )
          },
          {
            path: "home",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <Home />
              </Suspense>
            )
          }
          // #endregion
        ]
      }
    ],
    {
      future: {
        v7_relativeSplatPath: true
      }
    }
  );

  return (
    <RouterProvider
      future={{
        v7_startTransition: true
      }}
      router={routeConfig}
    />
  );
};

export default MainRouter;
