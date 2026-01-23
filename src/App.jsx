import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
// import axios from 'axios'
import './App.css'

const CATEGORIES = ['Serie/anime', 'Película', 'Juego']
const STATUS_OPTIONS = [
  { value: 'want_to_watch', label: 'Pendiente', color: '#3b82f6' },
  { value: 'watching', label: 'Viendo', color: '#f59e0b' },
  { value: 'completed', label: 'Terminada', color: '#10b981' },
  { value: 'dropped', label: 'Abandonada', color: '#ef4444' }
]

// const JSONBIN_API_KEY = import.meta.env.VITE_JSONBIN_API_KEY || ''
// const JSONBIN_BIN_ID = import.meta.env.VITE_JSONBIN_BIN_ID || ''

function App() {
  const [items, setItems] = useState(JSON.parse(localStorage.getItem('watchlistItems')) || [])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({ title: '', category: 'Serie/anime', status: 'want_to_watch' })
  const [isLoading, setIsLoading] = useState(false)
  //const [syncStatus, setSyncStatus] = useState('')
  const debounceTimer = useRef(null)
  const isMounted = useRef(true)
  //const isSyncing = useRef(false)

  // const fetchFromJSONBin = async () => {
  //   if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID) return null

  //   try {
  //     const response = await axios.get(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
  //       headers: {
  //         'X-Master-Key': JSONBIN_API_KEY
  //       }
  //     })
  //     return response.data.record
  //   } catch (error) {
  //     console.error('Error fetching from JSONBin:', error)
  //     return null
  //   }
  // }

  // const saveToJSONBin = async (data) => {
  //   if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID) return false
  //   if (isSyncing.current) return false

  //   isSyncing.current = true
  //   setSyncStatus('Syncing...')

  //   try {
  //     await axios.put(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
  //       items: data
  //     }, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-Master-Key': JSONBIN_API_KEY
  //       }
  //     })
      
  //     if (isMounted.current) {
  //       setSyncStatus('Synced!')
  //       setTimeout(() => setSyncStatus(''), 2000)
  //     }
  //     return true
  //   } catch (error) {
  //     console.error('Error saving to JSONBin:', error)
  //     if (isMounted.current) {
  //       setSyncStatus('Sync failed')
  //       setTimeout(() => setSyncStatus(''), 3000)
  //     }
  //     return false
  //   } finally {
  //     isSyncing.current = false
  //   }
  // }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      
      const savedData = localStorage.getItem('watchlistItems')
      
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          setItems(parsedData)
        } catch (err) {
          console.error('Error parsing saved data:', err)
        }
      }
      
      const jsonBinData = false //await fetchFromJSONBin()
      if (jsonBinData && jsonBinData.items && isMounted.current) {
        setItems(jsonBinData.items)
        localStorage.setItem('watchlistItems', JSON.stringify(jsonBinData.items))
      } else if (!savedData && isMounted.current) {
        const initialData = {
          items: [
            { id: 1, title: 'Death Note', category: 'Serie/anime', status: 'watching', addedDate: '2026-01-22' },
            { id: 2, title: 'Attack on Titan', category: 'Serie/anime', status: 'watching', addedDate: '2026-01-22' },
            { id: 3, title: 'Kimetsu no Yaiba', category: 'Serie/anime', status: 'want_to_watch', addedDate: '2026-01-22' },
            { id: 4, title: 'Paprika', category: 'Película', status: 'want_to_watch', addedDate: '2026-01-22' },
            { id: 5, title: 'Suzume', category: 'Película', status: 'want_to_watch', addedDate: '2026-01-22' },
            { id: 6, title: 'Tokyo Godfathers', category: 'Película', status: 'want_to_watch', addedDate: '2026-01-22' },
            { id: 7, title: 'El viento se levanta', category: 'Película', status: 'completed', addedDate: '2026-01-22' },
            { id: 8, title: 'Kiki Delivery Service', category: 'Película', status: 'completed', addedDate: '2026-01-22' },
            { id: 9, title: 'Susurros del corazón', category: 'Película', status: 'completed', addedDate: '2026-01-22' },
            { id: 10, title: 'Weathering with you', category: 'Película', status: 'want_to_watch', addedDate: '2026-01-22' },
            { id: 11, title: 'Portal', category: 'Juego', status: 'want_to_watch', addedDate: '2026-01-22' },
            { id: 12, title: 'Layton y la villa misteriosa', category: 'Juego', status: 'watching', addedDate: '2026-01-22' },
          ]
        }
        setItems(initialData.items)
        localStorage.setItem('watchlistItems', JSON.stringify(initialData.items))
      }
      
      setIsLoading(false)
    }

    loadData()
    
    return () => {
      isMounted.current = false
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('watchlistItems', JSON.stringify(items))
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    
    debounceTimer.current = setTimeout(() => {
      if (items.length > 0) {
        false //saveToJSONBin(items)
      }
    }, 1000)
  }, [items])

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesStatus && matchesSearch
  })

  const handleAddItem = (e) => {
    e.preventDefault()
    const id = Math.max(...items.map(i => i.id), 0) + 1
    const item = {
      id,
      title: newItem.title,
      category: newItem.category,
      status: newItem.status,
      addedDate: new Date().toISOString().split('T')[0]
    }
    setItems([...items, item])
    setNewItem({ title: '', category: 'Película', status: 'want_to_watch' })
    setShowAddForm(false)
  }

  const handleUpdateStatus = (id, newStatus) => {
    setItems(items.map(item => item.id === id ? { ...item, status: newStatus } : item))
  }

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleResetData = async () => {
    if (window.confirm('Are you sure you want to reset all data to the default? This will delete all your changes for everyone.')) {
      const emptyData = []
      setItems(emptyData)
      localStorage.setItem('watchlistItems', JSON.stringify(emptyData))
      //await saveToJSONBin(emptyData)
    }
  }

  const getStatusLabel = (status) => {
    return STATUS_OPTIONS.find(s => s.value === status)?.label || status
  }

  const getStatusColor = (status) => {
    return STATUS_OPTIONS.find(s => s.value === status)?.color || '#6b7280'
  }

  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>LA Watchlist</h1>
          <div className="header-buttons">
            {/* {syncStatus && <span className="sync-status">{syncStatus}</span>} */}
            <button className="reset-button" onClick={handleResetData} disabled={isLoading}>
              Borrar todo
            </button>
            <button className="add-button" onClick={() => setShowAddForm(!showAddForm)} disabled={isLoading}>
              {showAddForm ? 'Cancel' : '+ Add Item'}
            </button>
          </div>
        </header>

        {isLoading && <div className="loading">Cargando data...</div>}

        {showAddForm && (
          <form className="add-form" onSubmit={handleAddItem}>
            <input
              type="text"
              placeholder="Title"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              required
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={newItem.status}
              onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
            <button type="submit">Nuevo...</button>
          </form>
        )}

        <div className="filters">
          <div className="filter-group">
            <label>Tipo:</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="all">Todo</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Estado:</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="all">Todo</option>
              {STATUS_OPTIONS.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Buscar:</label>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="stats">
          <span>Total: {filteredItems.length}</span>
          <span>Viendo: {filteredItems.filter(i => i.status === 'watching').length}</span>
          <span>Terminadas: {filteredItems.filter(i => i.status === 'completed').length}</span>
        </div>

        <div className="watchlist">
          {filteredItems.length === 0 ? (
            <p className="empty-state">No hay nada todavía :/</p>
          ) : (
            filteredItems.map(item => (
              <div key={item.id} className="watchlist-item">
                <div className="item-content">
                  <h3 className="item-title">{item.title}</h3>
                  <div className="item-meta">
                    <span className="item-category">{item.category}</span>
                    <span className="item-date">{item.addedDate}</span>
                  </div>
                  <span 
                    className="item-status" 
                    style={{ backgroundColor: getStatusColor(item.status) }}
                  >
                    {getStatusLabel(item.status)}
                  </span>
                </div>
                <div className="item-actions">
                  <select
                    value={item.status}
                    onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                    className="status-select"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    Borrar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Router>
  )
}

export default App