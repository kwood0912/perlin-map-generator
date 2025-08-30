import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import ParcelBound from './components/routes/ParcelBound';
import NightsOfNil from './components/routes/NightsOfNil';
import Home from './components/routes/Home';

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    index: true,
  },
  {
    path: "/parcelbound",
    Component: ParcelBound,
  },
  {
    path: "/nightsofnil",
    Component: NightsOfNil,
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App
