import { useState } from 'react'

import './App.css'
import LocationFinder from './components/locofind';
import Test from './components/test1';
import './index.css';
function App() {


  return (
    <>
      <div className="app h-screen  bg-blue-200 ">
        
        <LocationFinder />
        {/* <Test/> */}
      </div>
    </>
  );
}

export default App
