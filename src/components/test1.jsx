import React, { useState, useEffect } from "react";

function Test() {
  const [data, setData] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    const fetchData = async()=>{
        try{
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            if(!response.ok)
                throw new Error('Network response was not ok');
                const result = await response.json();
                setData(result);
            
        }
        catch(error){
            setError(err.message);
    }
    finally{
        setLoading(false);
    }
  };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>API Data:</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.id}: {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Test;
