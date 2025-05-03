import PropTypes from "prop-types";

import { LayoutProvider } from "context/LayoutContext";
import { LoadingProvider } from "context/LoadingContext";
import { NavigationProvider } from "context/NavigationContext";
import { NotificationProvider } from "context/NotificationContext";

import Header from "../Header";
import Navigation from "../Navigation";
import MainBox from "./modules/MainBox";

const Layout = ({ children }) => (
  <LayoutProvider>
    <NotificationProvider>
      <div className="layout-content-border-2">
        <div className="layout-content-border">
          <div className="layout-content">
            <div className="main-container">
              <NavigationProvider>
                <Navigation />
              </NavigationProvider>
              <MainBox>
                <>
                  <Header />
                  <main className="content">
                    <LoadingProvider>{children}</LoadingProvider>
                  </main>
                  <footer>
                    <p style={{ color: "#6c757d" }}>
                      Icarus {new Date().getFullYear()}
                    </p>
                  </footer>
                </>
              </MainBox>
            </div>
          </div>
        </div>
      </div>
    </NotificationProvider>
  </LayoutProvider>
);

Layout.propTypes = {
  children: PropTypes.element.isRequired
};

export default Layout;
