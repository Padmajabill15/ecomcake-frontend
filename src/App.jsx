import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserRegister from './UserRegister';
import Navbar from './Components/Navbar';
import UserLogin from './UserLogin';
import ProductDisplay from './ProductDisplay';
import Adminlogin from './Adminlogin';
import Addproducts from './Addproducts';
// import Home from './Home';
import Forgotpwd from './Components/Forgotpwd';
import ResetLink from './Components/ResetLink';
import Logout from './Components/Logout';
 import AddtoCart from './AddtoCart';
import ViewProduct from './ViewProduct';
import Home from './Home';
import Ordersuccess from './Ordersuccess';
import CheckoutPage from './CheckoutPage';
import OrderModule from './OrderModule';
import ProductTracking from './ProductTracking';
import Myorders from './Myorders';
import ProductModify from './ProductModify';
import EditProductImages from './ImageModify';
function App() {
  const [role, setRole] = useState(localStorage.getItem("role"))


  const updaterole = (role) => { //user
    setRole(role);
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
  };
  return (
    <>
      <Router>
        <Navbar role={role} />
        <Routes>
          <Route path='/' element={<Home/>}></Route>
         {/* <Route path='/' element={<Home />}></Route> */}
          <Route path='/pdisplay' element={<ProductDisplay updaterole={updaterole}></ProductDisplay>}></Route>
            
          <Route path='/Signup' element={<UserRegister />}></Route>
          <Route path='/Signup' element={<UserRegister />}></Route>
          <Route path='/Signin' element={<UserLogin updaterole={updaterole} />}></Route>
          <Route path='/forgotpassword' element={<Forgotpwd />}></Route>
          <Route path='/resetLink' element={<ResetLink />}></Route>
<Route path='/editimage/:id' element={<EditProductImages />}></Route>
          <Route path='/admin-signin' element={<Adminlogin updaterole={updaterole}></Adminlogin>}></Route>
          <Route path='/addProducts' element={<Addproducts />}></Route>
           <Route path='/AddtoCart' element={<AddtoCart/>}></Route> 
            <Route path='/orderModule' element={<OrderModule/>}></Route> 
              <Route path='/myOrders' element={<Myorders/>}></Route>
             <Route path="/order/:id/:billNumber" element={<ProductTracking/>}></Route> 
        <Route path='/viewProduct/:id' element={<ViewProduct></ViewProduct>}></Route>
          {/* <Route path='/ProductDisplay' element={<ProductDisplay updaterole={updaterole}></ProductDisplay>}></Route> */}
          <Route path='/Logout' element={<Logout updaterole={updaterole}></Logout>}></Route>
          <Route path='/order-success' element={<Ordersuccess/>}></Route>
          <Route
  path="/checkout"
  element={<CheckoutPage  />}
  
/>
 <Route path='/productModify' element={<ProductModify/>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
