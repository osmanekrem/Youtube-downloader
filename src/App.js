import YoutubeVideo from "./YoutubeVideo";
import History from "./History";
import { useState, useEffect, useRef } from 'react';

function App() {

  const [url, setUrl] = useState("")
  const isDownloadable = useRef(false)
  const [history, setHistory] = useState(
    localStorage.getItem("history")
      ? JSON.parse(localStorage.getItem("history"))
      : []
  );
  const [youtube, setYoutube] = useState(false)
  const [loading, setLoading] = useState(false)

  const clearHistory = () => {
    setHistory([])
  }

  const downloadAgain = (url) => {
    isDownloadable.current = true
    setUrl(url)
  }

  const clickHandle = () => {
    isDownloadable.current = true
    download()
  }

  useEffect(() => {
    if (isDownloadable.current === true){
      download()
    }
  }, [url])

  useEffect(() => {
    if (youtube) {
      if (!history.find((h) => h.url === url)) {
        let newHistory = {
          url: url,
          title: youtube.info.title,
        };
        setHistory([...history, newHistory]);
      }
    }
  }, [youtube]);

  const download = () => {    
    setLoading(true)
    if(url){
      fetch(`http://127.0.0.1:5000/api/youtube?url=${url}`)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        setYoutube(data);
      });
    }
  }

  return (
    <div className="App">
      <form action="" method="post" onSubmit={e => e.preventDefault()}>
          <h3>Youtube Downloader</h3>
          <div className="search">
              <input type="text" onChange={e => setUrl(e.target.value)} placeholder="Youtube URL"/>
              <button type="submit" onClick={download}>Download</button>
          </div>
          {loading && <div className="loader">Yükleniyor...</div>}
      </form>
      {youtube && loading === false && <YoutubeVideo youtube={youtube} />}
      {history.length > 0 && <History list={history} downloadAgain={downloadAgain} clearHistory={clearHistory} />}
    </div>
  );
}

export default App;
