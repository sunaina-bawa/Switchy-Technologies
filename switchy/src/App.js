import React from 'react';
import EnergyUsesGraph from './components/EnergyUsesGraph';
import EnergyDistributionGraph from './components/EnergyDistributionGraph';
import Header from './components/Header';
import "./App.css"


function App() {
  

  return (
    <div className="App">
<Header/>
   <EnergyUsesGraph/>
   <EnergyDistributionGraph/>
    </div>
  );
}

export default App;