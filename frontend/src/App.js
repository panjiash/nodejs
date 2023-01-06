import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AddProduct from './components/Product/AddProduct';
import ProductList from './components/Product/ProductList';
import EditProduct from './components/Product/EditProduct';
import Register from "./components/Register";
import BlogList from './components/Blog/BlogList';
import AddBlog from './components/Blog/AddBlog'
import EditBlog from './components/Blog/EditBlog';
import UserGraph from './components/UserGraph/UserGraph';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/products' element={<ProductList />} />
          <Route path='/products/add' element={<AddProduct />} />
          <Route path='/products/edit/:id' element={<EditProduct />} />
          <Route path='/blogs' element={<BlogList />} />
          <Route path='/blogs/add' element={<AddBlog />} />
          <Route path='/blogs/edit/:id' element={<EditBlog />} />
          <Route path='/usergraph' element={<UserGraph />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;