import React, { useState } from 'react';
import '../styles/DictionaryApp.css';

const DictionaryApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk memuat data berdasarkan huruf pertama
  const fetchData = async (letter) => {
    setIsLoading(true);
    try {
      const module = await import(`../data/${letter.toUpperCase()}.json`);
      setData(module.default);
    } catch (error) {
      console.error('Error loading data:', error);
      setData([]); // Kosongkan data jika file tidak ditemukan
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const firstLetter = query[0].toLowerCase();
      fetchData(firstLetter);
    } else {
      setData([]); // Kosongkan data jika input kosong
    }
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
