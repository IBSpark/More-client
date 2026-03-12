import React, { useEffect, useState } from "react";
import "./History.css";

export default function History() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchHistory = async () => {

      try {

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/history`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        const data = await res.json();

        setHistory(data);

      } catch (err) {

        console.error("History fetch error:", err);

      } finally {

        setLoading(false);

      }

    };

    fetchHistory();

  }, []);


  if (loading) {
    return (
      <div className="history-page">
        <h2>Loading history...</h2>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="history-page">
        <h2>No history yet</h2>
        <p>Generate audio to see your history here.</p>
      </div>
    );
  }


  return (

    <div className="history-page">

      <h2>Generation History</h2>

      <div className="history-list">

        {history.map((item) => (

          <div key={item._id} className="history-card">

            <p className="history-text">
              {item.text.length > 80
                ? item.text.slice(0,80) + "..."
                : item.text}
            </p>

            <p className="history-voice">
              Voice: {item.voice}
            </p>

            <p className="history-char">
              Characters: {item.charactersUsed}
            </p>

            {item.audioUrl && (
              <>
                <audio controls src={item.audioUrl}></audio>

                <a href={item.audioUrl} download>
                  <button className="download-btn">
                    Download
                  </button>
                </a>
              </>
            )}

          </div>

        ))}

      </div>

    </div>

  );

}