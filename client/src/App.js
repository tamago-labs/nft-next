

import Header from "./components/header";
import Jumbotron from "./components/jumbotron";
import Main from "./components/main"
import Footer from "./components/footer";

function App() {
  return (
    <div>
      <Header />
      <Jumbotron />
      <div style={{ display: "flex"  }}>
        <Main />
      </div>

      <Footer />
    </div>
  );
}

export default App;
