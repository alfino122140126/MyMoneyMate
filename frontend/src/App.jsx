import React, { useEffect } from 'react';
import api from './api/axios';

function App() {
  useEffect(() => {
    api.get('/health')
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">MyMoneyMate</h1>
    </div>
  );
}

export default App;