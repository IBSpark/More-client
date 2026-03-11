import React, { useEffect, useState } from "react";
import "./History.css";

export default function History() {

  const [history, setHistory] = useState([]);

  useEffect(() => {

    const fetchHistory = async () => {

      try {

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/history`
        );

        const data = await res.json();

        setHistory(data);

      } catch (err) {

        console.error(err);

      }

    };

    fetchHistory();

  }, []);

  return (

    <div className="history-page">

      <h2>Generation History</h2>

      {history.map((item) => (

        <div key={item._id} className="history-card">

          <p className="history-text">
            {item.text.slice(0,80)}...
          </p>

          <p className="history-voice">
            Voice: {item.voice}
          </p>

          <audio controls src={item.audioUrl}></audio>

          <a href={item.audioUrl} download>
            <button>Download</button>
          </a>

        </div>

      ))}

    </div>

  );

}