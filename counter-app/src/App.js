import React from 'react';
import {useState , useEffect } from 'react';
function App(){
    const [count, setCount] = useState(0);
    useEffect(() => {
        console.log('Count Updated ',count);
        
    });

    return(
      <>
          
            <h1>Hello, React!</h1>
            <h4>You Clicked {count} times</h4>
            <button onClick={() => setCount(count + 1)}>Add</button>
            <button onClick={() => setCount(count - 1)}>Sub</button>

        </>
    );
}
export default App;