import { useState } from 'react'
import './App.css'
import { Api } from './lib/api'

function App() {
  const [result, SetResult] = useState('');
  async function test() {
    const data = await Api.test();
    const res = JSON.stringify(data);
    SetResult(res);
  }
  return (
    <>
      <div>
        <button type="button" onClick={test}>{result}</button>
      </div>
    </>
  )
}

export default App
