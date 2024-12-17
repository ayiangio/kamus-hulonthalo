import React, { useState, useEffect } from 'react';
import '../styles/DictionaryApp.css';

const DictionaryApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Memuat semua data JSON sekaligus
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const allDataPromises = letters.map(async (letter) => {
          const module = await import(`../data/${letter}.json`);
          return module.default;
        });
        const allData = await Promise.all(allDataPromises);
        setData(allData.flat());
      } catch (error) {
        console.error('Error loading data:', error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredWords = data.filter((entry) =>
    entry.word.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <header className="header">
        <h1>Kamus Gorontalo Sederhana</h1>
        <p>Masukan Kata Bahasa Gorontalo Yang Ingin Dicari Artinya</p>
      </header>
      <input
        type="text"
        placeholder="Cari kata..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="input"
      />
      <div>
        {isLoading ? (
          <p style={{ textAlign: 'center' }}>Memuat data...</p>
        ) : filteredWords.length > 0 ? (
          filteredWords.map((entry, index) => (
            <div key={index} className="word-container">
              <h3 className="word-title">{entry.word}</h3>
              <p className="word-definition">{entry.definition}</p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>
            {searchQuery
              ? 'Tidak ada kata yang cocok.'
              : 'Silakan ketik kata untuk mencari.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default DictionaryApp;
